"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const membership_controller_1 = require("./membership.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// ─── Member routes ────────────────────────────────────────────────────────────
// Any authenticated user (even pending) can apply for membership
router.post('/apply', auth_1.requireAuth, membership_controller_1.membershipController.apply);
// ─── Secretariat / Admin review routes ───────────────────────────────────────
const secretariat = [
    auth_1.requireAuth,
    auth_1.requireActiveStatus,
    (0, auth_1.requireRole)(['SUPER_ADMIN', 'SECRETARIAT_SECRETARY', 'SECRETARIAT_VICE', 'SECRETARIAT_CHAIRMAN', 'SERVICE_MANAGER'])
];
router.get('/pending', ...secretariat, membership_controller_1.membershipController.getPendingApplications);
router.get('/pending-class', ...secretariat, membership_controller_1.membershipController.getPendingClassAssignments);
router.patch('/:id/approve', ...secretariat, membership_controller_1.membershipController.approveMembership);
router.patch('/:id/reject', ...secretariat, membership_controller_1.membershipController.rejectMembership);
router.patch('/:id/confirm-class', ...secretariat, membership_controller_1.membershipController.confirmClassAssignment);
router.patch('/:id/reject-class', ...secretariat, membership_controller_1.membershipController.rejectClassAssignment);
exports.default = router;
