import { Body, Controller, Post, Get, Patch, Delete, Param, Query, UseGuards, HttpCode, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private studentService: StudentService) { }

  /**
   * Get all students with optional filtering
   * Accessible by: ADMIN, TEACHER
   * Students cannot access this endpoint (security)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get()
  async findAll(
    @Query('grade') grade?: number,
    @Query('section') section?: string,
    @Query('stream') stream?: string,
    @Query('limit') limit?: number,
  ) {
    return this.studentService.getAllStudents({
      grade,
      section,
      stream,
      limit
    });
  }

  /**
   * Get current student's own profile (Student only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @Get('me/profile')
  async getMyProfile(@Req() req: any) {
    const userId: string = String(req.user?.userId);
    return this.studentService.getStudentByUserId(userId);
  }

  /**
   * Get a single student by ID
   * Accessible by: ADMIN, TEACHER
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  /**
   * Register a new student (Admin only)
   * Auto-assigns section based on class capacity
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register')
  async register(@Body() dto: CreateStudentDto) {
    return this.studentService.registerStudent(dto);
  }

  /**
   * Student self-registration (Public endpoint)
   * Creates pending student record for admin approval
   */
  @Post('self-register')
  async selfRegister(@Body() dto: CreateStudentDto) {
    return this.studentService.selfRegisterStudent(dto);
  }

  /**
   * Get all pending students for admin approval
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('pending')
  async getPendingStudents() {
    return this.studentService.getPendingStudents();
  }

  /**
   * Approve a pending student registration
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('approve/:pendingStudentId')
  async approveStudent(
    @Param('pendingStudentId') pendingStudentId: string,
    @Req() req: any
  ) {
    const adminId = String(req.user?.userId);
    return this.studentService.approveStudent(pendingStudentId, adminId);
  }

  /**
   * Reject a pending student registration
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('reject/:pendingStudentId')
  async rejectStudent(
    @Param('pendingStudentId') pendingStudentId: string,
    @Body() body: { reason: string },
    @Req() req: any
  ) {
    const adminId = String(req.user?.userId);
    return this.studentService.rejectStudent(pendingStudentId, adminId, body.reason);
  }

  /**
   * Update student information (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.updateStudent(id, dto);
  }

  /**
   * Delete a student (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }

  /**
   * Get student statistics
   * Accessible by: ADMIN only
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats/overview')
  async getStatistics() {
    return this.studentService.getStatistics();
  }

  /**
   * Reassign student to different section (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/reassign-section')
  async reassignSection(
    @Param('id') id: string,
    @Body('section') section: string
  ) {
    return this.studentService.reassignSection(id, section);
  }
}