"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipController = exports.MembershipController = void 0;
const membership_service_1 = require("./membership.service");
const db_1 = require("../../config/db");
const errors_1 = require("../../utils/errors");
async function verifyMemberAffairsLock(user) {
    if (user.role === 'SERVICE_MANAGER') {
        if (!user.serviceClassID) {
            throw new errors_1.ForbiddenError('Service class ID is required for SERVICE_MANAGER');
        }
        const cls = await db_1.db.serviceClass.findUnique({ where: { id: user.serviceClassID } });
        if (cls?.class_name_amharic !== 'አባላት ጉዳይ ክፍል') {
            throw new errors_1.ForbiddenError('Only the Member Affairs Manager can access this queue');
        }
    }
}
class MembershipController {
    // POST /apply — user submits membership application
    async apply(req, res, next) {
        try {
            const user = req.user;
            const result = await membership_service_1.membershipService.apply(user.userID, req.body);
            res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    }
    // GET /pending — list users awaiting membership approval
    async getPendingApplications(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const data = await membership_service_1.membershipService.getPendingApplications();
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    // GET /pending-class — list users who are members but await class assignment
    async getPendingClassAssignments(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const data = await membership_service_1.membershipService.getPendingClassAssignments();
            res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    }
    // PATCH /:id/approve — upgrade to MEMBER, optional: confirm class
    async approveMembership(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const admin = req.user;
            await membership_service_1.membershipService.approveMembership(admin.userID, req.params.id);
            res.status(200).json({ status: 'success', message: 'Membership approved' });
        }
        catch (e) {
            next(e);
        }
    }
    // PATCH /:id/reject — reject application entirely
    async rejectMembership(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const admin = req.user;
            await membership_service_1.membershipService.rejectMembership(admin.userID, req.params.id, req.body.reason);
            res.status(200).json({ status: 'success', message: 'Membership application rejected' });
        }
        catch (e) {
            next(e);
        }
    }
    // PATCH /:id/confirm-class — confirm class assignment
    async confirmClassAssignment(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const admin = req.user;
            await membership_service_1.membershipService.confirmClassAssignment(admin.userID, req.params.id);
            res.status(200).json({ status: 'success', message: 'Class assignment confirmed' });
        }
        catch (e) {
            next(e);
        }
    }
    // PATCH /:id/reject-class — clear pending_class_id
    async rejectClassAssignment(req, res, next) {
        try {
            await verifyMemberAffairsLock(req.user);
            const admin = req.user;
            await membership_service_1.membershipService.rejectClassAssignment(admin.userID, req.params.id, req.body.reason);
            res.status(200).json({ status: 'success', message: 'Class assignment rejected' });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.MembershipController = MembershipController;
exports.membershipController = new MembershipController();
