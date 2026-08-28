import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus, Role } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // በጅምላ መገኘት መመዝገብ
  async markAttendance(
    records: { studentId: string; status: AttendanceStatus; date?: string }[],
    actorRole?: Role,
    teacherProfileId?: string | null,
  ) {
    if (!records?.length) return { count: 0 };

    const normalized = records.map((r) => {
      const day = r.date ? new Date(r.date) : new Date();
      day.setHours(0, 0, 0, 0);
      return {
        studentId: r.studentId,
        status: r.status,
        date: day,
      };
    });

    // If teacher, enforce scope: teacher can only mark attendance for assigned grade/section
    if (actorRole === Role.TEACHER) {
      if (!teacherProfileId) throw new ForbiddenException('Teacher profile not found');

      const studentIds = Array.from(new Set(normalized.map((r) => r.studentId)));
      const students = await this.prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, gradeLevel: true, section: true },
      });

      const assignments = await this.prisma.teacherSubjectAssignment.findMany({
        where: { teacherId: teacherProfileId },
        select: { gradeLevel: true, section: true },
      });

      const allowed = new Set(assignments.map((a) => `${a.gradeLevel}:${a.section}`));
      const forbiddenStudent = students.find((s) => !allowed.has(`${s.gradeLevel}:${s.section}`));
      if (forbiddenStudent) {
        throw new ForbiddenException('You are not assigned to one or more selected classes');
      }
    }

    const upserts = normalized.map((r) =>
      this.prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date: r.date,
          },
        },
        update: {
          status: r.status,
          teacherId: actorRole === Role.TEACHER ? teacherProfileId : null,
        },
        create: {
          studentId: r.studentId,
          status: r.status,
          date: r.date,
          teacherId: actorRole === Role.TEACHER ? teacherProfileId : null,
        },
      }),
    );

    await this.prisma.$transaction(upserts);
    return { count: upserts.length };
  }
}