"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
// Helper to determine environment-specific cookie settings
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction, // Must be true in production
        sameSite: isProduction ? 'none' : 'lax', // 'none' is required for cross-domain (Vercel -> Render)
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
};
class AuthController {
    async register(req, res, next) {
        try {
            const { user, token } = await auth_service_1.authService.register(req.body);
            res.cookie('token', token, getCookieOptions());
            res.status(201).json({ ...user, token });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { user, token } = await auth_service_1.authService.login(req.body);
            res.cookie('token', token, getCookieOptions());
            res.status(200).json({
                id: user.id,
                system_role: user.system_role,
                token: token
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            // clearCookie requires the exact same domain/path/secure/sameSite flags used to set it
            const clearOptions = getCookieOptions();
            res.clearCookie('token', clearOptions);
            res.status(200).send();
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentUser(req, res, next) {
        try {
            const userID = req.user?.userID;
            if (!userID) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const user = await auth_service_1.authService.getUserById(userID);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userID = req.user?.userID;
            if (!userID) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const user = await auth_service_1.authService.updateProfile(userID, req.body);
            res.status(200).json({ data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
