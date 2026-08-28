import { IsArray, IsNotEmpty, IsString, IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';

export enum GradeComponentType {
  FINAL_EXAM = 'finalExam',
  MID_EXAM = 'midExam',
  QUIZ = 'quiz',
  CLASS_ACTIVITY = 'classActivity'
}

export class GradeComponentsDto {
  @IsArray()
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  finalExam: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  midExam: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  quiz: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  classActivity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  term: number;

  @IsOptional()
  @IsInt()
  @Min(2023)
  @Max(2100)
  academicYear: string;
}
