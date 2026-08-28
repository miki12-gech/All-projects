import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Stream } from '@prisma/client';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Roles(Role.ADMIN)
  @Get('class-capacity')
  async getClassCapacity(
    @Query('gradeLevel') gradeLevel: string,
    @Query('stream') stream?: Stream,
  ) {
    return this.settingsService.getClassCapacity(Number(gradeLevel), stream ?? null);
  }

  @Roles(Role.ADMIN)
  @Put('class-capacity')
  async setClassCapacity(
    @Body()
    body: { gradeLevel: number; stream?: Stream; maxStudentsPerSection: number },
  ) {
    return this.settingsService.setClassCapacity({
      gradeLevel: Number(body.gradeLevel),
      stream: body.stream ?? null,
      maxStudentsPerSection: Number(body.maxStudentsPerSection),
    });
  }
}

