import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class DatabaseTestService {
  constructor(private prisma: PrismaService) {}

  async testConnection() {
    try {
      // Simple database connection test
      const count = await this.prisma.user.count();
      console.log('Database connection successful. User count:', count);
      return { success: true, count };
    } catch (error) {
      console.error('Database connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}
