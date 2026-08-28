"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
// src/modules/auth/auth.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const env_1 = require("../../config/env");
const auth_repository_1 = require("./auth.repository");
const errors_1 = require("../../utils/errors");
const notifications_repository_1 = require("../notifications/notifications.repository");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 12;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userID: user.id,
        role: user.system_role,
        serviceClassID: user.service_class_id ?? null,
        serviceClassName: user.service_class_name ?? null,
    }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
};
class AuthService {
    async register(data) {
        const existingEmail = await auth_repository_1.authRepository.findByEmail(data.email);
        if (existingEmail)
            throw new errors_1.ConflictError('Email already registered');
        const passwordHash = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        const user = await auth_repository_1.authRepository.createUser({
            full_name_three_parts: data.full_name_three_parts,
            email: data.email,
            passwordHash,
            sex: data.sex,
            clerical_rank: data.clerical_rank || 'NONE',
            phone_number: data.phone_number,
            profile_image_url: data.profile_image_url,
            service_class_id: data.service_class_id,
            academic_dept: data.academic_dept,
            academic_year: data.academic_year,
            dorm_block: data.dorm_block,
            dorm_room: data.dorm_room,
        });
        // ─── NOTIFY MEMBER AFFAIRS MANAGERS ABOUT NEW PENDING USER ───
        try {
            // Find the Member Affairs service class
            const memberAffairsClass = await prisma.serviceClass.findFirst({
                where: { class_name_amharic: 'የአባልነት ጉዳይ ክፍል' }
            });
            if (memberAffairsClass) {
                const managers = await prisma.user.findMany({
                    where: {
                        system_role: 'SERVICE_MANAGER',
                        service_class_id: memberAffairsClass.id,
                    },
                    select: { id: true }
                });
                if (managers.length > 0) {
                    await notifications_repository_1.notificationsRepository.spawnBulkNotifications(managers.map((m) => m.id), {
                        actorID: user.id,
                        type: 'MEMBERSHIP',
                        content: `New member registration: ${user.full_name_three_parts} needs approval.`,
                        linkTarget: '/dashboard/member-affairs?tab=pending',
                        notificationType: 'MEMBERSHIP',
                        relatedEntityId: user.id
                    });
                }
            }
        }
        catch (notifError) {
            console.error('Failed to notify Member Affairs managers:', notifError);
        }
        const userWithClass = await auth_repository_1.authRepository.findById(user.id);
        const serviceClassName = userWithClass?.service_classes?.class_name_amharic;
        const tokenPayload = {
            id: user.id,
            system_role: user.system_role,
            service_class_id: user.service_class_id,
            service_class_name: serviceClassName,
        };
        const token = generateToken(tokenPayload);
        const { password_hash: _, ...userWithoutPassword } = user;
        return { user: { ...userWithoutPassword, serviceClassName }, token };
    }
    async login(data) {
        const user = await auth_repository_1.authRepository.findByEmail(data.email);
        if (!user)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password_hash);
        if (!isPasswordValid)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        const serviceClassName = user.service_classes?.class_name_amharic;
        const tokenPayload = {
            id: user.id,
            system_role: user.system_role,
            service_class_id: user.service_class_id,
            service_class_name: serviceClassName,
        };
        const token = generateToken(tokenPayload);
        const { password_hash: _, ...userWithoutPassword } = user;
        return { user: { ...userWithoutPassword, serviceClassName }, token };
    }
    async getUserById(id) {
        const user = await auth_repository_1.authRepository.findById(id);
        if (!user)
            return null;
        const serviceClassName = user.service_classes?.class_name_amharic;
        const { password_hash: _, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, serviceClassName };
    }
    async updateProfile(id, data) {
        const user = await auth_repository_1.authRepository.updateProfile(id, data);
        if (!user)
            return null;
        const serviceClassName = user.service_classes?.class_name_amharic;
        const { password_hash: _, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, serviceClassName };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
