"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationController = void 0;
const education_service_1 = require("./education.service");
class EducationController {
    // Batches
    async listBatches(req, res) {
        const { phase } = req.query;
        const batches = await education_service_1.educationService.listBatches(typeof phase === 'string' ? phase : undefined);
        res.json(batches);
    }
    async createBatch(req, res) {
        const batch = await education_service_1.educationService.createBatch(req.body);
        res.json(batch);
    }
    // Subjects & Lessons
    async getSubjectsWithLessons(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const userId = req.user?.userID;
        const subjects = await education_service_1.educationService.getSubjectsWithProgress(idStr, userId);
        res.json(subjects);
    }
    async createSubject(req, res) {
        const subject = await education_service_1.educationService.createSubject(req.body);
        res.json(subject);
    }
    async createLesson(req, res) {
        const lesson = await education_service_1.educationService.createLesson(req.body);
        res.json(lesson);
    }
    async addInlineExplanation(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const { quotedText, explanation } = req.body;
        try {
            const result = await education_service_1.educationService.addInlineExplanation(idStr, quotedText, explanation);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async getLessonExplanations(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const explanations = await education_service_1.educationService.getLessonExplanations(idStr);
        res.json(explanations);
    }
    // Exams
    async createExam(req, res) {
        const exam = await education_service_1.educationService.createExam(req.body);
        res.json(exam);
    }
    async getExam(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const exam = await education_service_1.educationService.getExam(idStr);
        res.json(exam);
    }
    async submitExam(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const { answers } = req.body;
        const userId = req.user.userID;
        const result = await education_service_1.educationService.submitExam(idStr, userId, answers);
        res.json(result);
    }
    // Enrollments (member)
    async getMyEnrollment(req, res) {
        const userId = req.user.userID;
        const { phase } = req.params;
        const phaseStr = Array.isArray(phase) ? phase[0] : phase;
        const enrollment = await education_service_1.educationService.getMyEnrollment(userId, phaseStr);
        res.json(enrollment);
    }
    async requestRegistration(req, res) {
        const userId = req.user.userID;
        const { phase, batchId } = req.body;
        const phaseStr = Array.isArray(phase) ? phase[0] : phase;
        const batchIdStr = Array.isArray(batchId) ? batchId[0] : batchId;
        const enrollment = await education_service_1.educationService.requestRegistration(userId, phaseStr, batchIdStr);
        res.json(enrollment);
    }
    // Manager enrollment actions
    async getPendingEnrollments(req, res) {
        const pending = await education_service_1.educationService.getPendingEnrollments();
        res.json(pending);
    }
    async updateEnrollmentStatus(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const { status, reason } = req.body;
        const result = await education_service_1.educationService.updateEnrollmentStatus(idStr, status, reason);
        res.json(result);
    }
    async getEnrolledStudents(req, res) {
        const { batchId } = req.params;
        const batchIdStr = Array.isArray(batchId) ? batchId[0] : batchId;
        const students = await education_service_1.educationService.getEnrolledStudents(batchIdStr);
        res.json(students);
    }
    // Results & graduation
    async getStudentResults(req, res) {
        const results = await education_service_1.educationService.getStudentResults(req.query);
        res.json(results);
    }
    async getEducationClassMembers(req, res) {
        const members = await education_service_1.educationService.getEducationClassMembers();
        res.json(members);
    }
    async getEnrolledMembers(req, res) {
        const members = await education_service_1.educationService.getEnrolledMembers();
        res.json(members);
    }
    async markMemberGraduated(req, res) {
        try {
            const { memberId, phase } = req.body;
            if (!memberId || !phase) {
                return res.status(400).json({ error: 'memberId and phase are required' });
            }
            const result = await education_service_1.educationService.markMemberGraduated(memberId, phase);
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async removeMemberGraduation(req, res) {
        try {
            const { memberId, phase } = req.body;
            if (!memberId || !phase) {
                return res.status(400).json({ error: 'memberId and phase are required' });
            }
            const result = await education_service_1.educationService.removeMemberGraduation(memberId, phase);
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async getGubaePhases(req, res) {
        const phases = education_service_1.educationService.getGubaePhases();
        res.json(phases);
    }
    async overrideSubjectScore(req, res) {
        const { enrollmentId, subjectId } = req.params;
        const enrollmentIdStr = Array.isArray(enrollmentId) ? enrollmentId[0] : enrollmentId;
        const subjectIdStr = Array.isArray(subjectId) ? subjectId[0] : subjectId;
        const { passed, score } = req.body;
        const result = await education_service_1.educationService.overrideSubjectScore(enrollmentIdStr, subjectIdStr, passed, score);
        res.json(result);
    }
    async overrideExitScore(req, res) {
        const { enrollmentId } = req.params;
        const enrollmentIdStr = Array.isArray(enrollmentId) ? enrollmentId[0] : enrollmentId;
        const { passed, score } = req.body;
        const result = await education_service_1.educationService.overrideExitScore(enrollmentIdStr, passed, score);
        res.json(result);
    }
    async graduateMember(req, res) {
        const { id } = req.params;
        const idStr = Array.isArray(id) ? id[0] : id;
        const result = await education_service_1.educationService.graduateMember(idStr);
        res.json(result);
    }
    async updateExplanation(req, res) {
        try {
            const { id } = req.params;
            const { quotedText, explanation } = req.body;
            const idStr = Array.isArray(id) ? id[0] : id;
            const result = await education_service_1.educationService.updateExplanation(idStr, quotedText, explanation);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteExplanation(req, res) {
        try {
            const { id } = req.params;
            const idStr = Array.isArray(id) ? id[0] : id;
            const result = await education_service_1.educationService.deleteExplanation(idStr);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.EducationController = EducationController;
