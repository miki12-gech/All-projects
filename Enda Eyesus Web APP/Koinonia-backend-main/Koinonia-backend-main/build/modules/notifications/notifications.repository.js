"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRepository = exports.NotificationsRepository = void 0;
//src/modules/notifications/notifications.repository.ts
const db_1 = require("../../config/db");
class NotificationsRepository {
    async getNotificationsForUser(userID, limit = 20, offset = 0) {
        return db_1.db.notification.findMany({
            where: {
                user_id: userID,
                deleted_at: null
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
        });
    }
    async getUnreadCount(userID) {
        return db_1.db.notification.count({
            where: {
                user_id: userID,
                is_read: false,
                deleted_at: null
            }
        });
    }
    async getTotalCount(userID) {
        return db_1.db.notification.count({
            where: {
                user_id: userID,
                deleted_at: null
            }
        });
    }
    async markAsRead(id, userID) {
        return db_1.db.notification.updateMany({
            where: { id, user_id: userID, deleted_at: null },
            data: { is_read: true }
        });
    }
    async markAllAsRead(userID) {
        return db_1.db.notification.updateMany({
            where: { user_id: userID, is_read: false, deleted_at: null },
            data: { is_read: true }
        });
    }
    async softDelete(id, userID) {
        return db_1.db.notification.updateMany({
            where: { id, user_id: userID, deleted_at: null },
            data: { deleted_at: new Date() }
        });
    }
    async spawnNotification(data) {
        if (data.userID === data.actorID)
            return null; // don't notify self
        const titleMap = {
            POST: 'New Post',
            ANNOUNCEMENT: 'New Announcement',
            REPLY: 'New Comment',
            MESSAGE: 'New Message',
            MEMBERSHIP: 'Membership Update',
            ROLE: 'Role Update',
            COURSE: 'Course Update',
            BATCH: 'Batch Update'
        };
        return db_1.db.notification.create({
            data: {
                user_id: data.userID,
                title: titleMap[data.type] || 'Notification',
                message: data.content,
                target_route: data.linkTarget || null,
                type: data.notificationType || data.type,
                related_entity_id: data.relatedEntityId
            }
        });
    }
    async spawnBulkNotifications(userIDs, payload) {
        const filtered = userIDs.filter(id => id !== payload.actorID);
        if (filtered.length === 0)
            return null;
        const titleMap = {
            POST: 'New Post',
            ANNOUNCEMENT: 'New Announcement',
            REPLY: 'New Comment',
            MESSAGE: 'New Message',
            MEMBERSHIP: 'Membership Update',
            ROLE: 'Role Update',
            COURSE: 'Course Update',
            BATCH: 'Batch Update'
        };
        return db_1.db.notification.createMany({
            data: filtered.map(userID => ({
                user_id: userID,
                title: titleMap[payload.type] || 'Notification',
                message: payload.content,
                target_route: payload.linkTarget || null,
                type: payload.notificationType || payload.type,
                related_entity_id: payload.relatedEntityId
            }))
        });
    }
}
exports.NotificationsRepository = NotificationsRepository;
exports.notificationsRepository = new NotificationsRepository();
