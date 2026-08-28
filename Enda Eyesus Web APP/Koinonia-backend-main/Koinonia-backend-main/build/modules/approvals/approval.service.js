"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalService = exports.ApprovalService = void 0;
// src/modules/approvals/approval.service.ts
const client_1 = require("@prisma/client");
const errors_1 = require("../../utils/errors");
const prisma = new client_1.PrismaClient();
class ApprovalService {
    /**
     * Create a pending approval request for sub-class operations
     * Notifies all SECRETARIAT_CHAIRMAN users
     */
    async requestSubClassApproval(requestType, subClassId, requestedById, requestData) {
        // Create the approval request
        const approval = await prisma.subClassApprovalRequest.create({
            data: {
                sub_class_id: subClassId,
                request_type: requestType,
                requested_by_id: requestedById,
                request_data: requestData,
                status: 'PENDING'
            },
            include: {
                requested_by: { select: { full_name_three_parts: true, email: true } },
            }
        });
        // Fetch the sub-class to get service class info
        const subClass = await prisma.sub_classes.findUnique({
            where: { id: subClassId },
            include: {
                service_classes: { select: { class_name_amharic: true } }
            }
        });
        // Find all SECRETARIAT_CHAIRMAN users
        const chairmen = await prisma.user.findMany({
            where: { system_role: 'SECRETARIAT_CHAIRMAN' },
            select: { id: true, email: true, full_name_three_parts: true }
        });
        // Send notifications to all chairmen
        for (const chairman of chairmen) {
            const notificationTitle = `Pending Approval: ${requestType === 'CREATE' ? 'New Sub-Class' : requestType === 'ADD_LEADER' ? 'Leadership Assignment' : 'Update'} Request`;
            const notificationMessage = `${approval.requested_by.full_name_three_parts} requested approval to ${requestType === 'CREATE' ? 'create sub-class' : requestType === 'ADD_LEADER' ? 'assign leaders' : 'update'} "${subClass?.sub_class_name}" in ${subClass?.service_classes.class_name_amharic}.`;
            await prisma.notification.create({
                data: {
                    user_id: chairman.id,
                    title: notificationTitle,
                    message: notificationMessage,
                    type: 'SUB_CLASS_APPROVAL',
                    related_entity_id: approval.id,
                    target_route: '/dashboard/agent',
                    is_read: false
                }
            });
        }
        return approval;
    }
    /**
     * Get all pending approval requests
     */
    async getPendingApprovals(filter) {
        return prisma.subClassApprovalRequest.findMany({
            where: {
                status: 'PENDING',
                ...(filter?.requestType && { request_type: filter.requestType })
            },
            include: {
                requested_by: {
                    select: {
                        id: true,
                        full_name_three_parts: true,
                        email: true,
                        service_classes: { select: { class_name_amharic: true } }
                    }
                }
            },
            orderBy: { requested_at: 'desc' }
        });
    }
    /**
     * Approve a sub-class operation
     */
    async approveRequest(approvalId, approvedById, applyChanges = true) {
        const approval = await prisma.subClassApprovalRequest.findUnique({
            where: { id: approvalId },
            include: { sub_classes: true, requested_by: true }
        });
        if (!approval)
            throw new errors_1.NotFoundError('Approval request not found');
        if (approval.status !== 'PENDING')
            throw new errors_1.ForbiddenError('Only pending requests can be approved');
        // Update approval status
        const updated = await prisma.subClassApprovalRequest.update({
            where: { id: approvalId },
            data: {
                status: 'APPROVED',
                approved_by_id: approvedById,
                approved_at: new Date()
            },
            include: { requested_by: true, sub_classes: true }
        });
        // If approved, apply the changes
        if (applyChanges && approval.request_type === 'ADD_LEADER') {
            const { sub_chair_id, sub_vice_id, sub_secretary_id } = approval.request_data;
            await prisma.sub_classes.update({
                where: { id: approval.sub_class_id },
                data: {
                    ...(sub_chair_id && { sub_chair_id }),
                    ...(sub_vice_id && { sub_vice_id }),
                    ...(sub_secretary_id && { sub_secretary_id })
                }
            });
        }
        // Notify requester of approval
        await prisma.notification.create({
            data: {
                user_id: approval.requested_by_id,
                title: 'Approval Granted',
                message: `Your request to ${approval.request_type === 'CREATE' ? 'create sub-class' : 'assign leaders'} has been approved.`,
                type: 'SUB_CLASS_APPROVAL',
                related_entity_id: approvalId,
                target_route: '/member-affairs/sub-classes',
                is_read: false
            }
        });
        return updated;
    }
    /**
     * Reject a sub-class operation
     */
    async rejectRequest(approvalId, approvedById, rejectionReason) {
        const approval = await prisma.subClassApprovalRequest.findUnique({
            where: { id: approvalId },
            include: { requested_by: true }
        });
        if (!approval)
            throw new errors_1.NotFoundError('Approval request not found');
        if (approval.status !== 'PENDING')
            throw new errors_1.ForbiddenError('Only pending requests can be rejected');
        const updated = await prisma.subClassApprovalRequest.update({
            where: { id: approvalId },
            data: {
                status: 'REJECTED',
                approved_by_id: approvedById,
                approved_at: new Date(),
                rejection_reason: rejectionReason
            },
            include: { requested_by: true }
        });
        // Notify requester of rejection
        await prisma.notification.create({
            data: {
                user_id: approval.requested_by_id,
                title: 'Request Rejected',
                message: `Your request was rejected. Reason: ${rejectionReason}`,
                type: 'SUB_CLASS_APPROVAL',
                related_entity_id: approvalId,
                target_route: '/member-affairs/sub-classes',
                is_read: false
            }
        });
        return updated;
    }
    /**
     * Get approval history for a sub-class
     */
    async getApprovalHistory(subClassId) {
        return prisma.subClassApprovalRequest.findMany({
            where: { sub_class_id: subClassId },
            include: {
                requested_by: { select: { id: true, full_name_three_parts: true, email: true } },
                approved_by: { select: { id: true, full_name_three_parts: true, email: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }
}
exports.ApprovalService = ApprovalService;
exports.approvalService = new ApprovalService();
