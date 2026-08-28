import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { TeacherSubjectAssignmentService } from './teacher-subject-assignment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('teacher-subject-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherSubjectAssignmentController {
    constructor(private readonly assignmentService: TeacherSubjectAssignmentService) {}

    @Roles(Role.ADMIN)
    @Get()
    findAll() {
        return this.assignmentService.findAll();
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @Get('my-assignments')
    findMyAssignments(@Param() teacherId: string) {
        return this.assignmentService.findByTeacherId(teacherId);
    }

    @Roles(Role.ADMIN)
    @Get('available-subjects')
    getAvailableSubjects() {
        return this.assignmentService.getAvailableSubjects();
    }

    @Roles(Role.ADMIN)
    @Get('available-teachers')
    getAvailableTeachers() {
        return this.assignmentService.getAvailableTeachers();
    }

    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createAssignmentDto: any) {
        return this.assignmentService.createAssignment(createAssignmentDto);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAssignmentDto: any) {
        return this.assignmentService.updateAssignment(id, updateAssignmentDto);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assignmentService.deleteAssignment(id);
    }
}
