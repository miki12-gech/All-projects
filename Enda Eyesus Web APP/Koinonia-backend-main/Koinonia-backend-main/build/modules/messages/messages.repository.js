"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRepository = exports.MessagesRepository = void 0;
const db_1 = require("../../config/db");
const crypto_1 = __importDefault(require("crypto"));
const inMemoryMessages = [];
class MessagesRepository {
    async createMessage(senderID, receiverID, content) {
        const msg = {
            id: crypto_1.default.randomUUID(),
            senderID,
            receiverID,
            content,
            isRead: false,
            createdAt: new Date()
        };
        inMemoryMessages.push(msg);
        const sender = await db_1.db.user.findUnique({
            where: { id: senderID },
            select: { id: true, full_name_three_parts: true, profile_image_url: true }
        });
        return {
            ...msg,
            sender: sender ? {
                id: sender.id,
                fullName: sender.full_name_three_parts,
                profileImage: sender.profile_image_url
            } : null
        };
    }
    async getConversations(userID) {
        const userMessages = inMemoryMessages.filter(m => m.senderID === userID || m.receiverID === userID).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const conversations = new Map();
        for (const msg of userMessages) {
            const otherUserID = msg.senderID === userID ? msg.receiverID : msg.senderID;
            if (!conversations.has(otherUserID)) {
                const otherUser = await db_1.db.user.findUnique({
                    where: { id: otherUserID },
                    select: { id: true, full_name_three_parts: true, profile_image_url: true, email: true, system_role: true }
                });
                if (otherUser) {
                    conversations.set(otherUserID, {
                        user: {
                            id: otherUser.id,
                            fullName: otherUser.full_name_three_parts,
                            profileImage: otherUser.profile_image_url,
                            username: otherUser.email,
                            role: otherUser.system_role
                        },
                        lastMessage: msg,
                        unreadCount: msg.receiverID === userID && !msg.isRead ? 1 : 0
                    });
                }
            }
            else {
                if (msg.receiverID === userID && !msg.isRead) {
                    const c = conversations.get(otherUserID);
                    c.unreadCount += 1;
                }
            }
        }
        return Array.from(conversations.values());
    }
    async getChatHistory(user1, user2) {
        const chatMessages = inMemoryMessages.filter(m => (m.senderID === user1 && m.receiverID === user2) ||
            (m.senderID === user2 && m.receiverID === user1)).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const results = [];
        for (const msg of chatMessages) {
            const sender = await db_1.db.user.findUnique({
                where: { id: msg.senderID },
                select: { id: true, full_name_three_parts: true, profile_image_url: true }
            });
            results.push({
                ...msg,
                sender: sender ? {
                    id: sender.id,
                    fullName: sender.full_name_three_parts,
                    profileImage: sender.profile_image_url
                } : null
            });
        }
        return results;
    }
    async markAsRead(user1, user2) {
        for (const msg of inMemoryMessages) {
            if (msg.senderID === user2 && msg.receiverID === user1 && !msg.isRead) {
                msg.isRead = true;
            }
        }
        return { count: 1 };
    }
}
exports.MessagesRepository = MessagesRepository;
exports.messagesRepository = new MessagesRepository();
