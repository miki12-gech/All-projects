import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NotificationType, Role } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async myNotifications(@Req() req: any) {
    return this.notificationService.listForUser(req.user.userId);
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markRead(id, req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: { title: string; message: string; type: NotificationType; recipientRole?: Role; userId?: string }) {
    return this.notificationService.createByAdmin({
      title: body.title,
      message: body.message,
      type: body.type,
      recipientRole: body.recipientRole ?? null,
      userId: body.userId ?? null,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationService.deleteByAdmin(id);
  }
}

