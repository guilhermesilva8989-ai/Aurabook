import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfessionalDto } from './dto/create-professional.dto.js';
import { UpdateProfessionalDto } from './dto/update-professional.dto.js';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMe(
    userId: string,
    tenantId: string,
    dto: CreateProfessionalDto,
  ) {
    const existingProfessional =
      await this.prisma.professional.findUnique({
        where: {
          userId,
        },
      });

    if (existingProfessional) {
      throw new ConflictException(
        'Este usuário já possui um perfil profissional.',
      );
    }

    return this.prisma.professional.create({
      data: {
        tenantId,
        userId,
        name: dto.name,
        phone: dto.phone,
        specialty: dto.specialty,
        status: 'APPROVED',
      },
    });
  }

  async findMe(userId: string) {
    const professional =
      await this.prisma.professional.findUnique({
        where: {
          userId,
        },
      });

    if (!professional) {
      throw new NotFoundException(
        'Perfil profissional não encontrado.',
      );
    }

    return professional;
  }

  async updateMe(
    userId: string,
    dto: UpdateProfessionalDto,
  ) {
    await this.findMe(userId);

    return this.prisma.professional.update({
      where: {
        userId,
      },
      data: {
        name: dto.name,
        phone: dto.phone,
        specialty: dto.specialty,
      },
    });
  }
}
