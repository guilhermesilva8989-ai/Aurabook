import { IsIn } from 'class-validator';

export const APPOINTMENT_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'NO_SHOW',
] as const;

export type AppointmentStatusValue =
  (typeof APPOINTMENT_STATUSES)[number];

export class UpdateAppointmentStatusDto {
  @IsIn(APPOINTMENT_STATUSES)
  status!: AppointmentStatusValue;
}
