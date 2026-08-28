"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/memberAffairs.routes.ts
const express_1 = require("express");
const member_affairs_controller_1 = require("../modules/member-affairs/member-affairs.controller");
const auth_1 = require("../middleware/auth");
const serviceClassGuard_1 = require("../middleware/serviceClassGuard");
const memberAffairsGuard_1 = require("../middleware/memberAffairsGuard");
const requireSecretariat_1 = require("../middleware/requireSecretariat");
const memberAccessGuard_1 = require("../middleware/memberAccessGuard");
const router = (0, express_1.Router)();
const controller = new member_affairs_controller_1.MemberAffairsController();
router.use(auth_1.requireAuth);
// ============ SECRETARIAT DOCUMENT ENDPOINTS (no service class) ============
router.post('/documents/secretariat', auth_1.requireAuth, requireSecretariat_1.requireSecretariat, controller.uploadSecretariatDocument);
router.get('/documents/secretariat/:type', auth_1.requireAuth, requireSecretariat_1.requireSecretariat, controller.listSecretariatDocuments);
// ============ MEMBER MANAGEMENT ============
router.get('/members', memberAccessGuard_1.requireMemberAccess, controller.listMembers);
router.get('/members/:id', memberAccessGuard_1.requireMemberAccess, memberAccessGuard_1.validateMemberAccess, controller.getMember);
router.patch('/members/:id', memberAccessGuard_1.requireMemberAccess, memberAccessGuard_1.validateMemberAccess, memberAccessGuard_1.validateMemberWrite, controller.updateMember);
// ============ MEMBER AFFAIRS OPERATIONS ============
router.get('/pending', memberAffairsGuard_1.requireMemberAffairsAccess, controller.getPending);
router.post('/approve/:userId', memberAffairsGuard_1.requireMemberAffairsAccess, controller.approve);
router.post('/reject/:userId', memberAffairsGuard_1.requireMemberAffairsAccess, controller.reject);
router.get('/unassigned-spiritual', memberAffairsGuard_1.requireMemberAffairsAccess, controller.getUnassignedSpiritual);
router.get('/spiritual-candidates', memberAffairsGuard_1.requireMemberAffairsAccess, controller.getSpiritualCandidates);
router.post('/assign-spiritual/:memberId', memberAffairsGuard_1.requireMemberAffairsAccess, controller.assignSpiritual);
router.post('/batch-assign', memberAffairsGuard_1.requireMemberAffairsAccess, controller.batchAssign);
// ============ SUB-CLASS OPERATIONS ============
router.get('/sub-classes/:serviceClassId', serviceClassGuard_1.requireServiceClassAccess, controller.listSubClasses);
router.post('/sub-classes/:serviceClassId', serviceClassGuard_1.requireServiceClassAccess, serviceClassGuard_1.requireSubClassApproval, controller.createSubClass);
router.post('/sub-classes/:subClassId/members', serviceClassGuard_1.requireServiceClassAccess, memberAccessGuard_1.validateLeaderAssignment, controller.addMemberToSubClass);
router.delete('/sub-classes/:subClassId/members/:userId', serviceClassGuard_1.requireServiceClassAccess, controller.removeMemberFromSubClass);
router.delete('/sub-classes/:subClassId', auth_1.requireAuth, controller.deleteSubClass);
// ============ DOCUMENTS ============
// ✅ GET: Any authenticated user can list documents (service handles class filtering)
// ✅ POST: Only a manager of the class can upload (enforced by requireServiceClassAccess)
router.get('/documents/:serviceClassId/:type', auth_1.requireAuth, controller.listDocuments);
router.post('/documents/:serviceClassId', serviceClassGuard_1.requireServiceClassAccess, controller.uploadDocument);
router.patch('/documents/:id', auth_1.requireAuth, controller.updateDocument);
router.delete('/documents/:id', auth_1.requireAuth, controller.deleteDocument);
// ============ DOCUMENT APPROVAL, COMMENTS, REACTIONS ============
router.get('/documents/:id', auth_1.requireAuth, controller.getDocument);
router.post('/documents/:id/approve', auth_1.requireAuth, (0, auth_1.requireRole)(['SECRETARIAT_CHAIRMAN']), controller.approveDocument);
router.post('/documents/:id/reject', auth_1.requireAuth, (0, auth_1.requireRole)(['SECRETARIAT_CHAIRMAN']), controller.rejectDocument);
router.post('/documents/:id/comments', auth_1.requireAuth, controller.addComment);
router.delete('/documents/comments/:commentId', auth_1.requireAuth, controller.deleteComment);
router.post('/documents/:id/reactions', auth_1.requireAuth, controller.addReaction);
router.delete('/documents/:id/reactions', auth_1.requireAuth, controller.removeReaction);
// ============ NOTIFICATIONS ============
router.post('/notifications/document-pending', auth_1.requireAuth, controller.notifyChairmanOfPendingDocument);
router.post('/notifications/document-approved', auth_1.requireAuth, controller.notifyDocumentApproved);
router.post('/notifications/document-rejected', auth_1.requireAuth, controller.notifyDocumentRejected);
router.post('/notifications/comment-added', auth_1.requireAuth, controller.notifyCommentAdded);
router.post('/notifications/reaction-added', auth_1.requireAuth, controller.notifyReactionAdded);
exports.default = router;
