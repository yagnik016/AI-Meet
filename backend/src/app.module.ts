import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UploadModule } from './modules/upload/upload.module';
import { AiModule } from './modules/ai/ai.module';
import { TranscriptModule } from './modules/transcripts/transcript.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TeamsModule } from './modules/teams/teams.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CommentsModule } from './modules/comments/comments.module';
import { EmailModule } from './modules/email/email.module';
import { ExportModule } from './modules/export/export.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    AuthModule,
    MeetingsModule,
    UploadModule,
    AiModule,
    TranscriptModule,
    AnalyticsModule,
    TeamsModule,
    NotificationsModule,
    CommentsModule,
    EmailModule,
    ExportModule,
    CalendarModule,
    RemindersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
