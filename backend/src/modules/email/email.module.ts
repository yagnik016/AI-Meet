import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST', 'smtp.resend.com'),
          port: configService.get('SMTP_PORT', 587),
          secure: false,
          auth: {
            user: configService.get('SMTP_USER', 'resend'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get('EMAIL_FROM', 'MeetAI <noreply@meeta.ai>'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
