import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  private async getProfessional(
    userId: string,
    tenantId: string,
  ) {
    const professional =
      await this.prisma.professional.findFirst({
        where: {
          userId,
          tenantId,
          active: true,
        },
      });

    if (!professional) {
      throw new NotFoundException(
        'Perfil profissional não encontrado.',
      );
    }

    return professional;
  }

  async create(
    userId: string,
    tenantId: string,
    dto: CreateAvailabilityDto,
  ) {
    const professional =
      await this.getProfessional(userId, tenantId);

    const duplicate =
      await this.prisma.availability.findFirst({
        where: {
          professionalId: professional.id,
          dayOfWeek: dto.dayOfWeek,
          startTime: dto.startTime,
          endTime: dto.endTime,
          active: true,
        },
      });

    if (duplicate) {
      throw new ConflictException(
        'Este horário já está cadastrado.',
      );
    }

    return this.prisma.availability.create({
      data: {
        professionalId: professional.id,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async findMySchedule(
    userId: string,
    tenantId: string,
  ) {
    const professional =
      await this.getProfessional(userId, tenantId);

    return this.prisma.availability.findMany({
      where: {
        professionalId: professional.id,
        active: true,
      },
      orderBy: [
        {
          dayOfWeek: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
    });
  }

  async update(
    userId: string,
    tenantId: string,
    id: string,
    dto: UpdateAvailabilityDto,
  ) {
    const professional =
      await this.getProfessional(userId, tenantId);

    const availability =
      await this.prisma.availability.findFirst({
        where: {
          id,
          professionalId: professional.id,
        },
      });

    if (!availability) {
      throw new NotFoundException(
        'Horário não encontrado.',
      );
    }

    return this.prisma.availability.update({
      where: {
        id,
      },
      data: {
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        active: dto.active,
      },
    });
  }

  async deactivate(
    userId: string,
    tenantId: string,
    id: string,
  ) {
    const professional =
      await this.getProfessional(userId, tenantId);

    const availability =
      await this.prisma.availability.findFirst({
        where: {
          id,
          professionalId: professional.id,
        },
      });

    if (!availability) {
      throw new NotFoundException(
        'Horário não encontrado.',
      );
    }

    return this.prisma.availability.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }

  async setDayOff(
    userId: string,
    tenantId: string,
    dayOfWeek: number,
  ) {
    const professional =
      await this.getProfessional(userId, tenantId);

    const result =
      await this.prisma.availability.updateMany({
        where: {
          professionalId: professional.id,
          dayOfWeek,
          active: true,
        },
        data: {
          active: false,
        },
      });

    return {
      dayOfWeek,
      dayOff: true,
      deactivatedSlots: result.count,
    };
  }
}
