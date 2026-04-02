import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TranscriptService, ProcessTranscriptResult } from './transcript.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Transcripts')
@Controller('transcripts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Post('process/:meetingId')
  @ApiOperation({ summary: 'Process transcript for a meeting' })
  async processTranscript(
    @Param('meetingId') meetingId: string,
    @Body('content') content: string,
    @CurrentUser('userId') userId: string,
  ): Promise<{ success: boolean; data: ProcessTranscriptResult }> {
    const result = await this.transcriptService.processTranscript(
      meetingId,
      content,
      userId,
    );
    return { success: true, data: result };
  }

  @Get(':meetingId')
  @ApiOperation({ summary: 'Get transcript for a meeting' })
  async getTranscript(
    @Param('meetingId') meetingId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const transcript = await this.transcriptService.getTranscript(
      meetingId,
      userId,
    );
    return { success: true, data: transcript };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search across transcripts' })
  async searchTranscripts(
    @Query('q') query: string,
    @CurrentUser('userId') userId: string,
  ) {
    if (!query) {
      throw new NotFoundException('Search query is required');
    }
    const results = await this.transcriptService.searchTranscripts(
      userId,
      query,
    );
    return { success: true, data: results };
  }
}
