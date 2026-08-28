import { Controller, ForbiddenException, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { GradeService } from './grade.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('grade')
@UseGuards(JwtAuthGuard)
export class GradeController {
  constructor(private gradeService: GradeService) { }

  /**
   * Mark grades (Teachers and Admins only)
   * Component-based: finalExam (50%), midExam (30%), quiz (10%), classActivity (10%)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Post('mark')
  async markGrades(
    @Body() body: {
      records: any
    },
    @Req() req: any
  ) {
    return this.gradeService.markGrades(
      body.records,
      req.user?.role,
      req.user?.profileId ?? null,
    );
  }

  /**
   * Get student report card
   * Students can only access their own reports
   */
  @Get('report/:studentId')
  async getReport(
    @Param('studentId') studentId: string,
    @Query('term') term: string,
    @Query('academicYear') academicYear: string,
    @Req() req: any
  ) {
    // Students can only view their own grades
    if (req.user?.role === Role.STUDENT && req.user?.profileId !== studentId) {
      // keep explicit to avoid leaking other students' information
      throw new ForbiddenException('You can only view your own grades');
    }

    return this.gradeService.getStudentReport(
      studentId,
      Number(term),
      academicYear || '2025/2026'
    );
  }

  /**
   * Get grades for a specific class (Teachers and Admins)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Get('class')
  async getClassGrades(
    @Query('gradeLevel') gradeLevel: string,
    @Query('section') section: string,
    @Query('subjectId') subjectId: string,
    @Query('term') term: string,
    @Query('academicYear') academicYear: string,
    @Req() req: any
  ) {
    return this.gradeService.getGradesByClass(
      Number(gradeLevel),
      section,
      subjectId,
      Number(term),
      academicYear || '2025/2026',
      req.user?.role,
      req.user?.profileId ?? null
    );
  }

  /**
   * Get class statistics (Teachers and Admins)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Get('statistics')
  async getClassStatistics(
    @Query('gradeLevel') gradeLevel: string,
    @Query('section') section: string,
    @Query('subjectId') subjectId: string,
    @Query('term') term: string,
    @Query('academicYear') academicYear: string,
    @Req() req: any
  ) {
    return this.gradeService.getClassStatistics(
      Number(gradeLevel),
      section,
      subjectId,
      Number(term),
      academicYear || '2025/2026',
      req.user?.role,
      req.user?.profileId ?? null
    );
  }
}