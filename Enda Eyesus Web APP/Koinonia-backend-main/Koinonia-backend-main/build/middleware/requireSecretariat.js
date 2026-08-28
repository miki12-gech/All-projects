"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSecretariat = void 0;
const errors_1 = require("../utils/errors");
const requireSecretariat = (req, res, next) => {
    const user = req.user;
    if (!user)
        return next(new errors_1.ForbiddenError('Unauthorized'));
    const role = user.role || user.system_role;
    const secretariatRoles = ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SUPER_ADMIN'];
    if (secretariatRoles.includes(role)) {
        return next();
    }
    return next(new errors_1.ForbiddenError('Secretariat privileges required'));
};
exports.requireSecretariat = requireSecretariat;
