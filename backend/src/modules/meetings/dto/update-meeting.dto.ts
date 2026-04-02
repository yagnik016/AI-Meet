import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingPlatform, MeetingStatus } from '@prisma/client';

export class UpdateMeetingDto {
  @ApiPropertyOptional({ example: 'Weekly Team Sync - Updated' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: MeetingPlatform, example: 'ZOOM' })
  @IsOptional()
  @IsEnum(MeetingPlatform)
  platform?: MeetingPlatform;

  @ApiPropertyOptional({ example: '2026-04-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2026-04-15T11:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ enum: MeetingStatus, example: 'COMPLETED' })
  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;
}
