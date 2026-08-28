"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const getIp = (req) => {
    const fwd = req.headers['x-forwarded-for'];
    if (fwd)
        return Array.isArray(fwd) ? fwd[0] : fwd;
    return req.ip ?? req.socket.remoteAddress;
};
class AdminController {
    async getDashboardStats(req, res, next) {
        try {
            const stats = await admin_service_1.adminService.getDashboardStats();
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (e) {
            next(e);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await admin_service_1.adminService.getAllUsers(req.user);
            res.status(200).json({ status: 'success', data: users });
        }
        catch (e) {
            next(e);
        }
    }
    async approveUser(req, res, next) {
        try {
            const user = await admin_service_1.adminService.approveUser(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async rejectUser(req, res, next) {
        try {
            const user = await admin_service_1.adminService.rejectUser(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async suspendUser(req, res, next) {
        try {
            const user = await admin_service_1.adminService.suspendUser(req.user.userID, req.user, req.params.id, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async promoteRole(req, res, next) {
        try {
            const user = await admin_service_1.adminService.promoteRole(req.user.userID, req.user, req.params.id, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async changeUserClass(req, res, next) {
        try {
            const user = await admin_service_1.adminService.changeUserClass(req.user.userID, req.params.id, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Sub-Class Management ───────────────────────────────────────
    async getSubClasses(req, res, next) {
        try {
            const data = await admin_service_1.adminService.getSubClasses(req.user);
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async createSubClass(req, res, next) {
        try {
            const subClass = await admin_service_1.adminService.createSubClass(req.user.userID, req.user, req.body, getIp(req));
            res.status(201).json({ status: 'success', data: subClass });
        }
        catch (e) {
            next(e);
        }
    }
    async updateSubClassRoles(req, res, next) {
        try {
            const updated = await admin_service_1.adminService.updateSubClassRoles(req.user.userID, req.user, req.params.id, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: updated });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Leader ────────────────────────────────────────────────────
    async promoteLeader(req, res, next) {
        try {
            const user = await admin_service_1.adminService.promoteLeader(req.user.userID, req.params.id, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async demoteLeader(req, res, next) {
        try {
            const user = await admin_service_1.adminService.demoteLeader(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Office ────────────────────────────────────────────────────
    async getOffice(req, res, next) {
        try {
            const data = await admin_service_1.adminService.getOfficeData();
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async getPendingOffice(req, res, next) {
        try {
            const data = await admin_service_1.adminService.getPendingOfficeRequests();
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    async approveOffice(req, res, next) {
        try {
            const user = await admin_service_1.adminService.approveOfficeRequest(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    async disapproveOffice(req, res, next) {
        try {
            const user = await admin_service_1.adminService.disapproveOfficeRequest(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: user });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Chairman Role Management ───────────────────────────────────────
    async assignRole(req, res, next) {
        try {
            const result = await admin_service_1.adminService.assignRole(req.user.userID, req.user, req.body, getIp(req));
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    async revokeRole(req, res, next) {
        try {
            const result = await admin_service_1.adminService.revokeRole(req.user.userID, req.user, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    async transferChairman(req, res, next) {
        try {
            const result = await admin_service_1.adminService.transferChairman(req.user.userID, req.body.targetUserId, getIp(req));
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Sub-Class Approvals ─────────────────────────────────────────────
    async getPendingSubClassApprovals(req, res, next) {
        try {
            const approvals = await admin_service_1.adminService.getPendingSubClassApprovals();
            res.status(200).json({ status: 'success', data: approvals });
        }
        catch (e) {
            next(e);
        }
    }
    async approveSubClass(req, res, next) {
        try {
            const result = await admin_service_1.adminService.approveSubClass(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    async rejectSubClass(req, res, next) {
        try {
            const result = await admin_service_1.adminService.rejectSubClass(req.user.userID, req.params.id, getIp(req));
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Audit Logs ─────────────────────────────────────────────────────
    async getAuditLogs(req, res, next) {
        try {
            const logs = await admin_service_1.adminService.getAuditLogs(req.query);
            res.status(200).json({ status: 'success', data: logs });
        }
        catch (e) {
            next(e);
        }
    }
    // ─── Member Census ───────────────────────────────────────────────────
    async getMemberCensus(req, res, next) {
        try {
            const census = await admin_service_1.adminService.getMemberCensus();
            res.status(200).json({ status: 'success', data: census });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
