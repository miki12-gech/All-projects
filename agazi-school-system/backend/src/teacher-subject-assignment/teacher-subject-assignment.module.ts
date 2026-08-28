import { Module } from '@nestjs/common';
import { TeacherSubjectAssignmentController } from './teacher-subject-assignment.controller';
import { TeacherSubjectAssignmentService } from './teacher-subject-assignment.service';

@Module({
    controllers: [TeacherSubjectAssignmentController],
    providers: [TeacherSubjectAssignmentService],
    exports: [TeacherSubjectAssignmentService]
})
export class TeacherSubjectAssignmentModule {}
