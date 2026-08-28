"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementsController = exports.AnnouncementsController = void 0;
const announcements_service_1 = require("./announcements.service");
class AnnouncementsController {
    async createAnnouncement(req, res, next) {
        try {
            const userId = req.user.userID;
            const userRole = req.user.role;
            const userClassId = req.user.serviceClassID;
            const announcement = await announcements_service_1.announcementsService.createAnnouncement(userId, req.body, userRole, userClassId);
            res.status(201).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    async getAnnouncements(req, res, next) {
        try {
            const { userID, serviceClassID, role } = req.user;
            const announcements = await announcements_service_1.announcementsService.getAnnouncements(userID, serviceClassID || '', role);
            res.status(200).json({ items: announcements, total: announcements.length });
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingAnnouncements(req, res, next) {
        try {
            const pending = await announcements_service_1.announcementsService.getPendingAnnouncements();
            res.status(200).json({ data: pending });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserAnnouncements(req, res, next) {
        try {
            const userId = req.user.userID;
            const announcements = await announcements_service_1.announcementsService.getUserAnnouncements(userId);
            res.status(200).json({ data: announcements });
        }
        catch (error) {
            next(error);
        }
    }
    async approveAnnouncement(req, res, next) {
        try {
            const { id } = req.params;
            const approverId = req.user.userID;
            // ✅ Ensure id is string
            const announcement = await announcements_service_1.announcementsService.approveAnnouncement(id, approverId);
            res.status(200).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    async rejectAnnouncement(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const rejectorId = req.user.userID;
            const announcement = await announcements_service_1.announcementsService.rejectAnnouncement(id, reason, rejectorId);
            res.status(200).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    async resubmitAnnouncement(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userID;
            const announcement = await announcements_service_1.announcementsService.resubmitAnnouncement(id, userId, req.body);
            res.status(200).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    async reactToAnnouncement(req, res, next) {
        try {
            const userId = req.user.userID;
            const announcementId = req.params.id;
            const { type } = req.body;
            const result = await announcements_service_1.announcementsService.reactToAnnouncement(userId, announcementId, type);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async commentOnAnnouncement(req, res, next) {
        try {
            const userId = req.user.userID;
            const announcementId = req.params.id;
            const { content, parentCommentId } = req.body;
            const result = await announcements_service_1.announcementsService.commentOnAnnouncement(userId, announcementId, content, parentCommentId);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async updateAnnouncement(req, res, next) {
        try {
            const userId = req.user.userID;
            const userRole = req.user.role;
            const announcement = await announcements_service_1.announcementsService.updateAnnouncement(userId, userRole, req.params.id, req.body);
            res.status(200).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAnnouncement(req, res, next) {
        try {
            const userId = req.user.userID;
            const userRole = req.user.role;
            await announcements_service_1.announcementsService.deleteAnnouncement(userId, userRole, req.params.id);
            res.status(200).json({ status: 'success', message: 'Announcement deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    async editComment(req, res, next) {
        try {
            const userId = req.user.userID;
            const userRole = req.user.role;
            const { commentId } = req.params;
            const { content } = req.body;
            const comment = await announcements_service_1.announcementsService.editComment(userId, commentId, content, userRole);
            res.status(200).json(comment);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteComment(req, res, next) {
        try {
            const userId = req.user.userID;
            const userRole = req.user.role;
            const userClassID = req.user.serviceClassID;
            const { commentId } = req.params;
            const result = await announcements_service_1.announcementsService.deleteComment(userId, commentId, userRole, userClassID);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnnouncementsController = AnnouncementsController;
exports.announcementsController = new AnnouncementsController();
