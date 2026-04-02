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
import { CommentsModule } from './modules/comments/comments.module';
import { EmailModule } from './modules/email/email.module';
import { ExportModule } from './modules/export/export.module';
import { CalendarModule } from './modules/calendar/calendar.module';
// Removed: NotificationsModule, RemindersModule (require WebSockets/cron)

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
    CommentsModule,
    EmailModule,
    ExportModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
