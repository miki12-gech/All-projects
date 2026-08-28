"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/approvals.routes.ts
const express_1 = require("express");
const approval_controller_1 = require("../modules/approvals/approval.controller");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All approval routes require authentication
router.use(auth_1.requireAuth);
// Only SECRETARIAT_CHAIRMAN can access approval endpoints
const secretariatGuard = (0, auth_2.requireRole)(['SECRETARIAT_CHAIRMAN']);
// Get all pending approvals
router.get('/pending', secretariatGuard, (req, res) => approval_controller_1.approvalController.getPendingApprovals(req, res));
// Approve a request
router.post('/:id/approve', secretariatGuard, (req, res) => approval_controller_1.approvalController.approveRequest(req, res));
// Reject a request
router.post('/:id/reject', secretariatGuard, (req, res) => approval_controller_1.approvalController.rejectRequest(req, res));
// Get approval history for a sub-class
router.get('/history/:subClassId', (req, res) => approval_controller_1.approvalController.getApprovalHistory(req, res));
exports.default = router;
