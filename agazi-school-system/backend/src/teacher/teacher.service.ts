import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
    private readonly logger = new Logger(TeacherService.name);

    constructor(private prisma: PrismaService) { }

    /*
     * Generate unique email: firstnamelastname@agazi.edu
     */
    private async generateUniqueEmail(firstName: string, lastName: string, tx: any): Promise<string> {
        const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const base = `${cleanFirst}${cleanLast}` || 'teacher';
        let email = `${base}@agazi.edu`;
        let counter = 1;

        // Check availability
        while (await tx.user.findFirst({ where: { email } })) {
            email = `${base}${counter}@agazi.edu`;
            counter++;
        }
        return email;
    }

    /**
     * Register a new teacher (Admin only)
     * Teachers can select their subjects, grades, and sections
     */
    async registerTeacher(dto: CreateTeacherDto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                // Generate automatic email
                const email = await this.generateUniqueEmail(dto.firstName, dto.lastName, tx);

                // Create user account with default password
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash('agazi123', salt); // Default password

                const user = await tx.user.create({
                    data: {
                        email: email,
                        password: hashedPassword,
                        role: Role.TEACHER,
                    },
                });

                // Create teacher profile
                const teacher = await tx.teacher.create({
                    data: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        phoneNumber: dto.phoneNumber,
                        specialization: dto.specialization,
                        userId: user.id,
                    },
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true
                            }
                        }
                    }
                });

                // Create teacher-subject assignments if provided
                if (dto.subjects && dto.subjects.length > 0) {
                    const assignments = [];
                    for (const subjectId of dto.subjects) {
                        assignments.push({
                            teacherId: teacher.id,
                            subjectId: subjectId,
                            gradeLevel: 9, // Default grade level
                            section: 'A' // Default section
                        });
                    }
                    
                    // Create assignments in batch
                    if (assignments.length > 0) {
                        await tx.teacherSubjectAssignment.createMany({
                            data: assignments
                        });
                    }
                }

                // Create grade-section assignments if provided
                if (dto.grades && dto.grades.length > 0) {
                    const gradeAssignments = [];
                    for (const gradeLevel of dto.grades) {
                        for (const section of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) {
                            gradeAssignments.push({
                                teacherId: teacher.id,
                                subjectId: null, // No specific subject
                                gradeLevel: gradeLevel,
                                section: section
                            });
                        }
                    }
                    
                    // Create grade assignments in batch
                    if (gradeAssignments.length > 0) {
                        await tx.teacherSubjectAssignment.createMany({
                            data: gradeAssignments
                        });
                    }
                }

                // Create section assignments if provided
                if (dto.sections && dto.sections.length > 0) {
                    const sectionAssignments = [];
                    for (const section of dto.sections) {
                        sectionAssignments.push({
                            teacherId: teacher.id,
                            subjectId: null, // No specific subject
                            gradeLevel: 9, // Default grade level
                            section: section
                        });
                    }
                    
                    // Create section assignments in batch
                    if (sectionAssignments.length > 0) {
                        await tx.teacherSubjectAssignment.createMany({
                            data: sectionAssignments
                        });
                    }
                }

                this.logger.log(`Teacher registered: ${teacher.firstName} ${teacher.lastName} (${email})`);
                return teacher;
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            this.logger.error('Teacher registration failed:', error);
            throw new InternalServerErrorException('Teacher registration failed');
        }
    }

    async findAll() {
        return this.prisma.teacher.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                },
                subjectAssignments: {
                    include: {
                        subject: true
                    }
                }
            }
        });
    }

    async findOne(id: string) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                },
                subjectAssignments: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        return teacher;
    }

    async findByUserId(userId: string) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                },
                subjectAssignments: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        return teacher;
    }

    async update(id: string, dto: UpdateTeacherDto) {
        // Implementation can be added as needed
        return this.prisma.teacher.update({
            where: { id },
            data: {
                // ... fields
            }
        })
    }

    async remove(id: string) {
        return this.prisma.teacher.delete({ where: { id } });
    }
}
