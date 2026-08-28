"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalController = exports.ApprovalController = void 0;
const approval_service_1 = require("./approval.service");
class ApprovalController {
    /**
     * Get all pending approval requests
     * Only SECRETARIAT can access
     */
    async getPendingApprovals(req, res) {
        try {
            const { requestType } = req.query;
            const approvals = await approval_service_1.approvalService.getPendingApprovals({
                requestType: requestType
            });
            res.json(approvals);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    /**
     * Approve a sub-class operation
     * Only SECRETARIAT can access
     */
    async approveRequest(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const approvedById = req.user?.userID;
            if (!approvedById)
                return res.status(401).json({ error: 'Unauthorized' });
            const { applyChanges = true } = req.body;
            const result = await approval_service_1.approvalService.approveRequest(id, approvedById, applyChanges);
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    /**
     * Reject a sub-class operation
     * Only SECRETARIAT can access
     */
    async rejectRequest(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const approvedById = req.user?.userID;
            if (!approvedById)
                return res.status(401).json({ error: 'Unauthorized' });
            const { rejectionReason } = req.body;
            if (!rejectionReason) {
                return res.status(400).json({ error: 'Rejection reason is required' });
            }
            const result = await approval_service_1.approvalService.rejectRequest(id, approvedById, rejectionReason);
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    /**
     * Get approval history for a sub-class
     */
    async getApprovalHistory(req, res) {
        try {
            const subClassId = Array.isArray(req.params.subClassId) ? req.params.subClassId[0] : req.params.subClassId;
            const history = await approval_service_1.approvalService.getApprovalHistory(subClassId);
            res.json(history);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.ApprovalController = ApprovalController;
exports.approvalController = new ApprovalController();
