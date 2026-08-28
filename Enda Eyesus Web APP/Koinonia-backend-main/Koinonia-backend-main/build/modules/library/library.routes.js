"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const library_controller_1 = require("./library.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const auth = [auth_1.requireAuth, auth_1.requireActiveStatus];
const chairmanOnly = [auth_1.requireAuth, auth_1.requireActiveStatus, (0, auth_1.requireRole)(['SECRETARIAT_CHAIRMAN', 'SUPER_ADMIN', 'SERVICE_MANAGER'])];
// Public endpoints (authenticated users only)
router.get('/', ...auth, library_controller_1.libraryController.listLibrary);
router.post('/:id/like', ...auth, library_controller_1.libraryController.likeItem);
router.post('/:id/download', ...auth, library_controller_1.libraryController.downloadItem);
// CRUD operations (Chairman/Admin only)
router.post('/', ...chairmanOnly, library_controller_1.libraryController.createItem);
router.patch('/:id', ...chairmanOnly, library_controller_1.libraryController.updateItem);
router.delete('/:id', ...chairmanOnly, library_controller_1.libraryController.deleteItem);
exports.default = router;
