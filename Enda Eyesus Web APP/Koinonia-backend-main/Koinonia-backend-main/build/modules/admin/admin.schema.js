"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferChairmanSchema = exports.assignRoleSchema = exports.updateSubClassRolesSchema = exports.createSubClassSchema = exports.suspendSchema = exports.changeClassSchema = exports.promoteLeaderSchema = exports.promoteRoleSchema = exports.userIdParamSchema = void 0;
const zod_1 = require("zod");
exports.userIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
});
exports.promoteRoleSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        role: zod_1.z.enum(['MEMBER', 'CLASS_LEADER', 'TEACHER', 'SERVICE_MANAGER', 'SUPER_ADMIN']),
        serviceClassId: zod_1.z.string().uuid('Invalid service class ID').optional()
    }),
});
exports.promoteLeaderSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        classID: zod_1.z.string().uuid('Invalid class ID'),
    }),
});
exports.changeClassSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        serviceClassID: zod_1.z.string().uuid('Invalid class ID'),
    }),
});
exports.suspendSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(5, 'Reason must be at least 5 characters long').max(200),
    }),
});
exports.createSubClassSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100)
    })
});
exports.updateSubClassRolesSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        sub_chair_id: zod_1.z.string().uuid().nullable().optional(),
        sub_vice_id: zod_1.z.string().uuid().nullable().optional(),
        sub_secretary_id: zod_1.z.string().uuid().nullable().optional(),
    })
});
// Chairman role management schemas
exports.assignRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        targetUserId: zod_1.z.string().uuid('Invalid user ID'),
        role: zod_1.z.enum(['SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER']),
        serviceClassId: zod_1.z.string().uuid('Invalid service class ID').optional()
    })
});
exports.transferChairmanSchema = zod_1.z.object({
    body: zod_1.z.object({
        targetUserId: zod_1.z.string().uuid('Invalid user ID')
    })
});
