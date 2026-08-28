import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) { }

  // 1. አዲስ ትምህርት መመዝገብ (ለአድሚን ብቻ)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: { name: string, code: string, gradeLevel: number, stream?: 'NATURAL' | 'SOCIAL' }) {
    return this.subjectService.createSubject(data);
  }

  // 2. ትምህርቶችን በክፍል ደረጃ መፈለግ
  @Get()
  findAll(@Query('grade') grade: string) {
    return this.subjectService.getSubjectsByGrade(Number(grade));
  }
}