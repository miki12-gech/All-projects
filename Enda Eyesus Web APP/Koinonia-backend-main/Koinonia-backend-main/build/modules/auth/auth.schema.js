"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
// src/modules/auth/auth.schema.ts
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name_three_parts: zod_1.z.string().min(2, "Full Name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        sex: zod_1.z.enum(["MALE", "FEMALE"]).optional(),
        clerical_rank: zod_1.z.enum(["NONE", "DEACON", "PRIEST", "LECTOR", "OTHER"]).optional(),
        phone_number: zod_1.z.string().optional(),
        profile_image_url: zod_1.z.string().optional(),
        // Academic & Residence fields
        service_class_id: zod_1.z.string().optional(),
        academic_dept: zod_1.z.string().optional(),
        academic_year: zod_1.z.number().int().optional(),
        dorm_block: zod_1.z.string().optional(),
        dorm_room: zod_1.z.string().optional(),
    })
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password is required"),
    })
});
