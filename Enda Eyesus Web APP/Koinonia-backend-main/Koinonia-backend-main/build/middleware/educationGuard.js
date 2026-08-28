"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEducationManager = void 0;
const errors_1 = require("../utils/errors");
const requireEducationManager = (req, res, next) => {
    const user = req.user;
    if (!user)
        return next(new errors_1.ForbiddenError('Unauthorized'));
    // Secretariat bypass
    if (['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SUPER_ADMIN'].includes(user.role)) {
        return next();
    }
    // Must be SERVICE_MANAGER and belong to Education department
    if (user.role === 'SERVICE_MANAGER' && user.serviceClassName === 'የትምህርት ክፍል') {
        return next();
    }
    return next(new errors_1.ForbiddenError('Education Manager privileges required.'));
};
exports.requireEducationManager = requireEducationManager;
