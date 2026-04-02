import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AiService } from '../ai/ai.service';

export interface ProcessTranscriptResult {
  transcriptId: string;
  summary: string | null;
  keyTopics: string[];
  sentiment: string;
  actionItems: Array<{ content: string; assignee: string | null }>;
  insights: Array<{ type: string; content: string }>;
}

@Injectable()
export class TranscriptService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async processTranscript(
    meetingId: string,
    transcriptContent: string,
    userId: string,
  ): Promise<ProcessTranscriptResult> {
    // Verify meeting exists and user has access
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Update meeting status
    await this.prisma.meeting.update({
      where: { id: meetingId },
      data: { transcriptionStatus: 'PROCESSING' },
    });

    try {
      // AI analysis
      const analysis = await this.aiService.analyzeTranscript(transcriptContent);

      // Create or update transcript
      const transcript = await this.prisma.transcript.upsert({
        where: { meetingId },
        create: {
          meetingId,
          userId,
          content: transcriptContent,
          summary: analysis.summary,
          keyTopics: analysis.keyTopics || [],
          sentiment: analysis.sentiment || 'NEUTRAL',
        },
        update: {
          content: transcriptContent,
          summary: analysis.summary,
          keyTopics: analysis.keyTopics || [],
          sentiment: analysis.sentiment || 'NEUTRAL',
        },
      });

      // Create action items
      if (analysis.actionItems && analysis.actionItems.length > 0) {
        await this.prisma.actionItem.createMany({
          data: analysis.actionItems.map((item: { content: string; assignee: string | null }) => ({
            meetingId,
            content: item.content,
            assignee: item.assignee,
            status: 'PENDING',
            priority: 'MEDIUM',
          })),
          skipDuplicates: true,
        });
      }

      // Create insights
      if (analysis.insights && analysis.insights.length > 0) {
        await this.prisma.meetingInsight.createMany({
          data: analysis.insights.map((insight: { type: string; content: string }) => ({
            meetingId,
            type: insight.type,
            content: insight.content,
            confidence: 0.8,
          })),
          skipDuplicates: true,
        });
      }

      // Update meeting status to completed
      await this.prisma.meeting.update({
        where: { id: meetingId },
        data: { transcriptionStatus: 'COMPLETED' },
      });

      return {
        transcriptId: transcript.id,
        summary: analysis.summary,
        keyTopics: analysis.keyTopics || [],
        sentiment: analysis.sentiment || 'NEUTRAL',
        actionItems: analysis.actionItems || [],
        insights: analysis.insights || [],
      };
    } catch (error) {
      // Update meeting status to failed
      await this.prisma.meeting.update({
        where: { id: meetingId },
        data: { transcriptionStatus: 'FAILED' },
      });
      throw error;
    }
  }

  async getTranscript(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
      include: {
        transcript: true,
        actionItems: true,
        insights: true,
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  async searchTranscripts(userId: string, query: string) {
    const meetings = await this.prisma.meeting.findMany({
      where: {
        userId,
        transcript: {
          content: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      include: {
        transcript: {
          select: {
            id: true,
            content: true,
            summary: true,
            keyTopics: true,
            sentiment: true,
          },
        },
      },
    });

    return meetings;
  }
}
