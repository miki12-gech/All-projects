"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lmsController = exports.LMSController = void 0;
const lms_service_1 = require("./lms.service");
class LMSController {
    async getBatches(req, res, next) {
        try {
            const { course_track, status, limit, offset } = req.query;
            const result = await lms_service_1.lmsService.getBatches({
                course_track: course_track,
                status: status,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined
            });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getBatchById(req, res, next) {
        try {
            const { id } = req.params;
            const batch = await lms_service_1.lmsService.getBatchById(id);
            res.json(batch);
        }
        catch (error) {
            next(error);
        }
    }
    async getBatchEnrollments(req, res, next) {
        try {
            const { id } = req.params;
            const enrollments = await lms_service_1.lmsService.getBatchEnrollments(id);
            res.json(enrollments);
        }
        catch (error) {
            next(error);
        }
    }
    async getUserEnrollments(req, res, next) {
        try {
            const user = req.user;
            const enrollments = await lms_service_1.lmsService.getUserEnrollments(user.userID);
            res.json(enrollments);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LMSController = LMSController;
exports.lmsController = new LMSController();
