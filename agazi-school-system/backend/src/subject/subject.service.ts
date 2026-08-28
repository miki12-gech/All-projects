import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stream } from '@prisma/client';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) { }

  // 1. አዲስ ትምህርት መመዝገብ
  async createSubject(data: { name: string, code: string, gradeLevel: number, stream?: Stream }) {
    return this.prisma.subject.create({ data });
  }

  // 2. ሁሉንም ትምህርቶች ማምጣት
  async getAllSubjects() {
    return this.prisma.subject.findMany();
  }

  // 3. ለተወሰነ ክፍል የሚሆኑ ትምህርቶችን ማምጣት (ይህ ለFrontend በጣም አስፈላጊ ነው)
  async getSubjectsByGrade(grade: number, stream?: Stream) {
    const where: any = { gradeLevel: grade };
    if (stream) {
      where.OR = [
        { stream: stream },
        { stream: null } // ለሁሉም የሚሆን የጋራ ትምህርት ከሆነ
      ];
    }
    return this.prisma.subject.findMany({ where });
  }
}