import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // አዲሱን Module አምጣ
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { TeacherModule } from './teacher/teacher.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationModule } from './notification/notification.module';
import { TeacherSubjectAssignmentModule } from './teacher-subject-assignment/teacher-subject-assignment.module';
import { DatabaseTestService } from './database-test.service';

@Module({
  imports: [
    PrismaModule, // ፕሪስማን እዚህ አስገባ
    StudentModule,
    AuthModule,
    AttendanceModule,
    SubjectModule,
    GradeModule,
    TeacherModule,
    SettingsModule,
    NotificationModule,
    TeacherSubjectAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseTestService], // PrismaService-ን ከዚህ አውጣው
})
export class AppModule { }
