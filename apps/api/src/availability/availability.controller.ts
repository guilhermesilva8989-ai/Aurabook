import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AvailabilityService } from './availability.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    role: string;
  };
}

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.create(
      request.user.id,
      request.user.tenantId,
      dto,
    );
  }

  @Get('me')
  findMySchedule(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.availabilityService.findMySchedule(
      request.user.id,
      request.user.tenantId,
    );
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(
      request.user.id,
      request.user.tenantId,
      id,
      dto,
    );
  }

  @Delete('day/:dayOfWeek')
  setDayOff(
    @Req() request: AuthenticatedRequest,
    @Param('dayOfWeek', ParseIntPipe)
    dayOfWeek: number,
  ) {
    return this.availabilityService.setDayOff(
      request.user.id,
      request.user.tenantId,
      dayOfWeek,
    );
  }

  @Delete(':id')
  deactivate(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.availabilityService.deactivate(
      request.user.id,
      request.user.tenantId,
      id,
    );
  }
}
