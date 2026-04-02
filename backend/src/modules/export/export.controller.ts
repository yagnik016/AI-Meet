import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Export')
@Controller('meetings/:meetingId/export')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('docx')
  @ApiOperation({ summary: 'Export meeting to DOCX format' })
  async exportToDocx(
    @Param('meetingId') meetingId: string,
    @CurrentUser('userId') userId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportToDocx(meetingId, userId);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="meeting-${meetingId}.docx"`);
    res.send(buffer);
  }

  @Get('pdf')
  @ApiOperation({ summary: 'Export meeting to PDF format' })
  async exportToPdf(
    @Param('meetingId') meetingId: string,
    @CurrentUser('userId') userId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportToPdf(meetingId, userId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="meeting-${meetingId}.pdf"`);
    res.send(buffer);
  }
}
