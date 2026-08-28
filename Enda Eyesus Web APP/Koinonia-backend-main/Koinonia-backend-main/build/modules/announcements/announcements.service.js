"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementsService = exports.AnnouncementsService = void 0;
const announcements_repository_1 = require("./announcements.repository");
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const notifications_repository_1 = require("../notifications/notifications.repository");
class AnnouncementsService {
    repo;
    constructor() {
        this.repo = announcements_repository_1.announcementsRepository;
    }
    async createAnnouncement(adminId, data, userRole, userClassId) {
        if (data.targetType === 'CLASS' && !data.targetClassID) {
            throw new errors_1.BadRequestError('targetClassID is required when targetType is CLASS');
        }
        const isPublic = data.targetType === 'ALL';
        const targetClassId = data.targetType === 'CLASS' ? data.targetClassID : null;
        let status = client_1.AnnouncementStatus.APPROVED;
        if (userRole === 'SERVICE_MANAGER' && isPublic) {
            status = client_1.AnnouncementStatus.PENDING;
        }
        const payload = {
            title: data.title,
            content: data.content,
            is_public: isPublic,
            target_class_id: targetClassId,
            author_id: adminId,
            status,
            submitted_at: status === client_1.AnnouncementStatus.PENDING ? new Date() : null,
            image_url: Array.isArray(data.imageUrl) ? JSON.stringify(data.imageUrl) : (data.imageUrl || null),
            video_url: Array.isArray(data.videoUrl) ? JSON.stringify(data.videoUrl) : (data.videoUrl || null),
            pdf_url: Array.isArray(data.pdfUrl) ? JSON.stringify(data.pdfUrl) : (data.pdfUrl || null)
        };
        const announcement = await this.repo.createAnnouncement(payload);
        // ─── NOTIFICATIONS ───
        try {
            if (status === client_1.AnnouncementStatus.PENDING) {
                // Notify all secretariat members
                const secretariatUsers = await db_1.db.user.findMany({
                    where: {
                        system_role: { in: ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'] }
                    },
                    select: { id: true }
                });
                if (secretariatUsers.length > 0) {
                    await notifications_repository_1.notificationsRepository.spawnBulkNotifications(secretariatUsers.map(u => u.id), {
                        actorID: adminId,
                        type: 'ANNOUNCEMENT',
                        content: `New announcement pending: ${announcement.title}`,
                        linkTarget: `/dashboard/announcements?filter=pending&announcementId=${announcement.id}`,
                        notificationType: 'ANNOUNCEMENT',
                        relatedEntityId: announcement.id
                    });
                    console.log(`📢 Pending notification sent to ${secretariatUsers.length} secretariat users`);
                }
                else {
                    console.warn('⚠️ No secretariat users found to notify for pending announcement');
                }
            }
            else {
                // Notify target audience (approved announcements)
                let targetUserIds = [];
                if (isPublic) {
                    // Notify ALL users
                    const allUsers = await db_1.db.user.findMany({ select: { id: true } });
                    targetUserIds = allUsers.map(u => u.id);
                    console.log(`📢 Public announcement: will notify ${targetUserIds.length} users`);
                }
                else if (targetClassId) {
                    // Notify only members of that class
                    const classMembers = await db_1.db.user.findMany({
                        where: { service_class_id: targetClassId },
                        select: { id: true }
                    });
                    targetUserIds = classMembers.map(u => u.id);
                    console.log(`📢 Class-only announcement: will notify ${targetUserIds.length} class members`);
                }
                if (targetUserIds.length > 0) {
                    await notifications_repository_1.notificationsRepository.spawnBulkNotifications(targetUserIds, {
                        actorID: adminId,
                        type: 'ANNOUNCEMENT',
                        content: `New announcement: ${announcement.title}`,
                        linkTarget: `/dashboard/announcements?announcementId=${announcement.id}`,
                        notificationType: 'ANNOUNCEMENT',
                        relatedEntityId: announcement.id
                    });
                    console.log(`✅ Notification sent to ${targetUserIds.length} users`);
                }
                else {
                    console.warn(`⚠️ No target users found for announcement #${announcement.id}`);
                }
            }
        }
        catch (notifError) {
            console.error('❌ Failed to send notifications for announcement:', notifError);
            // Do NOT re-throw – announcement creation should succeed even if notifications fail
        }
        return announcement;
    }
    async getAnnouncements(userId, userClassID, userRole) {
        return this.repo.findAnnouncementsForUser(userId, userClassID, userRole);
    }
    async getPendingAnnouncements() {
        return this.repo.findPendingForSecretariat();
    }
    async getUserAnnouncements(userId) {
        return this.repo.findUserAnnouncements(userId);
    }
    async approveAnnouncement(id, approverId) {
        const announcement = await this.repo.findById(id);
        if (!announcement)
            throw new errors_1.BadRequestError('Announcement not found');
        if (announcement.status !== client_1.AnnouncementStatus.PENDING)
            throw new errors_1.BadRequestError('Announcement is not pending');
        const updated = await this.repo.updateAnnouncement(id, {
            status: client_1.AnnouncementStatus.APPROVED,
            approved_by: { connect: { id: approverId } },
            published_at: new Date()
        });
        // Notify creator
        await notifications_repository_1.notificationsRepository.spawnBulkNotifications([announcement.author_id], {
            actorID: approverId,
            type: 'ANNOUNCEMENT',
            content: `Your announcement "${announcement.title}" has been approved.`,
            linkTarget: `/dashboard/announcements?announcementId=${id}`,
            notificationType: 'ANNOUNCEMENT',
            relatedEntityId: id
        });
        // Notify target audience
        try {
            let targetUserIds = [];
            if (announcement.is_public) {
                const allUsers = await db_1.db.user.findMany({ select: { id: true } });
                targetUserIds = allUsers.map(u => u.id);
            }
            else if (announcement.target_class_id) {
                const classMembers = await db_1.db.user.findMany({
                    where: { service_class_id: announcement.target_class_id },
                    select: { id: true }
                });
                targetUserIds = classMembers.map(u => u.id);
            }
            targetUserIds = targetUserIds.filter(id => id !== announcement.author_id);
            if (targetUserIds.length > 0) {
                await notifications_repository_1.notificationsRepository.spawnBulkNotifications(targetUserIds, {
                    actorID: approverId,
                    type: 'ANNOUNCEMENT',
                    content: `New announcement: ${announcement.title}`,
                    linkTarget: `/dashboard/announcements?announcementId=${id}`,
                    notificationType: 'ANNOUNCEMENT',
                    relatedEntityId: id
                });
            }
        }
        catch (e) {
            console.error('Failed to send approval notifications:', e);
        }
        return updated;
    }
    async rejectAnnouncement(id, reason, rejectorId) {
        const announcement = await this.repo.findById(id);
        if (!announcement)
            throw new errors_1.BadRequestError('Announcement not found');
        if (announcement.status !== client_1.AnnouncementStatus.PENDING)
            throw new errors_1.BadRequestError('Announcement is not pending');
        const updated = await this.repo.updateAnnouncement(id, {
            status: client_1.AnnouncementStatus.REJECTED,
            rejection_reason: reason
        });
        try {
            await notifications_repository_1.notificationsRepository.spawnBulkNotifications([announcement.author_id], {
                actorID: rejectorId,
                type: 'ANNOUNCEMENT',
                content: `Your announcement "${announcement.title}" was rejected. Reason: ${reason}`,
                linkTarget: `/dashboard/my-announcements`,
                notificationType: 'ANNOUNCEMENT',
                relatedEntityId: id
            });
            console.log(`✅ Rejection notification sent to creator ${announcement.author_id}`);
        }
        catch (e) {
            console.error('❌ Failed to send rejection notification:', e);
        }
        return updated;
    }
    async resubmitAnnouncement(id, userId, data) {
        const announcement = await this.repo.findById(id);
        if (!announcement)
            throw new errors_1.BadRequestError('Announcement not found');
        if (announcement.author_id !== userId)
            throw new errors_1.ForbiddenError('You can only resubmit your own announcements');
        if (announcement.status !== client_1.AnnouncementStatus.REJECTED)
            throw new errors_1.BadRequestError('Only rejected announcements can be resubmitted');
        const updated = await this.repo.updateAnnouncement(id, {
            title: data.title,
            content: data.content,
            status: client_1.AnnouncementStatus.PENDING,
            submitted_at: new Date(),
            rejection_reason: null,
            image_url: Array.isArray(data.imageUrl) ? JSON.stringify(data.imageUrl) : (data.imageUrl || null),
            video_url: Array.isArray(data.videoUrl) ? JSON.stringify(data.videoUrl) : (data.videoUrl || null),
            pdf_url: Array.isArray(data.pdfUrl) ? JSON.stringify(data.pdfUrl) : (data.pdfUrl || null)
        });
        try {
            const secretariatUsers = await db_1.db.user.findMany({
                where: { system_role: { in: ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'] } }
            });
            if (secretariatUsers.length > 0) {
                await notifications_repository_1.notificationsRepository.spawnBulkNotifications(secretariatUsers.map(u => u.id), {
                    actorID: userId,
                    type: 'ANNOUNCEMENT',
                    content: `Re‑submitted announcement: ${updated.title}`,
                    linkTarget: `/dashboard/announcements?filter=pending&announcementId=${id}`,
                    notificationType: 'ANNOUNCEMENT',
                    relatedEntityId: id
                });
                console.log(`📢 Resubmit notification sent to ${secretariatUsers.length} secretariat users`);
            }
        }
        catch (e) {
            console.error('❌ Failed to send resubmit notification:', e);
        }
        return updated;
    }
    async updateAnnouncement(userId, userRole, id, data) {
        const announcement = await this.repo.findById(id);
        if (!announcement)
            throw new errors_1.BadRequestError('Announcement not found');
        const isCreator = announcement.author_id === userId;
        const isChairman = ['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN'].includes(userRole);
        const canEditPublic = isChairman && announcement.is_public;
        if (!isCreator && !canEditPublic) {
            throw new errors_1.ForbiddenError('You can only edit your own announcements or must be Chairman to edit public announcements');
        }
        const updateData = {
            title: data.title,
            content: data.content,
            is_public: data.targetType === 'ALL',
            target_class_id: data.targetType === 'CLASS' ? data.targetClassID : null,
            image_url: Array.isArray(data.imageUrl) || Array.isArray(data.image_url) ? JSON.stringify(data.imageUrl || data.image_url || []) : (data.imageUrl || data.image_url || null),
            video_url: Array.isArray(data.videoUrl) || Array.isArray(data.video_url) ? JSON.stringify(data.videoUrl || data.video_url || []) : (data.videoUrl || data.video_url || null),
            pdf_url: Array.isArray(data.pdfUrl) || Array.isArray(data.pdf_url) ? JSON.stringify(data.pdfUrl || data.pdf_url || []) : (data.pdfUrl || data.pdf_url || null)
        };
        return this.repo.updateAnnouncement(id, updateData);
    }
    async deleteAnnouncement(userId, userRole, id) {
        const announcement = await this.repo.findById(id);
        if (!announcement)
            throw new errors_1.BadRequestError('Announcement not found');
        const isCreator = announcement.author_id === userId;
        const isChairman = ['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN'].includes(userRole);
        const canDeletePublic = isChairman && announcement.is_public;
        if (!isCreator && !canDeletePublic) {
            throw new errors_1.ForbiddenError('You can only delete your own announcements or must be Chairman to delete public announcements');
        }
        return this.repo.deleteAnnouncement(id);
    }
    // ─── COMMENT EDIT/DELETE ───
    async editComment(userId, commentId, content, userRole) {
        if (!content || content.trim().length === 0) {
            throw new errors_1.BadRequestError('Comment content is required');
        }
        const comment = await db_1.db.comment.findUnique({
            where: { id: commentId }
        });
        if (!comment)
            throw new errors_1.BadRequestError('Comment not found');
        const isAuthor = comment.author_id === userId;
        const isChairman = ['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN'].includes(userRole);
        if (!isAuthor && !isChairman) {
            throw new errors_1.ForbiddenError('You can only edit your own comments, or chairman can edit any comment');
        }
        const updated = await db_1.db.comment.update({
            where: { id: commentId },
            data: { content: content.trim() },
            include: {
                users: { select: { full_name_three_parts: true, system_role: true, profile_image_url: true } }
            }
        });
        return {
            id: updated.id,
            content: updated.content,
            created_at: updated.created_at,
            author: updated.users ? {
                fullName: updated.users.full_name_three_parts,
                role: updated.users.system_role,
                profileImageUrl: updated.users.profile_image_url
            } : null
        };
    }
    async deleteComment(userId, commentId, userRole, userClassID) {
        const comment = await db_1.db.comment.findUnique({
            where: { id: commentId },
            select: {
                author_id: true,
                announcement_id: true,
                parent_comment_id: true
            }
        });
        if (!comment)
            throw new errors_1.BadRequestError('Comment not found');
        const announcement = await db_1.db.announcement.findUnique({
            where: { id: comment.announcement_id },
            select: { is_public: true, target_class_id: true }
        });
        if (!announcement)
            throw new errors_1.BadRequestError('Associated announcement not found');
        const isAuthor = comment.author_id === userId;
        const isChairman = ['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN'].includes(userRole);
        const isClassManager = userRole === 'SERVICE_MANAGER' &&
            !announcement.is_public &&
            announcement.target_class_id === userClassID;
        if (!isAuthor && !isChairman && !isClassManager) {
            throw new errors_1.ForbiddenError('You do not have permission to delete this comment');
        }
        await db_1.db.comment.deleteMany({ where: { parent_comment_id: commentId } });
        await db_1.db.comment.delete({ where: { id: commentId } });
        return { message: 'Comment deleted successfully' };
    }
    // ─── REACTIONS & COMMENTS ───
    async reactToAnnouncement(userId, announcementId, reactionType) {
        const existingReaction = await db_1.db.reactions.findUnique({
            where: {
                announcement_id_user_id: {
                    announcement_id: announcementId,
                    user_id: userId
                }
            }
        });
        if (existingReaction) {
            if (existingReaction.reaction_type === reactionType) {
                await db_1.db.reactions.delete({ where: { id: existingReaction.id } });
                return { message: 'Reaction removed' };
            }
            else {
                await db_1.db.reactions.update({
                    where: { id: existingReaction.id },
                    data: { reaction_type: reactionType }
                });
                return { message: 'Reaction updated' };
            }
        }
        else {
            await db_1.db.reactions.create({
                data: {
                    announcement_id: announcementId,
                    user_id: userId,
                    reaction_type: reactionType
                }
            });
            return { message: 'Reaction added' };
        }
    }
    async commentOnAnnouncement(userId, announcementId, content, parentCommentId) {
        if (!content || content.trim().length === 0) {
            throw new errors_1.BadRequestError('Comment content is required');
        }
        const comment = await db_1.db.comment.create({
            data: {
                announcement_id: announcementId,
                author_id: userId,
                content: content.trim(),
                parent_comment_id: parentCommentId || null
            },
            include: {
                users: { select: { full_name_three_parts: true, system_role: true } }
            }
        });
        return {
            ...comment,
            author: comment.users ? {
                fullName: comment.users.full_name_three_parts,
                role: comment.users.system_role
            } : null
        };
    }
}
exports.AnnouncementsService = AnnouncementsService;
exports.announcementsService = new AnnouncementsService();
