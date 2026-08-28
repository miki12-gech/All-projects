"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAnnouncementSchema = exports.resubmitAnnouncementSchema = exports.createAnnouncementSchema = void 0;
// src/modules/announcements/announcements.schema.ts
const zod_1 = require("zod");
exports.createAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters").max(255),
        content: zod_1.z.string().refine((val) => {
            const textContent = val.replace(/<[^>]*>/g, '').trim();
            return textContent.length >= 10;
        }, "Content must be at least 10 characters"),
        targetType: zod_1.z.string().refine((val) => ['ALL', 'CLASS', 'LEADERS'].includes(val), {
            message: "targetType must be one of: ALL, CLASS, LEADERS"
        }),
        targetClassID: zod_1.z.string().uuid("Invalid target Class ID").optional().nullable(),
        isPinned: zod_1.z.boolean().optional().default(false),
        scheduledAt: zod_1.z.string().datetime().optional().nullable(),
        imageUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
        videoUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
        pdfUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
    })
});
exports.resubmitAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(255),
        content: zod_1.z.string().min(10),
        imageUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
        videoUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
        pdfUrl: zod_1.z.array(zod_1.z.string()).optional().nullable(),
    })
});
exports.rejectAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        reason: zod_1.z.string().min(1, "Rejection reason is required")
    })
});
