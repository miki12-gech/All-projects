import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateAssignmentDto {
    @IsOptional()
    @IsString()
    teacherId?: string;

    @IsOptional()
    @IsString()
    subjectId?: string;

    @IsOptional()
    @IsInt()
    @Min(9)
    @Max(12)
    gradeLevel?: number;

    @IsOptional()
    @IsString()
    section?: string;
}
