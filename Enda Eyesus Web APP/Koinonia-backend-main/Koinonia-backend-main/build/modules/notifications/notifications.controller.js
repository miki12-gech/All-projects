"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsController = exports.NotificationsController = void 0;
const notifications_service_1 = require("./notifications.service");
class NotificationsController {
    async getNotifications(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            const data = await notifications_service_1.notificationsService.getUserNotifications(req.user, limit, offset);
            res.status(200).json({ items: data.list, total: data.total, unreadCount: data.unreadCount });
        }
        catch (e) {
            next(e);
        }
    }
    async getUnreadCount(req, res, next) {
        try {
            const count = await notifications_service_1.notificationsService.getUnreadCount(req.user);
            res.status(200).json({ unreadCount: count });
        }
        catch (e) {
            next(e);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const data = await notifications_service_1.notificationsService.markAsRead(req.user, req.params.id);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const data = await notifications_service_1.notificationsService.markAllAsRead(req.user);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async deleteNotification(req, res, next) {
        try {
            const data = await notifications_service_1.notificationsService.deleteNotification(req.user, req.params.id);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.NotificationsController = NotificationsController;
exports.notificationsController = new NotificationsController();
