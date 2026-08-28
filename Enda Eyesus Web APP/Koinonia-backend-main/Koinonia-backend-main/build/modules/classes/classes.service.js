"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classesService = exports.ClassesService = void 0;
const classes_repository_1 = require("./classes.repository");
class ClassesService {
    repo;
    constructor() {
        this.repo = classes_repository_1.classesRepository;
    }
    async getAllActiveClasses() {
        return this.repo.getAllActiveClasses();
    }
}
exports.ClassesService = ClassesService;
exports.classesService = new ClassesService();
