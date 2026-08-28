import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, Role } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createByAdmin(params: {
    title: string;
    message: string;
    type: NotificationType;
    recipientRole?: Role | null;
    userId?: string | null;
  }) {
    const { title, message, type, recipientRole, userId } = params;

    // Target specific user
    if (userId) {
      return this.prisma.notification.create({
        data: {
          title,
          message,
          type,
          recipientRole: recipientRole ?? null,
          userId,
        },
      });
    }

    // Target role or all
    const users = await this.prisma.user.findMany({
      where: recipientRole ? { role: recipientRole } : {},
      select: { id: true, role: true },
    });

    if (users.length === 0) {
      return { created: 0 };
    }

    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        title,
        message,
        type,
        recipientRole: recipientRole ?? null,
        userId: u.id,
      })),
    });

    return { created: users.length };
  }

  async markRead(notificationId: string, userId: string) {
    const n = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!n) throw new NotFoundException('Notification not found');
    if (n.userId !== userId) throw new ForbiddenException('Not allowed');

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async deleteByAdmin(notificationId: string) {
    const n = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!n) throw new NotFoundException('Notification not found');
    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Deleted' };
  }
}

