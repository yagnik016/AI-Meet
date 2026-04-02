import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { NotificationsGateway, NotificationPayload, NotificationType } from './notifications.gateway';
import { v4 as uuidv4 } from 'uuid';

export interface CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  meetingId?: string;
  teamId?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async createNotification(dto: CreateNotificationDto): Promise<void> {
    const notification = await this.prisma.notification.create({
      data: {
        id: uuidv4(),
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data || {},
        meetingId: dto.meetingId,
        teamId: dto.teamId,
        read: false,
      },
    });

    // Send real-time notification
    const payload: NotificationPayload = {
      id: notification.id,
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      data: notification.data as Record<string, any>,
      timestamp: notification.createdAt.toISOString(),
      read: false,
    };

    this.gateway.sendToUser(dto.userId, payload);
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  // Send meeting started notification
  async notifyMeetingStarted(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (meeting) {
      await this.createNotification({
        userId,
        type: 'MEETING_STARTED',
        title: 'Meeting Started',
        message: `"${meeting.title}" has started`,
        meetingId,
      });
    }
  }

  // Send transcript ready notification
  async notifyTranscriptReady(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (meeting) {
      await this.createNotification({
        userId,
        type: 'TRANSCRIPT_READY',
        title: 'Transcript Ready',
        message: `AI analysis for "${meeting.title}" is complete`,
        meetingId,
      });
    }
  }

  // Send action item notification
  async notifyActionItemAssigned(actionItemId: string, userId: string) {
    const actionItem = await this.prisma.actionItem.findUnique({
      where: { id: actionItemId },
      include: { meeting: true },
    });

    if (actionItem) {
      await this.createNotification({
        userId,
        type: 'ACTION_ITEM_ASSIGNED',
        title: 'Action Item Assigned',
        message: `You have been assigned: "${actionItem.content}"`,
        meetingId: actionItem.meetingId,
      });
    }
  }

  // Send team invite notification
  async notifyTeamInvite(teamId: string, userId: string, inviterName: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (team) {
      await this.createNotification({
        userId,
        type: 'TEAM_INVITE',
        title: 'Team Invitation',
        message: `${inviterName} invited you to join "${team.name}"`,
        teamId,
      });
    }
  }
}
