"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsController = exports.PostsController = void 0;
const posts_service_1 = require("./posts.service");
class PostsController {
    async getPosts(req, res, next) {
        try {
            const posts = await posts_service_1.postsService.getPosts(req.user);
            res.status(200).json({ status: 'success', data: posts });
        }
        catch (e) {
            next(e);
        }
    }
    async createPost(req, res, next) {
        try {
            const post = await posts_service_1.postsService.createPost(req.user, req.body);
            res.status(201).json({ status: 'success', data: post });
        }
        catch (e) {
            next(e);
        }
    }
    async deletePost(req, res, next) {
        try {
            await posts_service_1.postsService.deletePost(req.user, req.params.id);
            res.status(200).json({ status: 'success', message: 'Post deleted' });
        }
        catch (e) {
            next(e);
        }
    }
    async pinPost(req, res, next) {
        try {
            const post = await posts_service_1.postsService.pinPost(req.user, req.params.id);
            res.status(200).json({ status: 'success', data: post });
        }
        catch (e) {
            next(e);
        }
    }
    async reactToPost(req, res, next) {
        try {
            const result = await posts_service_1.postsService.react(req.user, req.params.id, req.body);
            res.status(200).json({ status: 'success', data: result });
        }
        catch (e) {
            next(e);
        }
    }
    async getComments(req, res, next) {
        try {
            const comments = await posts_service_1.postsService.getComments(req.params.id);
            res.status(200).json({ status: 'success', data: comments });
        }
        catch (e) {
            next(e);
        }
    }
    async addComment(req, res, next) {
        try {
            const comment = await posts_service_1.postsService.addComment(req.user, req.params.id, req.body);
            res.status(201).json({ status: 'success', data: comment });
        }
        catch (e) {
            next(e);
        }
    }
    async deleteComment(req, res, next) {
        try {
            await posts_service_1.postsService.deleteComment(req.user, req.params.id, req.params.commentId);
            res.status(200).json({ status: 'success', message: 'Comment deleted' });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.PostsController = PostsController;
exports.postsController = new PostsController();
