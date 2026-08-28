"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/announcements/announcements.routes.ts
const express_1 = require("express");
const announcements_controller_1 = require("./announcements.controller");
const auth_1 = require("../../middleware/auth");
const requireSecretariat_1 = require("../../middleware/requireSecretariat");
const validate_1 = require("../../middleware/validate");
const announcements_schema_1 = require("./announcements.schema");
const router = (0, express_1.Router)();
// Public (authenticated) routes
router.get('/', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.getAnnouncements);
router.post('/:id/reactions', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.reactToAnnouncement);
router.post('/:id/comments', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.commentOnAnnouncement);
// Comment edit and delete (creator only)
router.patch('/:id/comments/:commentId', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.editComment);
router.delete('/:id/comments/:commentId', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.deleteComment);
// My announcements (for current user)
router.get('/my', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.getUserAnnouncements);
// Resubmit a rejected announcement (creator only)
router.patch('/:id/resubmit', auth_1.requireAuth, auth_1.requireActiveStatus, (0, validate_1.validate)(announcements_schema_1.resubmitAnnouncementSchema), announcements_controller_1.announcementsController.resubmitAnnouncement);
// Secretariat-only routes
router.get('/pending', auth_1.requireAuth, auth_1.requireActiveStatus, requireSecretariat_1.requireSecretariat, announcements_controller_1.announcementsController.getPendingAnnouncements);
router.patch('/:id/approve', auth_1.requireAuth, auth_1.requireActiveStatus, requireSecretariat_1.requireSecretariat, announcements_controller_1.announcementsController.approveAnnouncement);
router.patch('/:id/reject', auth_1.requireAuth, auth_1.requireActiveStatus, requireSecretariat_1.requireSecretariat, (0, validate_1.validate)(announcements_schema_1.rejectAnnouncementSchema), announcements_controller_1.announcementsController.rejectAnnouncement);
// Create announcement – allowed for secretariat AND service managers
router.post('/', auth_1.requireAuth, auth_1.requireActiveStatus, (0, validate_1.validate)(announcements_schema_1.createAnnouncementSchema), announcements_controller_1.announcementsController.createAnnouncement);
// Update and delete – only chairman
router.patch('/:id', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.updateAnnouncement);
router.delete('/:id', auth_1.requireAuth, auth_1.requireActiveStatus, announcements_controller_1.announcementsController.deleteAnnouncement);
exports.default = router;
