import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER) // 👈 አድሚን እና መምህራን ብቻ መመዝገብ ይችላሉ
  @Post()
  async markAttendanceRoot(@Body() records: any[], @Req() req: any) {
    return this.attendanceService.markAttendance(records, req.user?.role, req.user?.profileId ?? null);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER) // 👈 አድሚን እና መምህራን ብቻ መመዝገብ ይችላሉ
  @Post('mark')
  async markAttendance(@Body() records: any[], @Req() req: any) {
    // መምህሩ የላከውን ዝርዝር ለሰርቪሱ ይሰጣል
    return this.attendanceService.markAttendance(records, req.user?.role, req.user?.profileId ?? null);
  }
}