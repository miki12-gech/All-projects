"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesService = exports.MessagesService = void 0;
const messages_repository_1 = require("./messages.repository");
const notifications_repository_1 = require("../notifications/notifications.repository");
const db_1 = require("../../config/db");
const errors_1 = require("../../utils/errors");
class MessagesService {
    async getConversations(user) {
        return messages_repository_1.messagesRepository.getConversations(user.userID);
    }
    async searchUsers(user, query) {
        if (!query || query.length < 2)
            return [];
        const users = await db_1.db.user.findMany({
            where: {
                id: { not: user.userID },
                OR: [
                    { full_name_three_parts: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ],
                ...(user.role === 'MEMBER' ? {
                    system_role: {
                        in: ['SERVICE_MANAGER', 'SECRETARIAT_SECRETARY', 'SECRETARIAT_VICE', 'SECRETARIAT_CHAIRMAN']
                    }
                } : {})
            },
            select: { id: true, full_name_three_parts: true, profile_image_url: true, email: true, system_role: true },
            take: 10
        });
        return users.map(u => ({
            id: u.id,
            fullName: u.full_name_three_parts,
            profileImage: u.profile_image_url,
            username: u.email,
            role: u.system_role
        }));
    }
    async getChatHistory(user, otherUserId) {
        await messages_repository_1.messagesRepository.markAsRead(user.userID, otherUserId);
        return messages_repository_1.messagesRepository.getChatHistory(user.userID, otherUserId);
    }
    async sendMessage(user, receiverId, content) {
        const receiver = await db_1.db.user.findUnique({ where: { id: receiverId } });
        if (!receiver)
            throw new errors_1.NotFoundError('Receiver not found');
        if (user.role === 'MEMBER') {
            if (receiver.system_role === 'MEMBER' || receiver.system_role === 'USER') {
                throw new errors_1.ForbiddenError('Members cannot message other members directly');
            }
        }
        const msg = await messages_repository_1.messagesRepository.createMessage(user.userID, receiverId, content);
        await notifications_repository_1.notificationsRepository.spawnNotification({
            userID: receiverId,
            actorID: user.userID,
            type: 'MESSAGE',
            content: `Sent you a message`,
            linkTarget: `/dashboard/messages`
        });
        return msg;
    }
}
exports.MessagesService = MessagesService;
exports.messagesService = new MessagesService();
