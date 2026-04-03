import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  async onModuleInit() {
    try {
      if (!process.env.DATABASE_URL) {
        this.logger.warn('DATABASE_URL not set, skipping database connection');
        return;
      }
      
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error.message);
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.logger.log('Database disconnected');
    }
  }

  get isDbConnected() {
    return this.isConnected;
  }
}
