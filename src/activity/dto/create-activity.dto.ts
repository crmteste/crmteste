// src/activity/dto/create-activity.dto.ts

import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  leadId: string;
}
