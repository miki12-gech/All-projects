"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
// src/modules/auth/auth.repository.ts
const db_1 = require("../../config/db");
class AuthRepository {
    async createUser(data) {
        return db_1.db.user.create({
            data: {
                full_name_three_parts: data.full_name_three_parts,
                email: data.email,
                password_hash: data.passwordHash,
                system_role: 'USER',
                sex: data.sex,
                clerical_rank: data.clerical_rank || 'NONE',
                phone_number: data.phone_number,
                profile_image_url: data.profile_image_url,
                service_class_id: data.service_class_id,
                academic_dept: data.academic_dept,
                academic_year: data.academic_year,
                dorm_block: data.dorm_block,
                dorm_room: data.dorm_room,
            },
        });
    }
    async findByEmail(email) {
        return db_1.db.user.findUnique({
            where: { email },
            include: { service_classes: true }
        });
    }
    async findById(id) {
        return db_1.db.user.findUnique({
            where: { id },
            include: { service_classes: true }
        });
    }
    async updateProfile(id, data) {
        return db_1.db.user.update({
            where: { id },
            data: {
                phone_number: data.phone_number,
                academic_dept: data.academic_dept,
                academic_year: data.academic_year,
                dorm_block: data.dorm_block,
                dorm_room: data.dorm_room,
                sex: data.sex,
                clerical_rank: data.clerical_rank,
                bio: data.bio,
                profile_image_url: data.profile_image_url,
            },
            include: { service_classes: true }
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
