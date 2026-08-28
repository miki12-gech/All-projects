"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lms_controller_1 = require("./lms.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const auth = [auth_1.requireAuth, auth_1.requireActiveStatus];
// GET /lms/batches - Get all batches with optional filters
router.get('/batches', ...auth, lms_controller_1.lmsController.getBatches);
// GET /lms/batches/:id - Get a specific batch
router.get('/batches/:id', ...auth, lms_controller_1.lmsController.getBatchById);
// GET /lms/batches/:id/enrollments - Get enrollments for a specific batch
router.get('/batches/:id/enrollments', ...auth, lms_controller_1.lmsController.getBatchEnrollments);
// GET /lms/enrollments/me - Get current user's enrollments
router.get('/enrollments/me', ...auth, lms_controller_1.lmsController.getUserEnrollments);
exports.default = router;
