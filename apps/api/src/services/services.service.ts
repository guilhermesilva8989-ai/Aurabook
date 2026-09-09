import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    dto: CreateServiceDto,
  ) {
    return this.prisma.service.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        price: dto.price,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.service.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    tenantId: string,
    id: string,
  ) {
    const service =
      await this.prisma.service.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!service) {
      throw new NotFoundException(
        'Serviço não encontrado.',
      );
    }

    return service;
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateServiceDto,
  ) {
    await this.findOne(tenantId, id);

    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        price: dto.price,
        active: dto.active,
      },
    });
  }

  async deactivate(
    tenantId: string,
    id: string,
  ) {
    await this.findOne(tenantId, id);

    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }
}
