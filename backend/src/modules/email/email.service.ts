import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      from: this.configService.get('EMAIL_FROM', 'noreply@meeta.ai'),
      subject: 'Welcome to MeetAI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to MeetAI, ${name}!</h2>
          <p>Thank you for joining MeetAI. We're excited to help you transform your meetings with AI-powered insights.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Get Started:</h3>
            <ul>
              <li>Upload your first meeting recording</li>
              <li>Explore AI-generated transcripts and insights</li>
              <li>Invite your team to collaborate</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The MeetAI Team</p>
        </div>
      `,
    });
  }

  async sendMeetingSummaryEmail(to: string, meetingData: {
    title: string;
    date: string;
    summary: string;
    actionItems: string[];
    meetingId: string;
  }) {
    const actionItemsList = meetingData.actionItems
      .map(item => `<li>${item}</li>`)
      .join('');

    await this.mailerService.sendMail({
      to,
      from: this.configService.get('EMAIL_FROM', 'noreply@meeta.ai'),
      subject: `Meeting Summary: ${meetingData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Meeting Summary</h2>
          <p><strong>${meetingData.title}</strong><br>
          Date: ${meetingData.date}</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Summary</h3>
            <p>${meetingData.summary}</p>
          </div>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0066cc;">Action Items</h3>
            <ul>${actionItemsList}</ul>
          </div>

          <p>
            <a href="${this.configService.get('FRONTEND_URL')}/meetings/${meetingData.meetingId}" 
               style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Full Details
            </a>
          </p>
        </div>
      `,
    });
  }

  async sendActionItemReminder(to: string, actionItemData: {
    content: string;
    assignee: string;
    dueDate?: string;
    meetingTitle: string;
    meetingId: string;
  }) {
    await this.mailerService.sendMail({
      to,
      from: this.configService.get('EMAIL_FROM', 'noreply@meeta.ai'),
      subject: `Action Item Reminder: ${actionItemData.meetingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Action Item Reminder</h2>
          <p>Hi ${actionItemData.assignee},</p>
          <p>You have a pending action item from <strong>${actionItemData.meetingTitle}</strong>:</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 16px;">${actionItemData.content}</p>
            ${actionItemData.dueDate ? `<p style="margin: 10px 0 0 0; color: #856404;"><strong>Due:</strong> ${actionItemData.dueDate}</p>` : ''}
          </div>

          <p>
            <a href="${this.configService.get('FRONTEND_URL')}/meetings/${actionItemData.meetingId}" 
               style="background: #ffc107; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Meeting
            </a>
          </p>
        </div>
      `,
    });
  }

  async sendTeamInviteEmail(to: string, inviteData: {
    teamName: string;
    inviterName: string;
    inviteLink: string;
  }) {
    await this.mailerService.sendMail({
      to,
      from: this.configService.get('EMAIL_FROM', 'noreply@meeta.ai'),
      subject: `You've been invited to join ${inviteData.teamName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Team Invitation</h2>
          <p>Hi there,</p>
          <p><strong>${inviteData.inviterName}</strong> has invited you to join <strong>${inviteData.teamName}</strong> on MeetAI.</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">MeetAI helps teams:</p>
            <ul>
              <li>Automatically transcribe meetings</li>
              <li>Get AI-generated insights and summaries</li>
              <li>Track action items and decisions</li>
              <li>Collaborate on meeting notes</li>
            </ul>
          </div>

          <p>
            <a href="${inviteData.inviteLink}" 
               style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </p>
        </div>
      `,
    });
  }
}
