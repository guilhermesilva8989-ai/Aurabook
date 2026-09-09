import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateProfessionalDto } from './dto/create-professional.dto.js';
import { UpdateProfessionalDto } from './dto/update-professional.dto.js';
import { ProfessionalsService } from './professionals.service.js';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    role: string;
  };
}

@Controller('professionals')
@UseGuards(JwtAuthGuard)
export class ProfessionalsController {
  constructor(
    private readonly professionalsService: ProfessionalsService,
  ) {}

  @Post('me')
  createMe(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateProfessionalDto,
  ) {
    return this.professionalsService.createMe(
      request.user.id,
      request.user.tenantId,
      dto,
    );
  }

  @Get('me')
  findMe(@Req() request: AuthenticatedRequest) {
    return this.professionalsService.findMe(
      request.user.id,
    );
  }

  @Patch('me')
  updateMe(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProfessionalDto,
  ) {
    return this.professionalsService.updateMe(
      request.user.id,
      dto,
    );
  }
}
