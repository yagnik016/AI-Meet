import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
