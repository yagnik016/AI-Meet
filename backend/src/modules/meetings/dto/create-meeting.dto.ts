import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingPlatform } from '@prisma/client';

export class CreateMeetingDto {
  @ApiProperty({ example: 'Weekly Team Sync' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Discussing Q4 goals and roadmap' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: MeetingPlatform, example: 'ZOOM' })
  @IsEnum(MeetingPlatform)
  platform: MeetingPlatform;

  @ApiProperty({ example: '2026-04-15T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({ example: '2026-04-15T11:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;
}
