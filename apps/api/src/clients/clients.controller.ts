import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    role: string;
  };
}

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(
      request.user.tenantId,
      dto,
    );
  }

  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.clientsService.findAll(
      request.user.tenantId,
    );
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.clientsService.findOne(
      request.user.tenantId,
      id,
    );
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(
      request.user.tenantId,
      id,
      dto,
    );
  }
}
