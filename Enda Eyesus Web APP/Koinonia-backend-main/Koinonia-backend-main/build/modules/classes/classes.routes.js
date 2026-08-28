"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classes_controller_1 = require("./classes.controller");
const router = (0, express_1.Router)();
// Public route for registration dropdowns
router.get('/', classes_controller_1.classesController.getAllClasses);
exports.default = router;
