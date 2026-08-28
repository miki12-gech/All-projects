import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // 👈 "extends PrismaClient" የሚለው ከሌለ "this.prisma.user" አይሰራም!
  async onModuleInit() {
    await this.$connect();
  }
}
