import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { AppointmentQueryDto } from './dto/appointment-query.dto.js';
import {
  AppointmentStatusValue,
  UpdateAppointmentStatusDto,
} from './dto/update-appointment-status.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

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
        status: dto.status as AppointmentStatusValue,
      },
      include: {
        professional: true,
        client: true,
        service: true,
      },
    });
  }
}
