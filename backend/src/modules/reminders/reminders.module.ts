import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    NotificationsModule,
    EmailModule,
  ],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
