import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  private createSlug(name: string) {
    const base = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${base || 'negocio'}-${randomUUID().slice(0, 8)}`;
  }

  createWithOwner(data: {
    businessName: string;
    ownerName: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const tenant = await transaction.tenant.create({
        data: {
          name: data.businessName,
          slug: this.createSlug(data.businessName),
        },
      });

      const user = await transaction.user.create({
        data: {
          tenantId: tenant.id,
          name: data.ownerName,
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          role: 'OWNER',
        },
      });

      await transaction.professional.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          name: data.ownerName,
          status: 'APPROVED',
        },
      });

      return {
        ...tenant,
        users: [user],
      };
    });
  }
}
