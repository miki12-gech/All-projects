import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Role, Stream } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) { }

  /**
   * Auto-assign section based on grade level and existing students
   */
  private async autoAssignSection(gradeLevel: number, stream?: Stream | null): Promise<string> {
    try {
      const { capacity } = await this.settingsService.getClassCapacity(gradeLevel, stream ?? null);

      // Get students grouped by section to find next available section
      const studentsBySection = await this.prisma.student.groupBy({
        by: ['section'],
        where: { gradeLevel, stream: stream ?? undefined },
        _count: { section: true }
      });

      // Find first section that's not full
      const sections = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for (const sectionLetter of sections) {
        const sectionData = studentsBySection.find(s => s.section === sectionLetter);
        const count = sectionData?._count.section || 0;

        if (count < capacity) {
          return sectionLetter;
        }
      }

      // If all sections somehow full, return next letter
      return sections[studentsBySection.length] || 'A';
    } catch (error) {
      // If settings service fails, use default capacity and assign to 'A'
      this.logger.warn('Settings service failed, using default section assignment:', error.message);
      return 'A';
    }
  }

  /*
   * Generate unique email: firstnamelastname@agazi.edu
   */
  private async generateUniqueEmail(firstName: string, lastName: string, tx: any): Promise<string> {
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const base = `${cleanFirst}${cleanLast}` || 'student';
    let email = `${base}@agazi.edu`;
    let counter = 1;

    // Check availability
    while (await tx.user.findFirst({ where: { email } })) {
      email = `${base}${counter}@agazi.edu`;
      counter++;
    }
    return email;
  }

  /**
   * Register a new student (Admin only)
   * Auto-assigns section based on class capacity
   */
  async registerStudent(dto: CreateStudentDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Generate automatic email
        const email = await this.generateUniqueEmail(dto.firstName, dto.lastName, tx);

        // Auto-assign section (capacity per grade/stream)
        const section = await this.autoAssignSection(dto.gradeLevel, (dto.stream as Stream) || null);

        // Create user account with default password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('agazi123', salt); // Default password

        const user = await tx.user.create({
          data: {
            email: email,
            password: hashedPassword,
            role: Role.STUDENT,
          },
        });

        // Create student profile
        const student = await tx.student.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            dateOfBirth: new Date(dto.dateOfBirth),
            gender: dto.gender,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            gradeLevel: dto.gradeLevel,
            stream: dto.stream as Stream || null,
            section: section,
            fatherName: dto.fatherName,
            motherName: dto.motherName,
            guardianName: dto.guardianName,
            guardianPhone: dto.guardianPhone,
            emergencyContact: dto.emergencyContact,
            userId: user.id,
          },
        });

        return student;
      });
    } catch (error) {
      console.error('Student registration failed:', error);
      throw new Error('Student registration failed');
    }
  }

  /**
   * Student self-registration (pending approval)
   * Creates pending student record for admin approval
   */
  async selfRegisterStudent(dto: CreateStudentDto) {
    try {
      // For now, just register directly until migration is complete
      return await this.registerStudent(dto);
      
      /* TODO: Uncomment after running migration
      return await this.prisma.$transaction(async (tx) => {
        // Check if student with same info already exists
        const existingStudent = await tx.student.findFirst({
          where: {
            OR: [
              { phoneNumber: dto.phoneNumber },
              { firstName: dto.firstName, lastName: dto.lastName, dateOfBirth: new Date(dto.dateOfBirth) }
            ]
          }
        });

        if (existingStudent) {
          throw new Error('Student with this information already exists or is pending approval');
        }

        // Create pending student record
        const pendingStudent = await tx.pendingStudent.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            dateOfBirth: new Date(dto.dateOfBirth),
            gender: dto.gender,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            gradeLevel: dto.gradeLevel,
            stream: dto.stream as Stream || null,
            fatherName: dto.fatherName,
            motherName: dto.motherName,
            guardianName: dto.guardianName,
            guardianPhone: dto.guardianPhone,
            emergencyContact: dto.emergencyContact,
            status: 'PENDING',
            submittedAt: new Date(),
          },
        });

        return {
          message: 'Registration submitted successfully! Please wait for admin approval.',
          pendingStudentId: pendingStudent.id,
          status: 'PENDING'
        };
      });
      */
    } catch (error) {
      console.error('Student self-registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Get all pending students for admin approval
   */
  async getPendingStudents() {
    try {
      // TODO: Uncomment after running migration
      return []; // Return empty for now
      
      /* 
      return await this.prisma.pendingStudent.findMany({
        where: { status: 'PENDING' },
        orderBy: { submittedAt: 'desc' }
      });
      */
    } catch (error) {
      console.error('Failed to fetch pending students:', error);
      throw new Error('Failed to fetch pending students');
    }
  }

  /**
   * Approve a pending student registration
   */
  async approveStudent(pendingStudentId: string, adminId: string) {
    try {
      // TODO: Implement after running migration
      throw new Error('Approval system not available until database migration is completed');
      
      /*
      return await this.prisma.$transaction(async (tx) => {
        // Get pending student
        const pendingStudent = await tx.pendingStudent.findUnique({
          where: { id: pendingStudentId }
        });

        if (!pendingStudent) {
          throw new Error('Pending student not found');
        }

        if (pendingStudent.status !== 'PENDING') {
          throw new Error('Student already processed');
        }

        // Generate automatic email
        const email = await this.generateUniqueEmail(
          pendingStudent.firstName, 
          pendingStudent.lastName, 
          tx
        );

        // Auto-assign section
        const section = await this.autoAssignSection(
          pendingStudent.gradeLevel, 
          pendingStudent.stream
        );

        // Create user account
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('agazi123', salt);

        const user = await tx.user.create({
          data: {
            email: email,
            password: hashedPassword,
            role: Role.STUDENT,
          },
        });

        // Create student profile
        const student = await tx.student.create({
          data: {
            firstName: pendingStudent.firstName,
            lastName: pendingStudent.lastName,
            dateOfBirth: pendingStudent.dateOfBirth,
            gender: pendingStudent.gender,
            phoneNumber: pendingStudent.phoneNumber,
            address: pendingStudent.address,
            gradeLevel: pendingStudent.gradeLevel,
            stream: pendingStudent.stream,
            section: section,
            fatherName: pendingStudent.fatherName,
            motherName: pendingStudent.motherName,
            guardianName: pendingStudent.guardianName,
            guardianPhone: pendingStudent.guardianPhone,
            emergencyContact: pendingStudent.emergencyContact,
            userId: user.id,
          },
        });

        // Update pending student status
        await tx.pendingStudent.update({
          where: { id: pendingStudentId },
          data: {
            status: 'APPROVED',
            reviewedAt: new Date(),
            reviewedBy: adminId,
            reviewComments: 'Approved by administrator'
          }
        });

        return {
          message: 'Student approved and registered successfully',
          student,
          email,
          password: 'agazi123'
        };
      });
      */
    } catch (error) {
      console.error('Student approval failed:', error);
      throw new Error(error.message || 'Student approval failed');
    }
  }

  /**
   * Reject a pending student registration
   */
  async rejectStudent(pendingStudentId: string, adminId: string, reason: string) {
    try {
      // TODO: Implement after running migration
      throw new Error('Rejection system not available until database migration is completed');
      
      /*
      return await this.prisma.pendingStudent.update({
        where: { id: pendingStudentId },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: adminId,
          reviewComments: reason
        }
      });
      */
    } catch (error) {
      console.error('Student rejection failed:', error);
      throw new Error('Student rejection failed');
    }
  }

  /**
   * Get all students with optional filtering
   */
  async getAllStudents(filters?: {
    grade?: number;
    section?: string;
    stream?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.grade) {
      where.gradeLevel = parseInt(filters.grade.toString());
    }

    if (filters?.section) {
      where.section = filters.section;
    }

    if (filters?.stream) {
      where.stream = filters.stream;
    }

    const students = await this.prisma.student.findMany({
      where,
      take: filters?.limit,
      orderBy: [
        { gradeLevel: 'asc' },
        { section: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ],
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    return students;
  }

  /**
   * Get a single student by ID
   */
  async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true
          }
        },
        grades: {
          include: {
            subject: true
          }
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 attendance records
        }
      }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  /**
   * Get the currently authenticated student's profile by userId
   */
  async getStudentByUserId(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true,
          },
        },
        grades: {
          include: {
            subject: true,
          },
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  /**
   * Update student information (Admin only)
   * Students cannot update their own profile info except password
   */
  async updateStudent(id: string, dto: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id }
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const updateData: any = {};

      if (dto.firstName) updateData.firstName = dto.firstName;
      if (dto.lastName) updateData.lastName = dto.lastName;
      if (dto.gradeLevel) updateData.gradeLevel = dto.gradeLevel;
      // Section IS updatable by admin
      if (dto.section) updateData.section = dto.section;
      if (dto.stream) updateData.stream = dto.stream;
      if (dto.phoneNumber) updateData.phoneNumber = dto.phoneNumber;
      if (dto.address) updateData.address = dto.address;
      if (dto.dateOfBirth) updateData.dateOfBirth = new Date(dto.dateOfBirth);
      if (dto.fatherName) updateData.fatherName = dto.fatherName;
      if (dto.motherName) updateData.motherName = dto.motherName;
      if (dto.guardianName) updateData.guardianName = dto.guardianName;
      if (dto.guardianPhone) updateData.guardianPhone = dto.guardianPhone;
      if (dto.emergencyContact) updateData.emergencyContact = dto.emergencyContact;
      if (dto.gender) updateData.gender = dto.gender;

      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          }
        }
      });

      this.logger.log(`Student updated: ${updatedStudent.firstName} ${updatedStudent.lastName}`);
      return updatedStudent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Student update failed:', error);
      throw new InternalServerErrorException('Student update failed');
    }
  }

  /**
   * Delete a student (Admin only)
   * Cascades to delete user account and all related data
   */
  async deleteStudent(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Delete student (cascade will handle user deletion)
      await this.prisma.student.delete({
        where: { id }
      });

      this.logger.log(`Student deleted: ${student.firstName} ${student.lastName}`);

      return { message: 'Student deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Student deletion failed:', error);
      throw new InternalServerErrorException('Student deletion failed');
    }
  }

  /**
   * Get statistics about students
   */
  async getStatistics() {
    const totalStudents = await this.prisma.student.count();

    const byGrade = await this.prisma.student.groupBy({
      by: ['gradeLevel'],
      _count: { gradeLevel: true }
    });

    const bySection = await this.prisma.student.groupBy({
      by: ['section', 'gradeLevel'],
      _count: { section: true },
      orderBy: [
        { gradeLevel: 'asc' },
        { section: 'asc' }
      ]
    });

    return {
      total: totalStudents,
      byGrade: byGrade.map(g => ({
        grade: g.gradeLevel,
        count: g._count.gradeLevel
      })),
      bySect: bySection.map(s => ({
        grade: s.gradeLevel,
        section: s.section,
        count: s._count.section
      })),
      defaultClassCapacity: 40
    };
  }

  /**
   * Reassign student to different section (Admin only)
   */
  async reassignSection(studentId: string, newSection: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const { capacity } = await this.settingsService.getClassCapacity(student.gradeLevel, student.stream ?? null);

    // Check section capacity (capacity per grade/stream)
    const studentsInSection = await this.prisma.student.count({
      where: {
        gradeLevel: student.gradeLevel,
        section: newSection,
        stream: student.stream ?? undefined
      }
    });

    if (studentsInSection >= capacity) {
      throw new BadRequestException(`Section ${newSection} is full (capacity: ${capacity})`);
    }

    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: { section: newSection }
    });

    this.logger.log(`Student ${student.firstName} ${student.lastName} reassigned to Grade ${student.gradeLevel}${newSection}`);

    return updated;
  }
}