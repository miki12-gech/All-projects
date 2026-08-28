"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentIdParamSchema = exports.postIdParamSchema = exports.createCommentSchema = exports.reactToPostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(255),
        content: zod_1.z.string().min(1),
        imageURL: zod_1.z.string().optional(),
        targetType: zod_1.z.enum(['GLOBAL', 'CLASS']),
        serviceClassID: zod_1.z.string().uuid().optional(),
    }),
});
exports.reactToPostSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        reactionType: zod_1.z.enum(['LIKE', 'DISLIKE']),
    }),
});
exports.createCommentSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        content: zod_1.z.string().min(1).max(2000).transform(s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;')),
        parentCommentID: zod_1.z.string().uuid().optional(),
    }),
});
exports.postIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.commentIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid(), commentId: zod_1.z.string().uuid() }),
});
