"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesController = exports.MessagesController = void 0;
const messages_service_1 = require("./messages.service");
class MessagesController {
    async getConversations(req, res, next) {
        try {
            const data = await messages_service_1.messagesService.getConversations(req.user);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async searchUsers(req, res, next) {
        try {
            const data = await messages_service_1.messagesService.searchUsers(req.user, req.query.q);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async getChatHistory(req, res, next) {
        try {
            const data = await messages_service_1.messagesService.getChatHistory(req.user, req.params.userId);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async sendMessage(req, res, next) {
        try {
            if (!req.body.content)
                throw new Error('Content is required');
            const data = await messages_service_1.messagesService.sendMessage(req.user, req.params.userId, req.body.content);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.MessagesController = MessagesController;
exports.messagesController = new MessagesController();
