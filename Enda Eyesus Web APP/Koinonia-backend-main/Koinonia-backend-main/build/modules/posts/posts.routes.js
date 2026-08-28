"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_controller_1 = require("./posts.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const posts_schema_1 = require("./posts.schema");
const router = (0, express_1.Router)();
const auth = [auth_1.requireAuth, auth_1.requireActiveStatus];
const canPost = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SUPER_ADMIN', 'CLASS_LEADER'])];
const superAdmin = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SUPER_ADMIN'])];
// Posts
router.get('/', ...auth, posts_controller_1.postsController.getPosts);
router.post('/', ...canPost, (0, validate_1.validate)(posts_schema_1.createPostSchema), posts_controller_1.postsController.createPost);
router.delete('/:id', ...auth, (0, validate_1.validate)(posts_schema_1.postIdParamSchema), posts_controller_1.postsController.deletePost);
router.patch('/:id/pin', ...superAdmin, (0, validate_1.validate)(posts_schema_1.postIdParamSchema), posts_controller_1.postsController.pinPost);
// Reactions
router.post('/:id/react', ...auth, (0, validate_1.validate)(posts_schema_1.reactToPostSchema), posts_controller_1.postsController.reactToPost);
// Comments
router.get('/:id/comments', ...auth, (0, validate_1.validate)(posts_schema_1.postIdParamSchema), posts_controller_1.postsController.getComments);
router.post('/:id/comments', ...auth, (0, validate_1.validate)(posts_schema_1.createCommentSchema), posts_controller_1.postsController.addComment);
router.delete('/:id/comments/:commentId', ...auth, (0, validate_1.validate)(posts_schema_1.commentIdParamSchema), posts_controller_1.postsController.deleteComment);
exports.default = router;
