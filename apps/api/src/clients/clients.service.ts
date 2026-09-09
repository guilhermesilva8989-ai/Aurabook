import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    dto: CreateClientDto,
  ) {
    return this.prisma.client.create({
      data: {
        tenantId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : undefined,
        notes: dto.notes,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.client.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(
    tenantId: string,
    id: string,
  ) {
    const client =
      await this.prisma.client.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!client) {
      throw new NotFoundException(
        'Cliente não encontrado.',
      );
    }

    return client;
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateClientDto,
  ) {
    await this.findOne(tenantId, id);

    return this.prisma.client.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : undefined,
        notes: dto.notes,
      },
    });
  }
}
