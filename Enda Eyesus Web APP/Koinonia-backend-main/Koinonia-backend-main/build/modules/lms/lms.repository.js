"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lmsRepository = exports.LMSRepository = void 0;
const db_1 = require("../../config/db");
class LMSRepository {
    async getBatches(filters, limit = 10, offset = 0) {
        const where = {};
        if (filters.course_track) {
            where.course_track = filters.course_track;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        const [batches, total] = await Promise.all([
            db_1.db.lms_batches.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { created_at: 'desc' }
            }),
            db_1.db.lms_batches.count({ where })
        ]);
        return { batches, total };
    }
    async getBatchById(id) {
        return db_1.db.lms_batches.findUnique({
            where: { id },
            include: {
                lms_enrollments: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                full_name_three_parts: true,
                                email: true,
                                profile_image_url: true
                            }
                        }
                    }
                }
            }
        });
    }
    async getEnrollmentsByBatch(batchId) {
        return db_1.db.lms_enrollments.findMany({
            where: { batch_id: batchId },
            include: {
                users: {
                    select: {
                        id: true,
                        full_name_three_parts: true,
                        email: true,
                        profile_image_url: true
                    }
                }
            }
        });
    }
    async getUserEnrollments(userId) {
        return db_1.db.lms_enrollments.findMany({
            where: { user_id: userId },
            include: {
                lms_batches: true
            }
        });
    }
}
exports.LMSRepository = LMSRepository;
exports.lmsRepository = new LMSRepository();
