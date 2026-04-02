import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkUpcomingMeetings() {
    this.logger.debug('Checking for upcoming meetings...');

    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60000);

    // Check meetings starting in 10 minutes
    const urgentMeetings = await this.prisma.meeting.findMany({
      where: {
        startTime: {
          gte: now,
          lte: tenMinutesFromNow,
        },
        status: 'SCHEDULED',
        reminderSent10Min: false,
      },
      include: { user: true },
    });

    for (const meeting of urgentMeetings) {
      await this.notificationsService.notifyMeetingStarted(meeting.id, meeting.userId);
      
      if (meeting.user.email) {
        await this.emailService.sendMeetingSummaryEmail(meeting.user.email, {
          title: `Starting soon: ${meeting.title}`,
          date: new Date(meeting.startTime).toLocaleString(),
          summary: `Your meeting "${meeting.title}" starts in 10 minutes.`,
          actionItems: [],
          meetingId: meeting.id,
        });
      }

      await this.prisma.meeting.update({
        where: { id: meeting.id },
        data: { reminderSent10Min: true },
      });
    }

    // Check meetings starting in 1 hour
    const hourlyMeetings = await this.prisma.meeting.findMany({
      where: {
        startTime: {
          gte: tenMinutesFromNow,
          lte: oneHourFromNow,
        },
        status: 'SCHEDULED',
        reminderSent1Hour: false,
      },
      include: { user: true },
    });

    for (const meeting of hourlyMeetings) {
      await this.notificationsService.createNotification({
        userId: meeting.userId,
        type: 'MEETING_REMINDER',
        title: 'Meeting in 1 hour',
        message: `"${meeting.title}" starts at ${new Date(meeting.startTime).toLocaleTimeString()}`,
        meetingId: meeting.id,
      });

      await this.prisma.meeting.update({
        where: { id: meeting.id },
        data: { reminderSent1Hour: true },
      });
    }

    // Check action items due today
    const dueActionItems = await this.prisma.actionItem.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: oneDayFromNow,
        },
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        reminderSent: false,
      },
      include: { meeting: { include: { user: true } } },
    });

    for (const actionItem of dueActionItems) {
      if (actionItem.assignee && actionItem.meeting?.user?.email) {
        await this.emailService.sendActionItemReminder(actionItem.meeting.user.email, {
          content: actionItem.content,
          assignee: actionItem.assignee,
          dueDate: actionItem.dueDate?.toLocaleDateString() ?? undefined,
          meetingTitle: actionItem.meeting.title,
          meetingId: actionItem.meetingId,
        });
      }

      await this.prisma.actionItem.update({
        where: { id: actionItem.id },
        data: { reminderSent: true },
      });
    }

    this.logger.debug(`Sent ${urgentMeetings.length} urgent, ${hourlyMeetings.length} hourly reminders`);
  }
}
