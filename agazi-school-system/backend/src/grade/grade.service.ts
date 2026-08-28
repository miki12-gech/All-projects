import { ForbiddenException, Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { GradeComponentsDto as GradeComponentsType } from './dto/mark-grades.dto';

interface GradeComponentsDto {
  studentId: string;
  subjectId: string;
  finalExam: number;    // out of 50
  midExam: number;      // out of 30
  quiz: number;         // out of 10
  classActivity: number; // out of 10
  term: number;
  academicYear: string;
}

@Injectable()
export class GradeService {
  private readonly logger = new Logger(GradeService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Calculate letter grade based on total score
   */
  private calculateLetterGrade(totalScore: number): string {
    if (totalScore >= 90) return 'A+';
    if (totalScore >= 85) return 'A';
    if (totalScore >= 80) return 'A-';
    if (totalScore >= 75) return 'B+';
    if (totalScore >= 70) return 'B';
    if (totalScore >= 65) return 'B-';
    if (totalScore >= 60) return 'C+';
    if (totalScore >= 55) return 'C';
    if (totalScore >= 50) return 'C-';
    if (totalScore >= 45) return 'D';
    return 'F';
  }

  /**
   * Mark/Update grades with component-based system
   * Teachers enter: Final (50%), Mid (30%), Quiz (10%), Class Activity (10%)
   */
  async markGrades(
    records: GradeComponentsDto[],
    actorRole?: Role,
    teacherProfileId?: string | null,
  ) {
    try {
      // If Teacher, enforce scope: teacher can only grade assigned subject+class
      if (actorRole === Role.TEACHER) {
        if (!teacherProfileId) throw new ForbiddenException('Teacher profile not found');
        const studentIds = Array.from(new Set(records.map((r) => r.studentId)));
        const subjectIds = Array.from(new Set(records.map((r) => r.subjectId)));
        if (subjectIds.length !== 1) {
          throw new ForbiddenException('Teachers can only submit grades for one subject at a time');
        }

        const students = await this.prisma.student.findMany({
          where: { id: { in: studentIds } },
          select: { id: true, gradeLevel: true, section: true },
        });

        const assignments = await this.prisma.teacherSubjectAssignment.findMany({
          where: {
            teacherId: teacherProfileId,
            subjectId: subjectIds[0],
          },
          select: { gradeLevel: true, section: true },
        });

        const allowed = new Set(assignments.map((a) => `${a.gradeLevel}:${a.section}`));
        const forbiddenStudent = students.find((s) => !allowed.has(`${s.gradeLevel}:${s.section}`));
        if (forbiddenStudent) {
          throw new ForbiddenException('You are not assigned to grade this class');
        }
      }

      const promises = records.map(async (record) => {
        // Calculate total score
        const totalScore = record.finalExam + record.midExam + record.quiz + record.classActivity;

        // Calculate letter grade
        const letterGrade = this.calculateLetterGrade(totalScore);

        // Determine pass/fail
        const isPassed = totalScore >= 50;

        // Upsert (create or update)
        return await this.prisma.grade.upsert({
          where: {
            studentId_subjectId_term_academicYear: {
              studentId: record.studentId,
              subjectId: record.subjectId,
              term: record.term,
              academicYear: record.academicYear
            }
          },
          update: {
            finalExam: record.finalExam,
            midExam: record.midExam,
            quiz: record.quiz,
            classActivity: record.classActivity,
            totalScore,
            letterGrade,
            isPassed,
            teacherId: actorRole === Role.TEACHER ? teacherProfileId : null
          },
          create: {
            studentId: record.studentId,
            subjectId: record.subjectId,
            finalExam: record.finalExam,
            midExam: record.midExam,
            quiz: record.quiz,
            classActivity: record.classActivity,
            totalScore,
            letterGrade,
            isPassed,
            term: record.term,
            academicYear: record.academicYear,
            teacherId: actorRole === Role.TEACHER ? teacherProfileId : null
          },
          include: {
            subject: {
              select: { name: true, code: true }
            },
            student: {
              select: { firstName: true, lastName: true, gradeLevel: true, section: true }
            }
          }
        });
      });

      const results = await Promise.all(promises);
      this.logger.log(`Grades marked for ${results.length} students`);
      return results;
    } catch (error) {
      this.logger.error('Failed to mark grades:', error);
      throw new InternalServerErrorException('Failed to mark grades. Please check student and subject IDs.');
    }
  }

  /**
   * Get student report card with detailed breakdown
   */
  async getStudentReport(studentId: string, term: number, academicYear: string) {
    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        term,
        academicYear
      },
      include: {
        subject: {
          select: { name: true, code: true, stream: true }
        }
      },
      orderBy: {
        subject: {
          name: 'asc'
        }
      }
    });

    if (grades.length === 0) {
      throw new NotFoundException('No grades found for this student in the specified term.');
    }

    // Calculate overall statistics
    const totalScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
    const average = totalScore / grades.length;
    const passedSubjects = grades.filter(g => g.isPassed).length;
    const failedSubjects = grades.length - passedSubjects;

    return {
      studentId,
      term,
      academicYear,
      totalSubjects: grades.length,
      passedSubjects,
      failedSubjects,
      overallAverage: parseFloat(average.toFixed(2)),
      overallGrade: this.calculateLetterGrade(average),
      overallStatus: average >= 50 ? 'PASSED' : 'FAILED',
      subjects: grades.map(g => ({
        subject: g.subject.name,
        code: g.subject.code,
        components: {
          finalExam: `${g.finalExam}/50`,
          midExam: `${g.midExam}/30`,
          quiz: `${g.quiz}/10`,
          classActivity: `${g.classActivity}/10`
        },
        totalScore: g.totalScore,
        letterGrade: g.letterGrade,
        status: g.isPassed ? 'PASSED' : 'FAILED'
      }))
    };
  }

  /**
   * Get grades for a specific grade level and section (for teachers)
   */
  async getGradesByClass(
    gradeLevel: number,
    section: string,
    subjectId: string,
    term: number,
    academicYear: string,
    actorRole?: Role,
    teacherProfileId?: string | null,
  ) {
    if (actorRole === Role.TEACHER) {
      if (!teacherProfileId) throw new ForbiddenException('Teacher profile not found');
      const assignment = await this.prisma.teacherSubjectAssignment.findFirst({
        where: {
          teacherId: teacherProfileId,
          subjectId,
          gradeLevel,
          section,
        },
        select: { id: true },
      });
      if (!assignment) throw new ForbiddenException('You are not assigned to this class/subject');
    }

    const students = await this.prisma.student.findMany({
      where: {
        gradeLevel,
        section
      },
      include: {
        grades: {
          where: {
            subjectId,
            term,
            academicYear
          },
          include: {
            subject: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });

    return students.map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      gradeLevel: student.gradeLevel,
      section: student.section,
      grade: student.grades[0] || null // Will be null if not yet graded
    }));
  }

  /**
   * Get class statistics
   */
  async getClassStatistics(
    gradeLevel: number,
    section: string,
    subjectId: string,
    term: number,
    academicYear: string,
    actorRole?: Role,
    teacherProfileId?: string | null,
  ) {
    if (actorRole === Role.TEACHER) {
      if (!teacherProfileId) throw new ForbiddenException('Teacher profile not found');
      const assignment = await this.prisma.teacherSubjectAssignment.findFirst({
        where: {
          teacherId: teacherProfileId,
          subjectId,
          gradeLevel,
          section,
        },
        select: { id: true },
      });
      if (!assignment) throw new ForbiddenException('You are not assigned to this class/subject');
    }

    const grades = await this.prisma.grade.findMany({
      where: {
        term,
        academicYear,
        subjectId,
        student: {
          gradeLevel,
          section
        }
      }
    });

    if (grades.length === 0) {
      return {
        totalStudents: 0,
        gradedStudents: 0,
        passRate: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }

    const totalScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
    const passedCount = grades.filter(g => g.isPassed).length;

    return {
      totalStudents: await this.prisma.student.count({ where: { gradeLevel, section } }),
      gradedStudents: grades.length,
      passRate: parseFloat(((passedCount / grades.length) * 100).toFixed(2)),
      averageScore: parseFloat((totalScore / grades.length).toFixed(2)),
      highestScore: Math.max(...grades.map(g => g.totalScore)),
      lowestScore: Math.min(...grades.map(g => g.totalScore)),
      gradeDistribution: {
        'A+': grades.filter(g => g.letterGrade === 'A+').length,
        'A': grades.filter(g => g.letterGrade === 'A').length,
        'A-': grades.filter(g => g.letterGrade === 'A-').length,
        'B+': grades.filter(g => g.letterGrade === 'B+').length,
        'B': grades.filter(g => g.letterGrade === 'B').length,
        'B-': grades.filter(g => g.letterGrade === 'B-').length,
        'C+': grades.filter(g => g.letterGrade === 'C+').length,
        'C': grades.filter(g => g.letterGrade === 'C').length,
        'C-': grades.filter(g => g.letterGrade === 'C-').length,
        'D': grades.filter(g => g.letterGrade === 'D').length,
        'F': grades.filter(g => g.letterGrade === 'F').length
      }
    };
  }
}