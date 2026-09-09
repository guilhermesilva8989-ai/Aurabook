import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import {
  APPOINTMENT_STATUSES,
} from './update-appointment-status.dto.js';

import type {
  AppointmentStatusValue,
} from './update-appointment-status.dto.js';

export class AppointmentQueryDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date deve estar no formato YYYY-MM-DD.',
  })
  date?: string;

  @IsOptional()
  @IsString()
  professionalId?: string;

  @IsOptional()
  @IsIn(APPOINTMENT_STATUSES)
  status?: AppointmentStatusValue;
}
