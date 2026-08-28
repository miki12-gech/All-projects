"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/modules/auth/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_schema_1 = require("./auth.schema");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
// Rate limiter for login - 5 attempts per 15 minutes
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50, // Relaxed for development
    message: 'Too many login attempts, please try again after 15 minutes'
});
router.post('/register', (0, validate_1.validate)(auth_schema_1.registerSchema), auth_controller_1.authController.register);
router.post('/login', loginLimiter, (0, validate_1.validate)(auth_schema_1.loginSchema), auth_controller_1.authController.login);
const auth_1 = require("../../middleware/auth");
router.get('/me', auth_1.requireAuth, auth_controller_1.authController.getCurrentUser);
router.patch('/profile', auth_1.requireAuth, auth_controller_1.authController.updateProfile);
exports.default = router;
