"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveStatus = exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const requireAuth = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    if (!token) {
        return next(new errors_1.UnauthorizedError('No token provided'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError')
            return next(new errors_1.UnauthorizedError('Token expired'));
        return next(new errors_1.UnauthorizedError('Invalid token'));
    }
};
exports.requireAuth = requireAuth;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user)
            return next(new errors_1.UnauthorizedError('Not authenticated'));
        const userRole = req.user.role;
        // SECRETARIAT_CHAIRMAN has absolute structural priority and bypass authority over all system routes
        if (userRole === 'SECRETARIAT_CHAIRMAN' || userRole === 'SUPER_ADMIN') {
            return next();
        }
        // Map roles for backward compatibility with the existing codebase
        const effectiveAllowed = [...allowedRoles];
        if (allowedRoles.includes('SUPER_ADMIN')) {
            effectiveAllowed.push('SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY');
        }
        if (allowedRoles.includes('CLASS_LEADER')) {
            effectiveAllowed.push('SERVICE_MANAGER');
        }
        if (!effectiveAllowed.includes(userRole)) {
            return next(new errors_1.ForbiddenError(`Requires one of roles: ${allowedRoles.join(', ')}`));
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireActiveStatus = (req, res, next) => {
    if (!req.user)
        return next(new errors_1.UnauthorizedError('Not authenticated'));
    if (req.user.status === 'SUSPENDED') {
        return next(new errors_1.ForbiddenError('Account is suspended'));
    }
    if (req.user.status === 'PENDING') {
        return next(new errors_1.ForbiddenError('Account is pending approval'));
    }
    if (req.user.status === 'PENDING_OFFICE_APPROVAL') {
        return next(new errors_1.ForbiddenError('Account is pending office approval'));
    }
    next();
};
exports.requireActiveStatus = requireActiveStatus;
