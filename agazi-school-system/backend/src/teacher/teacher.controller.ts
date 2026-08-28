import { Body, Controller, Post, Get, Patch, Delete, Param, UseGuards, HttpCode, Req } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) { }

    @Roles(Role.ADMIN)
    @Post('register')
    register(@Body() createTeacherDto: CreateTeacherDto) {
        return this.teacherService.registerTeacher(createTeacherDto);
    }

    @Roles(Role.ADMIN)
    @Get()
    findAll() {
        return this.teacherService.findAll();
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @Get('me/profile')
    findMe(@Req() req: any) {
        return this.teacherService.findByUserId(req.user.userId);
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teacherService.findOne(id);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
      return this.teacherService.update(id, updateTeacherDto);
    }
  
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.teacherService.remove(id);
    }
}
