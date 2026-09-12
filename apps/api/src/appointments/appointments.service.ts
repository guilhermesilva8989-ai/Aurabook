import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { AppointmentQueryDto } from './dto/appointment-query.dto.js';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import type { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private timeToParts(time: string) {
    const [hour, minute] = time.split(':').map(Number);

    return {
      hour,
      minute,
    };
  }

  private async validateAvailability(
    tenantId: string,
    professionalId: string,
    startsAt: Date,
    endsAt: Date,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        timezone: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'Estabelecimento não encontrado.',
      );
    }

    const timezone = tenant.timezone;

    const localStart = DateTime.fromJSDate(startsAt, {
      zone: 'utc',
    }).setZone(timezone);

    const localEnd = DateTime.fromJSDate(endsAt, {
      zone: 'utc',
    }).setZone(timezone);

    if (!localStart.isValid || !localEnd.isValid) {
      throw new BadRequestException(
        'Não foi possível interpretar o horário do agendamento.',
      );
    }

    const availabilities =
      await this.prisma.availability.findMany({
        where: {
          professionalId,
          active: true,
        },
      });

    if (availabilities.length === 0) {
      throw new BadRequestException(
        'O profissional não possui disponibilidade configurada.',
      );
    }

    const candidateDays = [
      localStart.startOf('day'),
      localStart.minus({ days: 1 }).startOf('day'),
    ];

    for (const availability of availabilities) {
      for (const candidateDay of candidateDays) {
        const dayOfWeek = candidateDay.weekday % 7;

        if (dayOfWeek !== availability.dayOfWeek) {
          continue;
        }

        const startParts = this.timeToParts(
          availability.startTime,
        );

        const endParts = this.timeToParts(
          availability.endTime,
        );

        const windowStart = candidateDay.set({
          hour: startParts.hour,
          minute: startParts.minute,
          second: 0,
          millisecond: 0,
        });

        let windowEnd = candidateDay.set({
          hour: endParts.hour,
          minute: endParts.minute,
          second: 0,
          millisecond: 0,
        });

        if (
          windowEnd.toMillis() <=
          windowStart.toMillis()
        ) {
          windowEnd = windowEnd.plus({
            days: 1,
          });
        }

        const appointmentStartsInside =
          localStart.toMillis() >=
          windowStart.toMillis();

        const appointmentEndsInside =
          localEnd.toMillis() <=
          windowEnd.toMillis();

        if (
          appointmentStartsInside &&
          appointmentEndsInside
        ) {
          return;
        }
      }
    }

    throw new BadRequestException(
      'Horário fora da disponibilidade do profissional.',
    );
  }

  async create(
    tenantId: string,
    dto: CreateAppointmentDto,
  ) {
    const professional =
      await this.prisma.professional.findFirst({
        where: {
          id: dto.professionalId,
          tenantId,
          active: true,
        },
      });

    if (!professional) {
      throw new NotFoundException(
        'Profissional não encontrado.',
      );
    }

    const client =
      await this.prisma.client.findFirst({
        where: {
          id: dto.clientId,
          tenantId,
        },
      });

    if (!client) {
      throw new NotFoundException(
        'Cliente não encontrado.',
      );
    }

    const service =
      await this.prisma.service.findFirst({
        where: {
          id: dto.serviceId,
          tenantId,
          active: true,
        },
      });

    if (!service) {
      throw new NotFoundException(
        'Serviço não encontrado.',
      );
    }

    const startsAt = new Date(dto.startsAt);

    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException(
        'Data de início inválida.',
      );
    }

    const endsAt = new Date(
      startsAt.getTime() +
        service.duration * 60_000,
    );

    await this.validateAvailability(
      tenantId,
      professional.id,
      startsAt,
      endsAt,
    );

    const conflict =
      await this.prisma.appointment.findFirst({
        where: {
          tenantId,
          professionalId: professional.id,
          status: {
            notIn: [
              'CANCELLED',
              'NO_SHOW',
            ],
          },
          startsAt: {
            lt: endsAt,
          },
          endsAt: {
            gt: startsAt,
          },
        },
      });

    if (conflict) {
      throw new ConflictException(
        'O profissional já possui um agendamento neste horário.',
      );
    }

    return this.prisma.appointment.create({
      data: {
        tenantId,
        professionalId: professional.id,
        clientId: client.id,
        serviceId: service.id,
        startsAt,
        endsAt,
        notes: dto.notes,
      },
      include: {
        professional: true,
        client: true,
        service: true,
      },
    });
  }

  findAll(
    tenantId: string,
    query: AppointmentQueryDto,
  ) {
    let dateFilter:
      | {
          gte: Date;
          lt: Date;
        }
      | undefined;

    if (query.date) {
      const start = new Date(
        `${query.date}T00:00:00.000Z`,
      );

      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      dateFilter = {
        gte: start,
        lt: end,
      };
    }

    return this.prisma.appointment.findMany({
      where: {
        tenantId,
        professionalId:
          query.professionalId || undefined,
        status: query.status || undefined,
        startsAt: dateFilter,
      },
      include: {
        professional: true,
        client: true,
        service: true,
      },
      orderBy: {
        startsAt: 'asc',
      },
    });
  }

  async findOne(
    tenantId: string,
    id: string,
  ) {
    const appointment =
      await this.prisma.appointment.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          professional: true,
          client: true,
          service: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Agendamento não encontrado.',
      );
    }

    return appointment;
  }


  async update(
    tenantId: string,
    id: string,
    dto: UpdateAppointmentDto,
  ) {
    await this.findOne(tenantId, id);

    const professional =
      await this.prisma.professional.findFirst({
        where: {
          id: dto.professionalId,
          tenantId,
          active: true,
        },
      });

    if (!professional) {
      throw new NotFoundException(
        'Profissional não encontrado.',
      );
    }

    const client =
      await this.prisma.client.findFirst({
        where: {
          id: dto.clientId,
          tenantId,
        },
      });

    if (!client) {
      throw new NotFoundException(
        'Cliente não encontrado.',
      );
    }

    const service =
      await this.prisma.service.findFirst({
        where: {
          id: dto.serviceId,
          tenantId,
          active: true,
        },
      });

    if (!service) {
      throw new NotFoundException(
        'Serviço não encontrado.',
      );
    }

    const startsAt = new Date(dto.startsAt);

    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException(
        'Data de início inválida.',
      );
    }

    const endsAt = new Date(
      startsAt.getTime() +
        service.duration * 60_000,
    );

    await this.validateAvailability(
      tenantId,
      professional.id,
      startsAt,
      endsAt,
    );

    const conflict =
      await this.prisma.appointment.findFirst({
        where: {
          id: {
            not: id,
          },
          tenantId,
          professionalId: professional.id,
          status: {
            notIn: [
              'CANCELLED',
              'NO_SHOW',
            ],
          },
          startsAt: {
            lt: endsAt,
          },
          endsAt: {
            gt: startsAt,
          },
        },
      });

    if (conflict) {
      throw new ConflictException(
        'O profissional já possui um agendamento neste horário.',
      );
    }

    return this.prisma.appointment.update({
      where: {
        id,
      },
      data: {
        professionalId: professional.id,
        clientId: client.id,
        serviceId: service.id,
        startsAt,
        endsAt,
        notes: dto.notes ?? null,
      },
      include: {
        professional: true,
        client: true,
        service: true,
      },
    });
  }

  async updateStatus(
    tenantId: string,
    id: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    await this.findOne(tenantId, id);

    return this.prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
      include: {
        professional: true,
        client: true,
        service: true,
      },
    });
  }
}
