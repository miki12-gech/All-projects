import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional, Matches, Length } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  @Min(9)
  @Max(12)
  gradeLevel: number;

  @IsOptional()
  @IsString()
  stream?: 'NATURAL' | 'SOCIAL';

  // Contact Information
  @IsNotEmpty()
  @IsString()
  @Matches(/^0\d{9}$/, { message: 'Phone number must be 10 digits starting with 0' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string; // Will be converted to Date

  // Gender
  @IsOptional()
  @IsString()
  gender?: string;

  // Family Details
  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @IsNotEmpty()
  @IsString()
  motherName: string;

  @IsNotEmpty()
  @IsString()
  guardianName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^0\d{9}$/, { message: 'Guardian phone must be 10 digits starting with 0' })
  @Length(10, 10, { message: 'Guardian phone must be exactly 10 digits' })
  guardianPhone: string;

  @IsNotEmpty()
  @IsString()
  emergencyContact: string;
}
