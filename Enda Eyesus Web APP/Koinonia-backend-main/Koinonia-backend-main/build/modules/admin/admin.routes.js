"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const admin_schema_1 = require("./admin.schema");
const router = (0, express_1.Router)();
const superAdmin = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SUPER_ADMIN'])];
const adminAccess = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SUPER_ADMIN', 'SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER'])];
// Dashboard & Users
router.get('/dashboard-stats', ...adminAccess, admin_controller_1.adminController.getDashboardStats);
router.get('/users', ...adminAccess, admin_controller_1.adminController.getAllUsers);
// User Status Management
router.patch('/users/:id/approve', ...superAdmin, (0, validate_1.validate)(admin_schema_1.userIdParamSchema), admin_controller_1.adminController.approveUser);
router.patch('/users/:id/reject', ...superAdmin, (0, validate_1.validate)(admin_schema_1.userIdParamSchema), admin_controller_1.adminController.rejectUser);
router.patch('/users/:id/suspend', ...adminAccess, (0, validate_1.validate)(admin_schema_1.suspendSchema), admin_controller_1.adminController.suspendUser);
router.patch('/users/:id/promote-role', ...adminAccess, (0, validate_1.validate)(admin_schema_1.promoteRoleSchema), admin_controller_1.adminController.promoteRole);
router.patch('/users/:id/change-class', ...superAdmin, (0, validate_1.validate)(admin_schema_1.changeClassSchema), admin_controller_1.adminController.changeUserClass);
// Leader Management
router.patch('/users/:id/promote-leader', ...superAdmin, (0, validate_1.validate)(admin_schema_1.promoteLeaderSchema), admin_controller_1.adminController.promoteLeader);
router.patch('/users/:id/demote-leader', ...superAdmin, (0, validate_1.validate)(admin_schema_1.userIdParamSchema), admin_controller_1.adminController.demoteLeader);
// Office (ፅሕፈት ቤት)
router.get('/office', ...superAdmin, admin_controller_1.adminController.getOffice);
router.get('/office/pending', ...superAdmin, admin_controller_1.adminController.getPendingOffice);
router.patch('/office/:id/approve', ...superAdmin, (0, validate_1.validate)(admin_schema_1.userIdParamSchema), admin_controller_1.adminController.approveOffice);
router.patch('/office/:id/disapprove', ...superAdmin, (0, validate_1.validate)(admin_schema_1.userIdParamSchema), admin_controller_1.adminController.disapproveOffice);
// Sub-Class Management
const admin_schema_2 = require("./admin.schema");
router.get('/subclasses', ...adminAccess, admin_controller_1.adminController.getSubClasses);
router.post('/subclasses', ...adminAccess, (0, validate_1.validate)(admin_schema_2.createSubClassSchema), admin_controller_1.adminController.createSubClass);
router.patch('/subclasses/:id/roles', ...adminAccess, (0, validate_1.validate)(admin_schema_2.updateSubClassRolesSchema), admin_controller_1.adminController.updateSubClassRoles);
// Chairman Role Management (SECRETARIAT_CHAIRMAN only)
const chairmanOnly = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN'])];
// Sub-Class Approvals (Chairman only)
router.get('/subclasses/pending-approvals', ...chairmanOnly, admin_controller_1.adminController.getPendingSubClassApprovals);
router.patch('/subclasses/:id/approve', ...chairmanOnly, admin_controller_1.adminController.approveSubClass);
router.patch('/subclasses/:id/reject', ...chairmanOnly, admin_controller_1.adminController.rejectSubClass);
router.post('/assign-role', ...chairmanOnly, (0, validate_1.validate)(admin_schema_1.assignRoleSchema), admin_controller_1.adminController.assignRole);
router.delete('/revoke-role/:id', ...chairmanOnly, admin_controller_1.adminController.revokeRole);
router.post('/transfer-chairman', ...chairmanOnly, (0, validate_1.validate)(admin_schema_1.transferChairmanSchema), admin_controller_1.adminController.transferChairman);
// Audit Logs and Member Census (Chairman only)
router.get('/audit-logs', ...chairmanOnly, admin_controller_1.adminController.getAuditLogs);
router.get('/member-census', ...chairmanOnly, admin_controller_1.adminController.getMemberCensus);
exports.default = router;
