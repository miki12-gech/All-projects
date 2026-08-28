import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherSubjectAssignmentService {
    private readonly logger = new Logger(TeacherSubjectAssignmentService.name);

    constructor(private prisma: PrismaService) {}

    /**
     * Get all teacher subject assignments (Admin only)
     */
    async findAll() {
        return this.prisma.teacherSubjectAssignment.findMany({
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                subject: true
            },
            orderBy: [
                { gradeLevel: 'asc' },
                { section: 'asc' },
                { subject: { name: 'asc' } }
            ]
        });
    }

    /**
     * Get assignments by teacher ID
     */
    async findByTeacherId(teacherId: string) {
        return this.prisma.teacherSubjectAssignment.findMany({
            where: { teacherId },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                subject: true
            },
            orderBy: [
                { gradeLevel: 'asc' },
                { section: 'asc' },
                { subject: { name: 'asc' } }
            ]
        });
    }

    /**
     * Create new teacher-subject assignment (Admin only)
     */
    async createAssignment(assignmentData: {
        teacherId: string;
        subjectId: string;
        gradeLevel: number;
        section: string;
    }) {
        try {
            // Verify teacher exists
            const teacher = await this.prisma.teacher.findUnique({
                where: { id: assignmentData.teacherId }
            });

            if (!teacher) {
                throw new NotFoundException('Teacher not found');
            }

            // Verify subject exists
            const subject = await this.prisma.subject.findUnique({
                where: { id: assignmentData.subjectId }
            });

            if (!subject) {
                throw new NotFoundException('Subject not found');
            }

            // Check if assignment already exists
            const existingAssignment = await this.prisma.teacherSubjectAssignment.findFirst({
                where: {
                    teacherId: assignmentData.teacherId,
                    subjectId: assignmentData.subjectId,
                    gradeLevel: assignmentData.gradeLevel,
                    section: assignmentData.section
                }
            });

            if (existingAssignment) {
                throw new Error('This assignment already exists');
            }

            const assignment = await this.prisma.teacherSubjectAssignment.create({
                data: {
                    teacherId: assignmentData.teacherId,
                    subjectId: assignmentData.subjectId,
                    gradeLevel: assignmentData.gradeLevel,
                    section: assignmentData.section,
                },
                include: {
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    role: true
                                }
                            }
                        }
                    },
                    subject: true
                }
            });

            this.logger.log(`Assignment created: ${subject.name} to ${teacher.firstName} ${teacher.lastName} - Grade ${assignmentData.gradeLevel} Section ${assignmentData.section}`);
            return assignment;
        } catch (error) {
            this.logger.error('Failed to create assignment:', error);
            throw error;
        }
    }

    /**
     * Update teacher-subject assignment (Admin only)
     */
    async updateAssignment(id: string, updateData: {
        teacherId?: string;
        subjectId?: string;
        gradeLevel?: number;
        section?: string;
    }) {
        try {
            const assignment = await this.prisma.teacherSubjectAssignment.findUnique({
                where: { id }
            });

            if (!assignment) {
                throw new NotFoundException('Assignment not found');
            }

            const updatedAssignment = await this.prisma.teacherSubjectAssignment.update({
                where: { id },
                data: updateData,
                include: {
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    role: true
                                }
                            }
                        }
                    },
                    subject: true
                }
            });

            this.logger.log(`Assignment updated: ${id}`);
            return updatedAssignment;
        } catch (error) {
            this.logger.error('Failed to update assignment:', error);
            throw error;
        }
    }

    /**
     * Delete teacher-subject assignment (Admin only)
     */
    async deleteAssignment(id: string) {
        try {
            const assignment = await this.prisma.teacherSubjectAssignment.findUnique({
                where: { id }
            });

            if (!assignment) {
                throw new NotFoundException('Assignment not found');
            }

            await this.prisma.teacherSubjectAssignment.delete({
                where: { id }
            });

            this.logger.log(`Assignment deleted: ${id}`);
            return { message: 'Assignment deleted successfully' };
        } catch (error) {
            this.logger.error('Failed to delete assignment:', error);
            throw error;
        }
    }

    /**
     * Get available subjects for assignment
     */
    async getAvailableSubjects() {
        return this.prisma.subject.findMany({
            orderBy: [
                { gradeLevel: 'asc' },
                { name: 'asc' }
            ]
        });
    }

    /**
     * Get available teachers for assignment
     */
    async getAvailableTeachers() {
        return this.prisma.teacher.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: [
                { firstName: 'asc' },
                { lastName: 'asc' }
            ]
        });
    }
}
