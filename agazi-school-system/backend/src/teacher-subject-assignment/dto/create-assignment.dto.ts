import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
    @IsNotEmpty()
    @IsString()
    teacherId: string;

    @IsNotEmpty()
    @IsString()
    subjectId: string;

    @IsInt()
    @Min(9)
    @Max(12)
    gradeLevel: number;

    @IsNotEmpty()
    @IsString()
    section: string;
}
