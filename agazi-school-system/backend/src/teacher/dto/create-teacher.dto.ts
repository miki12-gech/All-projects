import { IsNotEmpty, IsString, IsOptional, Matches, Length } from 'class-validator';

export class CreateTeacherDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^0\d{9}$/, { message: 'Phone number must be 10 digits starting with 0' })
    @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
    phoneNumber: string;

    @IsOptional()
    @IsString()
    specialization?: string;

    // Teacher can select their subjects and classes
    @IsOptional()
    subjects?: string[]; // Array of subject IDs
    
    @IsOptional()
    grades?: number[]; // Array of grade levels
    
    @IsOptional()
    sections?: string[]; // Array of sections
}
