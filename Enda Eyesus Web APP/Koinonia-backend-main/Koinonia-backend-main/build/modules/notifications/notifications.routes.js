"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/modules/notifications/notifications.routes.ts
const express_1 = require("express");
const notifications_controller_1 = require("./notifications.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, auth_1.requireActiveStatus);
router.get('/', notifications_controller_1.notificationsController.getNotifications);
router.get('/unread-count', notifications_controller_1.notificationsController.getUnreadCount);
router.patch('/read-all', notifications_controller_1.notificationsController.markAllAsRead);
router.patch('/:id/read', notifications_controller_1.notificationsController.markAsRead);
router.delete('/:id', notifications_controller_1.notificationsController.deleteNotification);
exports.default = router;
