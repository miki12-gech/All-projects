"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lmsService = exports.LMSService = void 0;
const lms_repository_1 = require("./lms.repository");
const errors_1 = require("../../utils/errors");
class LMSService {
    repo = lms_repository_1.lmsRepository;
    async getBatches(query) {
        const limit = query.limit ? parseInt(query.limit.toString()) : 10;
        const offset = query.offset ? parseInt(query.offset.toString()) : 0;
        const filters = {};
        if (query.course_track)
            filters.course_track = query.course_track;
        if (query.status)
            filters.status = query.status;
        return this.repo.getBatches(filters, limit, offset);
    }
    async getBatchById(id) {
        const batch = await this.repo.getBatchById(id);
        if (!batch)
            throw new errors_1.NotFoundError('Batch not found');
        return batch;
    }
    async getBatchEnrollments(batchId) {
        const batch = await this.repo.getBatchById(batchId);
        if (!batch)
            throw new errors_1.NotFoundError('Batch not found');
        return this.repo.getEnrollmentsByBatch(batchId);
    }
    async getUserEnrollments(userId) {
        return this.repo.getUserEnrollments(userId);
    }
}
exports.LMSService = LMSService;
exports.lmsService = new LMSService();
