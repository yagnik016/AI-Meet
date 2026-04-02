import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

export interface AnalyticsDashboard {
  overview: {
    totalMeetings: number;
    totalHours: number;
    totalActionItems: number;
    completedActionItems: number;
    averageSentiment: string;
  };
  meetingsOverTime: Array<{
    date: string;
    count: number;
  }>;
  sentimentDistribution: Array<{
    sentiment: string;
    count: number;
  }>;
  topTopics: Array<{
    topic: string;
    count: number;
  }>;
  platformUsage: Array<{
    platform: string;
    count: number;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardAnalytics(userId: string): Promise<AnalyticsDashboard> {
    const [
      totalMeetings,
      meetingsWithDuration,
      actionItems,
      transcripts,
      meetingsByPlatform,
      recentMeetings,
    ] = await Promise.all([
      this.prisma.meeting.count({ where: { userId } }),
      this.prisma.meeting.findMany({
        where: { userId, duration: { not: null } },
        select: { duration: true },
      }),
      this.prisma.actionItem.groupBy({
        by: ['status'],
        where: { meeting: { userId } },
        _count: { status: true },
      }),
      this.prisma.transcript.findMany({
        where: { userId },
        select: {
          sentiment: true,
          keyTopics: true,
          createdAt: true,
        },
      }),
      this.prisma.meeting.groupBy({
        by: ['platform'],
        where: { userId },
        _count: { platform: true },
      }),
      this.prisma.meeting.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

    // Calculate total hours
    const totalHours = meetingsWithDuration.reduce(
      (sum, m) => sum + (m.duration || 0),
      0,
    ) / 3600;

    // Sentiment distribution
    const sentimentCounts: Record<string, number> = {};
    transcripts.forEach((t) => {
      sentimentCounts[t.sentiment] = (sentimentCounts[t.sentiment] || 0) + 1;
    });

    // Top topics
    const topicCounts: Record<string, number> = {};
    transcripts.forEach((t) => {
      t.keyTopics.forEach((topic) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    // Meetings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const meetingsByDate = await this.prisma.meeting.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { createdAt: true },
    });

    const meetingsOverTime = meetingsByDate
      .map((m) => ({
        date: m.createdAt.toISOString().split('T')[0],
        count: m._count.createdAt,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalActionItems = actionItems.reduce(
      (sum, a) => sum + a._count.status,
      0,
    );
    const completedActionItems =
      actionItems.find((a) => a.status === 'COMPLETED')?._count.status || 0;

    // Calculate average sentiment
    const sentimentScores: Record<string, number> = {
      POSITIVE: 1,
      NEUTRAL: 0,
      NEGATIVE: -1,
      MIXED: 0,
    };
    const avgSentimentScore =
      transcripts.length > 0
        ? transcripts.reduce(
            (sum, t) => sum + (sentimentScores[t.sentiment] || 0),
            0,
          ) / transcripts.length
        : 0;

    let averageSentiment: string;
    if (avgSentimentScore > 0.3) averageSentiment = 'POSITIVE';
    else if (avgSentimentScore < -0.3) averageSentiment = 'NEGATIVE';
    else if (avgSentimentScore !== 0) averageSentiment = 'MIXED';
    else averageSentiment = 'NEUTRAL';

    return {
      overview: {
        totalMeetings,
        totalHours: Math.round(totalHours * 10) / 10,
        totalActionItems,
        completedActionItems,
        averageSentiment,
      },
      meetingsOverTime,
      sentimentDistribution: Object.entries(sentimentCounts).map(
        ([sentiment, count]) => ({ sentiment, count }),
      ),
      topTopics: Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count })),
      platformUsage: meetingsByPlatform.map((p) => ({
        platform: p.platform,
        count: p._count.platform,
      })),
      recentActivity: recentMeetings.map((m) => ({
        id: m.id,
        title: m.title,
        date: m.createdAt.toISOString(),
        type: m.status,
      })),
    };
  }

  async getMeetingStats(userId: string, meetingId: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
      include: {
        transcript: true,
        actionItems: true,
        participants: true,
        insights: true,
      },
    });

    if (!meeting) {
      return null;
    }

    return {
      duration: meeting.duration,
      participantCount: meeting.participants.length,
      actionItemCount: meeting.actionItems.length,
      completedActionItems: meeting.actionItems.filter(
        (a) => a.status === 'COMPLETED',
      ).length,
      sentiment: meeting.transcript?.sentiment || 'NEUTRAL',
      keyTopics: meeting.transcript?.keyTopics || [],
      insights: meeting.insights,
    };
  }
}
