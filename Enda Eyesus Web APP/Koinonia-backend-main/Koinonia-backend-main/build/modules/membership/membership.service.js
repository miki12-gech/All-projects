"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipService = exports.MembershipService = void 0;
// src/modules/membership/membership.service.ts
const db_1 = require("../../config/db");
const errors_1 = require("../../utils/errors");
// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Send a notification to every user that has one of the given roles */
async function notifyByRoles(roles, title, message, targetRoute) {
    const managers = await db_1.db.user.findMany({
        where: { system_role: { in: roles } },
        select: { id: true }
    });
    if (managers.length === 0)
        return;
    await db_1.db.notification.createMany({
        data: managers.map(m => ({
            user_id: m.id,
            title,
            message,
            target_route: targetRoute ?? null,
        }))
    });
}
/** Send a notification to every SERVICE_MANAGER of a specific class */
async function notifyClassManagers(classId, title, message, targetRoute) {
    const managers = await db_1.db.user.findMany({
        where: {
            service_class_id: classId,
            system_role: 'SERVICE_MANAGER'
        },
        select: { id: true }
    });
    if (managers.length === 0)
        return;
    await db_1.db.notification.createMany({
        data: managers.map(m => ({
            user_id: m.id,
            title,
            message,
            target_route: targetRoute ?? null,
        }))
    });
}
/** Check whether the user has passed any GUBAE_ABEW batch */
async function hasPassedGubaAbew(userId) {
    const enrollment = await db_1.db.lms_enrollments.findFirst({
        where: {
            user_id: userId,
            is_passed: true,
            lms_batches: { course_track: 'GUBAE_ABEW' }
        }
    });
    return enrollment !== null;
}
// ─── Service ──────────────────────────────────────────────────────────────────
class MembershipService {
    /**
     * POST /api/v1/membership/apply
     *
     * Rules:
     *  1. If the applicant has passed Gubae Abew → auto-upgrade to MEMBER,
     *     save registration data, store preferred class as pending_class_id,
     *     and notify member-affairs secretariat to confirm the class assignment.
     *
     *  2. If NOT a Gubae Abew graduate → stay as USER (PENDING status),
     *     save registration data, store preferred class as pending_class_id,
     *     and notify member-affairs secretariat to review both membership and class.
     */
    async apply(userID, data) {
        const user = await db_1.db.user.findUnique({ where: { id: userID } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        // Guard: already a member or higher
        if (user.system_role !== 'USER') {
            throw new errors_1.BadRequestError('You have already completed membership registration');
        }
        // Validate preferred class if provided
        if (data.preferred_class_id) {
            const cls = await db_1.db.serviceClass.findUnique({ where: { id: data.preferred_class_id } });
            if (!cls || !cls.is_public_registration) {
                throw new errors_1.BadRequestError('Invalid preferred service class');
            }
        }
        const isGraduate = await hasPassedGubaAbew(userID);
        if (isGraduate) {
            // ── Path A: Auto-upgrade to MEMBER, class assignment still pending ──
            await db_1.db.user.update({
                where: { id: userID },
                data: {
                    university_id: data.university_id,
                    academic_dept: data.academic_dept,
                    academic_year: data.academic_year,
                    dorm_block: data.dorm_block,
                    dorm_room: data.dorm_room,
                    system_role: 'MEMBER',
                    pending_class_id: data.preferred_class_id ?? null,
                    // service_class_id intentionally NOT set — awaits confirmation
                }
            });
            // Notify secretariat / member affairs
            const notifMsg = data.preferred_class_id
                ? `${user.full_name_three_parts} successfully registered as a member and requested class assignment confirmation.`
                : `${user.full_name_three_parts} successfully registered as a member. No preferred class was specified.`;
            await notifyByRoles(['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'], 'New Member Registration', notifMsg, '/dashboard/agent?tab=approvals');
            return {
                status: 'MEMBER_UPGRADED_CLASS_PENDING',
                message: 'You are now a member! Your class assignment request has been sent to the Member Affairs manager for confirmation.'
            };
        }
        else {
            // ── Path B: Not a graduate – save data, send for review ──
            await db_1.db.user.update({
                where: { id: userID },
                data: {
                    university_id: data.university_id,
                    academic_dept: data.academic_dept,
                    academic_year: data.academic_year,
                    dorm_block: data.dorm_block,
                    dorm_room: data.dorm_room,
                    pending_class_id: data.preferred_class_id ?? null,
                    // system_role stays 'USER' (PENDING)
                }
            });
            await notifyByRoles(['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'], 'Pending Membership Application', `${user.full_name_three_parts} submitted a membership application and is awaiting review.`, '/dashboard/agent?tab=approvals');
            return {
                status: 'APPLICATION_PENDING_REVIEW',
                message: 'Your application has been submitted. You will be notified once the Member Affairs manager reviews it.'
            };
        }
    }
    // ─── Admin: list all pending membership applications ────────────────────
    async getPendingApplications() {
        const users = await db_1.db.user.findMany({
            where: {
                system_role: 'USER',
                university_id: { not: null } // only those who filled in the form
            },
            select: {
                id: true,
                full_name_three_parts: true,
                email: true,
                university_id: true,
                academic_dept: true,
                academic_year: true,
                dorm_block: true,
                dorm_room: true,
                pending_class_id: true,
                created_at: true,
            },
            orderBy: { created_at: 'asc' }
        });
        // Resolve pending class names
        const classIds = [...new Set(users.map(u => u.pending_class_id).filter(Boolean))];
        const classes = classIds.length > 0
            ? await db_1.db.serviceClass.findMany({
                where: { id: { in: classIds } },
                select: { id: true, class_name_amharic: true }
            })
            : [];
        const classMap = Object.fromEntries(classes.map(c => [c.id, c.class_name_amharic]));
        return users.map(u => ({
            id: u.id,
            fullName: u.full_name_three_parts,
            email: u.email,
            universityId: u.university_id,
            academicDept: u.academic_dept,
            academicYear: u.academic_year,
            dormBlock: u.dorm_block,
            dormRoom: u.dorm_room,
            pendingClassId: u.pending_class_id,
            pendingClassName: u.pending_class_id ? classMap[u.pending_class_id] ?? null : null,
            requestDate: u.created_at,
            type: 'MEMBERSHIP_AND_CLASS'
        }));
    }
    // ─── Admin: list pending class assignments (already a MEMBER, awaiting class) ─
    async getPendingClassAssignments() {
        const users = await db_1.db.user.findMany({
            where: {
                system_role: 'MEMBER',
                pending_class_id: { not: null },
                service_class_id: null // class not yet confirmed
            },
            select: {
                id: true,
                full_name_three_parts: true,
                email: true,
                university_id: true,
                academic_dept: true,
                dorm_block: true,
                dorm_room: true,
                pending_class_id: true,
                created_at: true,
            },
            orderBy: { created_at: 'asc' }
        });
        const classIds = [...new Set(users.map(u => u.pending_class_id).filter(Boolean))];
        const classes = classIds.length > 0
            ? await db_1.db.serviceClass.findMany({
                where: { id: { in: classIds } },
                select: { id: true, class_name_amharic: true }
            })
            : [];
        const classMap = Object.fromEntries(classes.map(c => [c.id, c.class_name_amharic]));
        return users.map(u => ({
            id: u.id,
            fullName: u.full_name_three_parts,
            email: u.email,
            universityId: u.university_id,
            academicDept: u.academic_dept,
            dormBlock: u.dorm_block,
            dormRoom: u.dorm_room,
            pendingClassId: u.pending_class_id,
            pendingClassName: u.pending_class_id ? classMap[u.pending_class_id] ?? null : null,
            requestDate: u.created_at,
            type: 'CLASS_ONLY'
        }));
    }
    // ─── Admin: approve membership application (non-graduate path) ──────────
    async approveMembership(adminId, targetUserId) {
        const user = await db_1.db.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        if (user.system_role !== 'USER')
            throw new errors_1.BadRequestError('User is not in a pending membership state');
        await db_1.db.user.update({
            where: { id: targetUserId },
            data: { system_role: 'MEMBER' }
        });
        // Notify the user
        await db_1.db.notification.create({
            data: {
                user_id: targetUserId,
                title: 'Membership Approved ✓',
                message: 'Congratulations! Your membership application has been approved by the Member Affairs manager. Your class assignment will be confirmed shortly.',
                target_route: '/dashboard/membership/status?approved=true',
                type: 'MEMBERSHIP',
                related_entity_id: targetUserId
            }
        });
        // If they had a pending class, notify secretariat for class assignment
        if (user.pending_class_id) {
            await notifyByRoles(['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'], 'Class Assignment Pending', `${user.full_name_three_parts} was approved as a member. Please confirm their class assignment.`, '/dashboard/agent?tab=approvals');
        }
    }
    // ─── Admin: reject membership application ───────────────────────────────
    async rejectMembership(adminId, targetUserId, reason) {
        const user = await db_1.db.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        if (user.system_role !== 'USER')
            throw new errors_1.BadRequestError('User is not in a pending membership state');
        // Clear pending data but keep them as USER
        await db_1.db.user.update({
            where: { id: targetUserId },
            data: { pending_class_id: null }
        });
        await db_1.db.notification.create({
            data: {
                user_id: targetUserId,
                title: 'Membership Application Rejected',
                message: reason
                    ? `Your membership application was not approved. Reason: ${reason}`
                    : 'Your membership application was reviewed and was not approved at this time. Please contact the Member Affairs office for more details.',
                target_route: '/dashboard/membership/status?rejected=true',
                type: 'MEMBERSHIP',
                related_entity_id: targetUserId
            }
        });
    }
    // ─── Admin: confirm class assignment ────────────────────────────────────
    async confirmClassAssignment(adminId, targetUserId) {
        const user = await db_1.db.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        if (user.system_role !== 'MEMBER')
            throw new errors_1.BadRequestError('User must be a member before class assignment');
        if (!user.pending_class_id)
            throw new errors_1.BadRequestError('No pending class assignment for this user');
        const cls = await db_1.db.serviceClass.findUnique({ where: { id: user.pending_class_id } });
        if (!cls)
            throw new errors_1.NotFoundError('Pending class not found');
        await db_1.db.user.update({
            where: { id: targetUserId },
            data: {
                service_class_id: user.pending_class_id,
                pending_class_id: null,
            }
        });
        // Notify the member
        await db_1.db.notification.create({
            data: {
                user_id: targetUserId,
                title: 'Class Assignment Confirmed ✓',
                message: `You have been assigned to ${cls.class_name_amharic}. Welcome to your service class!`,
                target_route: '/dashboard/my-class'
            }
        });
        // Notify the class manager(s)
        await notifyClassManagers(cls.id, 'New Member Assigned to Your Class', `${user.full_name_three_parts} has been assigned to ${cls.class_name_amharic}. ` +
            `Department: ${user.academic_dept ?? 'N/A'} | Dorm: ${user.dorm_block ?? ''} ${user.dorm_room ?? ''}`.trim(), '/dashboard/my-class');
    }
    // ─── Admin: reject class assignment ─────────────────────────────────────
    async rejectClassAssignment(adminId, targetUserId, reason) {
        const user = await db_1.db.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        if (!user.pending_class_id)
            throw new errors_1.BadRequestError('No pending class assignment for this user');
        await db_1.db.user.update({
            where: { id: targetUserId },
            data: { pending_class_id: null }
        });
        await db_1.db.notification.create({
            data: {
                user_id: targetUserId,
                title: 'Class Assignment Not Confirmed',
                message: reason
                    ? `Your class assignment request was not confirmed. Reason: ${reason}`
                    : 'Your class assignment request was not confirmed at this time. Please contact the Member Affairs office.',
                target_route: '/dashboard'
            }
        });
    }
}
exports.MembershipService = MembershipService;
exports.membershipService = new MembershipService();
