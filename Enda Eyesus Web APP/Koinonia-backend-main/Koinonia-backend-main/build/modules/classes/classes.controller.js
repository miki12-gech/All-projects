"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classesController = exports.ClassesController = void 0;
const classes_service_1 = require("./classes.service");
class ClassesController {
    async getAllClasses(req, res, next) {
        try {
            const classes = await classes_service_1.classesService.getAllActiveClasses();
            res.status(200).json(classes);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClassesController = ClassesController;
exports.classesController = new ClassesController();
