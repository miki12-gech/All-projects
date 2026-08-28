import { IsOptional, IsString, IsInt, Min, Max, Matches, Length } from 'class-validator';

export class UpdateStudentDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsInt()
    @Min(9)
    @Max(12)
    gradeLevel?: number;

    // Section IS updatable by admin
    @IsOptional()
    @IsString()
    section?: string;

    @IsOptional()
    @IsString()
    stream?: 'NATURAL' | 'SOCIAL';

    // Contact Information
    @IsOptional()
    @IsString()
    @Matches(/^0\d{9}$/, { message: 'Phone number must be 10 digits starting with 0' })
    @Length(10, 10)
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    dateOfBirth?: string; // Will be converted to Date

    // Gender
    @IsOptional()
    @IsString()
    gender?: string;

    // Family Details
    @IsOptional()
    @IsString()
    fatherName?: string;

    @IsOptional()
    @IsString()
    motherName?: string;

    @IsOptional()
    @IsString()
    guardianName?: string;

    @IsOptional()
    @IsString()
    @Matches(/^0\d{9}$/, { message: 'Guardian phone must be 10 digits starting with 0' })
    @Length(10, 10)
    guardianPhone?: string;

    @IsOptional()
    @IsString()
    emergencyContact?: string;
}
