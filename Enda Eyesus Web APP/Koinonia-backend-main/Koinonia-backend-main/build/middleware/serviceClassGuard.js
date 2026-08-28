"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubClassApproval = exports.requireServiceClassAccess = void 0;
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Guard for service class operations
 * Allows:
 * 1. SECRETARIAT members (all classes)
 * 2. SERVICE_MANAGER of the specific service class
 * 3. Users can view data but need approval for creation/modification
 */
const requireServiceClassAccess = async (req, res, next) => {
    const user = req.user;
    if (!user)
        return next(new errors_1.ForbiddenError('Unauthorized'));
    // TIER 1: Secretariat has full access to all classes
    if (['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'].includes(user.role)) {
        return next();
    }
    // TIER 2: SERVICE_MANAGER of the requested class
    // Extract serviceClassId from params (works for most routes)
    let serviceClassId = req.params.serviceClassId;
    if (!serviceClassId && req.params.subClassId) {
        // If operating on subClass, validate the subClass belongs to user's service class
        try {
            const subClassIdStr = Array.isArray(req.params.subClassId) ? req.params.subClassId[0] : req.params.subClassId;
            const subClass = await prisma.sub_classes.findUnique({
                where: { id: subClassIdStr },
                select: { parent_class_id: true }
            });
            if (subClass?.parent_class_id) {
                serviceClassId = subClass.parent_class_id;
            }
        }
        catch (err) {
            // Continue to next check
        }
    }
    if (user.role === 'SERVICE_MANAGER' && user.serviceClassID === serviceClassId) {
        return next();
    }
    // TIER 3: Allow reading for other SERVICE_MANAGERS (cross-dept visibility)
    if (user.role === 'SERVICE_MANAGER' && req.method === 'GET') {
        return next();
    }
    return next(new errors_1.ForbiddenError('Access denied. You do not have permission to manage this service class.'));
};
exports.requireServiceClassAccess = requireServiceClassAccess;
/**
 * Approve-only guard for write operations on sub-classes
 * Ensures SECRETARIAT approval is tracked even if SERVICE_MANAGER creates
 */
const requireSubClassApproval = async (req, res, next) => {
    const user = req.user;
    if (!user)
        return next(new errors_1.ForbiddenError('Unauthorized'));
    // SECRETARIAT can always write without approval
    if (['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'].includes(user.role)) {
        req.bypassApproval = true;
        return next();
    }
    // SERVICE_MANAGER can request (will require approval)
    if (user.role === 'SERVICE_MANAGER') {
        req.bypassApproval = false;
        return next();
    }
    return next(new errors_1.ForbiddenError('Only SERVICE_MANAGER or SECRETARIAT can manage sub-classes.'));
};
exports.requireSubClassApproval = requireSubClassApproval;
