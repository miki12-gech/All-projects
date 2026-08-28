"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsService = exports.NotificationsService = void 0;
//src/modules/notifications/notifications.service.ts
const notifications_repository_1 = require("./notifications.repository");
class NotificationsService {
    async getUserNotifications(user, limit = 20, offset = 0) {
        const list = await notifications_repository_1.notificationsRepository.getNotificationsForUser(user.userID, limit, offset);
        const unreadCount = await notifications_repository_1.notificationsRepository.getUnreadCount(user.userID);
        const total = await notifications_repository_1.notificationsRepository.getTotalCount(user.userID);
        return { list, unreadCount, total };
    }
    async getUnreadCount(user) {
        return await notifications_repository_1.notificationsRepository.getUnreadCount(user.userID);
    }
    async markAsRead(user, id) {
        await notifications_repository_1.notificationsRepository.markAsRead(id, user.userID);
        return { success: true };
    }
    async markAllAsRead(user) {
        await notifications_repository_1.notificationsRepository.markAllAsRead(user.userID);
        return { success: true };
    }
    async deleteNotification(user, id) {
        await notifications_repository_1.notificationsRepository.softDelete(id, user.userID);
        return { success: true };
    }
}
exports.NotificationsService = NotificationsService;
exports.notificationsService = new NotificationsService();
