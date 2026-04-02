import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  async getDashboard(@CurrentUser('userId') userId: string) {
    const data = await this.analyticsService.getDashboardAnalytics(userId);
    return { success: true, data };
  }

  @Get('meetings/:meetingId')
  @ApiOperation({ summary: 'Get stats for a specific meeting' })
  async getMeetingStats(
    @Param('meetingId') meetingId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.analyticsService.getMeetingStats(userId, meetingId);
    return { success: true, data };
  }
}
