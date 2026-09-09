import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { AvailabilityModule } from './availability/availability.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfessionalsModule } from './professionals/professionals.module.js';
import { ServicesModule } from './services/services.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    TenantsModule,
    AuthModule,
    ProfessionalsModule,
    ServicesModule,
    AvailabilityModule,
    ClientsModule,
  ],
})
export class AppModule {}
