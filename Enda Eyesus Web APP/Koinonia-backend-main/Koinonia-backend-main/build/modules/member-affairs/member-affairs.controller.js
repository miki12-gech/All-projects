"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberAffairsController = void 0;
const member_affairs_service_1 = require("./member-affairs.service");
// Helper to safely extract string from params/query
function getStringParam(param) {
    if (!param)
        return '';
    if (typeof param === 'string')
        return param;
    if (Array.isArray(param))
        return param.length > 0 ? String(param[0]) : '';
    return String(param);
}
class MemberAffairsController {
    async getPending(req, res) {
        const pending = await member_affairs_service_1.memberAffairsService.getPendingMembers();
        res.json(pending);
    }
    async approve(req, res) {
        const userId = getStringParam(req.params.userId);
        const { preferredClassId } = req.body;
        const adminId = req.user?.userID;
        if (!adminId)
            return res.status(401).json({ error: 'Unauthorized' });
        const result = await member_affairs_service_1.memberAffairsService.approveMember(adminId, userId, preferredClassId);
        res.json(result);
    }
    async reject(req, res) {
        const userId = getStringParam(req.params.userId);
        const { reason } = req.body;
        const result = await member_affairs_service_1.memberAffairsService.rejectMember(userId, reason);
        res.json(result);
    }
    async listMembers(req, res) {
        const accessLevel = req.accessLevel;
        const userServiceClassId = req.userServiceClassId;
        const members = await member_affairs_service_1.memberAffairsService.listMembers(req.query, accessLevel, userServiceClassId);
        res.json(members);
    }
    async getMember(req, res) {
        const id = getStringParam(req.params.id);
        const member = await member_affairs_service_1.memberAffairsService.getMemberById(id);
        if (!member)
            return res.status(404).json({ error: 'Member not found' });
        res.json(member);
    }
    async updateMember(req, res) {
        const id = getStringParam(req.params.id);
        const adminId = req.user?.userID;
        if (!adminId)
            return res.status(401).json({ error: 'Unauthorized' });
        const updated = await member_affairs_service_1.memberAffairsService.updateMember(adminId, id, req.body);
        res.json(updated);
    }
    async getUnassignedSpiritual(req, res) {
        const unassigned = await member_affairs_service_1.memberAffairsService.getUnassignedSpiritual();
        res.json(unassigned);
    }
    async getSpiritualCandidates(req, res) {
        const roleParam = req.query.role;
        const role = typeof roleParam === 'string' ? roleParam : Array.isArray(roleParam) ? roleParam[0] : '';
        const candidates = await member_affairs_service_1.memberAffairsService.getSpiritualCandidates(role);
        res.json(candidates);
    }
    async assignSpiritual(req, res) {
        const memberId = getStringParam(req.params.memberId);
        const { role, valueId } = req.body;
        const result = await member_affairs_service_1.memberAffairsService.assignSpiritual(memberId, role, valueId);
        res.json(result);
    }
    async batchAssign(req, res) {
        const { memberIds, serviceClassId } = req.body;
        if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ error: 'Invalid memberIds' });
        }
        if (!serviceClassId)
            return res.status(400).json({ error: 'serviceClassId required' });
        const result = await member_affairs_service_1.memberAffairsService.batchAssignClass(memberIds, serviceClassId);
        res.json(result);
    }
    async listSubClasses(req, res) {
        const serviceClassId = getStringParam(req.params.serviceClassId);
        const subClasses = await member_affairs_service_1.memberAffairsService.listSubClasses(serviceClassId);
        res.json(subClasses);
    }
    async createSubClass(req, res) {
        try {
            const serviceClassId = getStringParam(req.params.serviceClassId);
            const userId = req.user?.userID;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const bypassApproval = req.bypassApproval;
            const newSubClass = await member_affairs_service_1.memberAffairsService.createSubClass(serviceClassId, req.body, userId, bypassApproval);
            res.json(newSubClass);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteSubClass(req, res) {
        const subClassId = getStringParam(req.params.subClassId);
        if (!subClassId)
            return res.status(400).json({ error: 'Sub-class ID is required' });
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const result = await member_affairs_service_1.memberAffairsService.deleteSubClass(subClassId, userId);
        res.json(result);
    }
    async addMemberToSubClass(req, res) {
        const subClassId = getStringParam(req.params.subClassId);
        const { userId } = req.body;
        const result = await member_affairs_service_1.memberAffairsService.addMemberToSubClass(subClassId, userId);
        res.json(result);
    }
    async removeMemberFromSubClass(req, res) {
        const subClassId = getStringParam(req.params.subClassId);
        const userId = getStringParam(req.params.userId);
        const result = await member_affairs_service_1.memberAffairsService.removeMemberFromSubClass(subClassId, userId);
        res.json(result);
    }
    // ============ DOCUMENTS ============
    async uploadSecretariatDocument(req, res) {
        const uploadedBy = req.user?.userID;
        if (!uploadedBy)
            return res.status(401).json({ error: 'Unauthorized' });
        // Try to get system_role first, then fall back to role
        const userRole = req.user?.system_role || req.user?.role;
        if (!userRole)
            return res.status(400).json({ error: 'User role not found' });
        const doc = await member_affairs_service_1.memberAffairsService.uploadDocument(null, req.body, uploadedBy, userRole);
        res.json(doc);
    }
    async listSecretariatDocuments(req, res) {
        const type = req.params.type;
        const userId = req.user?.userID || '';
        const userRole = req.user?.role || req.user.system_role;
        const docs = await member_affairs_service_1.memberAffairsService.listDocuments(null, type, userId, userRole);
        res.json(docs);
    }
    async uploadDocument(req, res) {
        const serviceClassIdParam = req.params.serviceClassId;
        let serviceClassId = null;
        if (serviceClassIdParam && serviceClassIdParam !== 'null') {
            serviceClassId = Array.isArray(serviceClassIdParam) ? serviceClassIdParam[0] : serviceClassIdParam;
        }
        const uploadedBy = req.user?.userID;
        if (!uploadedBy)
            return res.status(401).json({ error: 'Unauthorized' });
        const userRole = req.user?.role || req.user.system_role;
        const doc = await member_affairs_service_1.memberAffairsService.uploadDocument(serviceClassId, req.body, uploadedBy, userRole);
        res.json(doc);
    }
    async listDocuments(req, res) {
        const serviceClassIdParam = req.params.serviceClassId;
        let serviceClassId = null;
        if (serviceClassIdParam && serviceClassIdParam !== 'null') {
            serviceClassId = Array.isArray(serviceClassIdParam) ? serviceClassIdParam[0] : serviceClassIdParam;
        }
        const type = req.params.type;
        const userId = req.user?.userID || '';
        const userRole = req.user?.role || req.user.system_role;
        const docs = await member_affairs_service_1.memberAffairsService.listDocuments(serviceClassId, type, userId, userRole);
        res.json(docs);
    }
    async deleteDocument(req, res) {
        const id = getStringParam(req.params.id);
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const userRole = req.user?.role || req.user.system_role || '';
        const result = await member_affairs_service_1.memberAffairsService.deleteDocument(id, userId, userRole);
        res.json(result);
    }
    async getDocument(req, res) {
        const id = getStringParam(req.params.id);
        const userId = req.user?.userID || '';
        const userRole = req.user?.role || '';
        const doc = await member_affairs_service_1.memberAffairsService.getDocumentById(id, userId, userRole);
        res.json(doc);
    }
    async approveDocument(req, res) {
        const id = getStringParam(req.params.id);
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const result = await member_affairs_service_1.memberAffairsService.approveDocument(id, userId);
        res.json(result);
    }
    async rejectDocument(req, res) {
        const id = getStringParam(req.params.id);
        const { reason } = req.body;
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const result = await member_affairs_service_1.memberAffairsService.rejectDocument(id, userId, reason);
        res.json(result);
    }
    // ============ COMMENTS ============
    async addComment(req, res) {
        const id = getStringParam(req.params.id);
        const { content, parentId } = req.body;
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const comment = await member_affairs_service_1.memberAffairsService.addComment(id, userId, content, parentId);
        res.json(comment);
    }
    async deleteComment(req, res) {
        const commentId = getStringParam(req.params.commentId);
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        await member_affairs_service_1.memberAffairsService.deleteComment(commentId, userId);
        res.status(204).send();
    }
    // ============ REACTIONS ============
    async addReaction(req, res) {
        const id = getStringParam(req.params.id);
        const { reactionType } = req.body;
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const reaction = await member_affairs_service_1.memberAffairsService.addReaction(id, userId, reactionType);
        res.json(reaction);
    }
    async removeReaction(req, res) {
        const id = getStringParam(req.params.id);
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        await member_affairs_service_1.memberAffairsService.removeReaction(id, userId);
        res.status(204).send();
    }
    // ============ NOTIFICATIONS ============
    async notifyChairmanOfPendingDocument(req, res) {
        const uploadedBy = req.user?.userID;
        if (!uploadedBy)
            return res.status(401).json({ error: 'Unauthorized' });
        try {
            await member_affairs_service_1.memberAffairsService.notifyChairmanOfPendingDocument(uploadedBy);
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async notifyDocumentApproved(req, res) {
        const { documentId, excludeUserId } = req.body;
        if (!documentId) {
            return res.status(400).json({ error: 'documentId is required' });
        }
        try {
            await member_affairs_service_1.memberAffairsService.notifyDocumentApproved(documentId, excludeUserId);
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async notifyDocumentRejected(req, res) {
        const { userId, documentTitle, reason } = req.body;
        if (!userId || !documentTitle) {
            return res.status(400).json({ error: 'userId and documentTitle are required' });
        }
        try {
            await member_affairs_service_1.memberAffairsService.notifyDocumentRejected(userId, documentTitle, reason || '');
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async notifyCommentAdded(req, res) {
        const { userId, documentTitle } = req.body;
        if (!userId || !documentTitle) {
            return res.status(400).json({ error: 'userId and documentTitle are required' });
        }
        try {
            await member_affairs_service_1.memberAffairsService.notifyCommentAdded(userId, documentTitle);
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async notifyReactionAdded(req, res) {
        const { userId, documentTitle } = req.body;
        if (!userId || !documentTitle) {
            return res.status(400).json({ error: 'userId and documentTitle are required' });
        }
        try {
            await member_affairs_service_1.memberAffairsService.notifyReactionAdded(userId, documentTitle);
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // ============ UPDATE DOCUMENT ============
    async updateDocument(req, res) {
        const id = getStringParam(req.params.id);
        const userId = req.user?.userID;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const userRole = req.user?.role || req.user.system_role || '';
        const { title, description, drive_url, status } = req.body;
        const result = await member_affairs_service_1.memberAffairsService.updateDocument(id, userId, userRole, {
            title,
            description,
            drive_url,
            status,
        });
        res.json(result);
    }
}
exports.MemberAffairsController = MemberAffairsController;
