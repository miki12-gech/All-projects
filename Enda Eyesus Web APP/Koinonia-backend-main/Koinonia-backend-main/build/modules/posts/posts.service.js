"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsService = exports.PostsService = void 0;
const posts_repository_1 = require("./posts.repository");
const errors_1 = require("../../utils/errors");
const db_1 = require("../../config/db");
const notifications_repository_1 = require("../notifications/notifications.repository");
class PostsService {
    async createPost(user, body) {
        if (user.role === 'MEMBER')
            throw new errors_1.ForbiddenError('Members cannot create posts');
        if (body.targetType === 'GLOBAL' && user.role !== 'SUPER_ADMIN') {
            throw new errors_1.ForbiddenError('Only SUPER_ADMIN can create global posts');
        }
        if (body.targetType === 'CLASS') {
            if (!body.serviceClassID)
                throw new errors_1.BadRequestError('serviceClassID is required for CLASS posts');
            if (user.role === 'CLASS_LEADER') {
                const effectiveClassId = user.classLeaderOf || user.serviceClassID;
                if (body.serviceClassID !== effectiveClassId) {
                    throw new errors_1.ForbiddenError('CLASS_LEADER can only post in their own class');
                }
            }
            const cls = await db_1.db.serviceClass.findUnique({ where: { id: body.serviceClassID } });
            if (!cls)
                throw new errors_1.NotFoundError('Service class not found');
        }
        // Activity logging via audit_logs (no Prisma model – fire-and-forget raw SQL)
        db_1.db.$executeRawUnsafe(`INSERT INTO audit_logs (user_id, action, entity_type, new_state) VALUES ($1, $2, $3, $4)`, user.userID, 'CREATE_POST', 'POST', JSON.stringify({ title: body.title })).catch(e => console.error('audit_log insert failed:', e));
        const post = await posts_repository_1.postsRepository.createPost({ authorID: user.userID, ...body });
        // Spawn notifications
        let targetUserIds = [];
        if (body.targetType === 'GLOBAL') {
            const users = await db_1.db.user.findMany({ select: { id: true } });
            targetUserIds = users.map(u => u.id);
        }
        else if (body.targetType === 'CLASS' && body.serviceClassID) {
            const users = await db_1.db.user.findMany({ where: { service_class_id: body.serviceClassID }, select: { id: true } });
            targetUserIds = users.map(u => u.id);
        }
        try {
            await notifications_repository_1.notificationsRepository.spawnBulkNotifications(targetUserIds, {
                actorID: user.userID,
                type: 'POST',
                content: `New post: ${post.title}`,
                linkTarget: `/dashboard/posts#${post.id}`,
                notificationType: 'POST',
                relatedEntityId: post.id
            });
        }
        catch (e) {
            console.error('Failed to spawn post notifications:', e);
        }
        return post;
    }
    async getPosts(user) {
        return posts_repository_1.postsRepository.getPostsForUser(user.serviceClassID, user.role);
    }
    async deletePost(user, postId) {
        const post = await posts_repository_1.postsRepository.findPostById(postId);
        if (!post)
            throw new errors_1.NotFoundError('Post not found');
        const isAuthor = post.authorID === user.userID;
        const isSuperAdmin = user.role === 'SUPER_ADMIN';
        const effectiveClassId = user.classLeaderOf || user.serviceClassID;
        const isClassLeaderOfPost = user.role === 'CLASS_LEADER' && post.serviceClassID === effectiveClassId;
        if (!isAuthor && !isSuperAdmin && !isClassLeaderOfPost) {
            throw new errors_1.ForbiddenError('Not authorized to delete this post');
        }
        return posts_repository_1.postsRepository.deletePost(postId);
    }
    async pinPost(user, postId) {
        if (user.role !== 'SUPER_ADMIN')
            throw new errors_1.ForbiddenError('Only SUPER_ADMIN can pin posts');
        const post = await posts_repository_1.postsRepository.findPostById(postId);
        if (!post)
            throw new errors_1.NotFoundError('Post not found');
        return posts_repository_1.postsRepository.pinPost(postId, !post.isPinned);
    }
    async react(user, postId, body) {
        const post = await posts_repository_1.postsRepository.findPostById(postId);
        if (!post)
            throw new errors_1.NotFoundError('Post not found');
        const reaction = await posts_repository_1.postsRepository.upsertReaction(postId, user.userID, body.reactionType);
        const counts = await posts_repository_1.postsRepository.getReactionCounts(postId);
        return { reaction, counts };
    }
    async getComments(postId) {
        const post = await posts_repository_1.postsRepository.findPostById(postId);
        if (!post)
            throw new errors_1.NotFoundError('Post not found');
        return posts_repository_1.postsRepository.getComments(postId);
    }
    async addComment(user, postId, body) {
        const post = await posts_repository_1.postsRepository.findPostById(postId);
        if (!post)
            throw new errors_1.NotFoundError('Post not found');
        // Single-level nesting logic
        let effectiveParentID = body.parentCommentID;
        if (effectiveParentID) {
            const parentComment = await posts_repository_1.postsRepository.findCommentById(effectiveParentID);
            if (!parentComment)
                throw new errors_1.NotFoundError('Parent comment not found');
            if (parentComment.parentCommentID) {
                // The parent is already a reply, attach to root comment instead
                effectiveParentID = parentComment.parentCommentID;
            }
        }
        const comment = await posts_repository_1.postsRepository.createComment(postId, user.userID, body.content, effectiveParentID);
        if (effectiveParentID) {
            const parentComment = await posts_repository_1.postsRepository.findCommentById(effectiveParentID);
            if (parentComment && parentComment.userID !== user.userID) {
                await notifications_repository_1.notificationsRepository.spawnNotification({
                    userID: parentComment.userID, actorID: user.userID,
                    type: 'REPLY', content: `Replied to your comment`,
                    linkTarget: `/dashboard/posts#${post.id}`,
                    notificationType: 'REPLY',
                    relatedEntityId: post.id
                });
            }
        }
        else if (post.authorID !== user.userID) {
            await notifications_repository_1.notificationsRepository.spawnNotification({
                userID: post.authorID, actorID: user.userID,
                type: 'REPLY', content: `Commented on your post`,
                linkTarget: `/dashboard/posts#${post.id}`,
                notificationType: 'REPLY',
                relatedEntityId: post.id
            });
        }
        return comment;
    }
    async deleteComment(user, postId, commentId) {
        const comment = await posts_repository_1.postsRepository.findCommentById(commentId);
        if (!comment)
            throw new errors_1.NotFoundError('Comment not found');
        if (comment.postID !== postId)
            throw new errors_1.BadRequestError('Comment does not belong to this post');
        const isAuthor = comment.userID === user.userID;
        const isSuperAdmin = user.role === 'SUPER_ADMIN';
        const effectiveClassId = user.classLeaderOf || user.serviceClassID;
        const isClassLeaderOfPost = user.role === 'CLASS_LEADER' && comment.post?.serviceClassID === effectiveClassId;
        if (!isAuthor && !isSuperAdmin && !isClassLeaderOfPost) {
            throw new errors_1.ForbiddenError('Not authorized to delete this comment');
        }
        return posts_repository_1.postsRepository.deleteComment(commentId);
    }
}
exports.PostsService = PostsService;
exports.postsService = new PostsService();
