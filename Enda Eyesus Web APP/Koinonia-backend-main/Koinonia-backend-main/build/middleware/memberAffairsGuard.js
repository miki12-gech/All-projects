"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMemberAffairsAccess = void 0;
const errors_1 = require("../utils/errors");
const requireMemberAffairsAccess = async (req, res, next) => {
    const user = req.user;
    if (!user)
        return next(new errors_1.ForbiddenError('Unauthorized'));
    const role = user.role || user.system_role;
    // ✅ Allowed roles: all service managers, secretariat, chairman, vice, secretary, super admin
    const allowedRoles = [
        'SERVICE_MANAGER', // any service manager
        'SECRETARIAT_CHAIRMAN',
        'SECRETARIAT_VICE',
        'SECRETARIAT_SECRETARY',
        'SUPER_ADMIN'
    ];
    if (allowedRoles.includes(role)) {
        return next();
    }
    return next(new errors_1.ForbiddenError('Access denied. Required role: SERVICE_MANAGER or SECRETARIAT.'));
};
exports.requireMemberAffairsAccess = requireMemberAffairsAccess;
