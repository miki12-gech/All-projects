"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classesRepository = exports.ClassesRepository = void 0;
const db_1 = require("../../config/db");
class ClassesRepository {
    async getAllActiveClasses() {
        const classes = await db_1.db.serviceClass.findMany({
            where: { is_public_registration: true },
            select: {
                id: true,
                class_name_amharic: true
            },
            orderBy: { class_name_amharic: 'asc' }
        });
        return classes.map(c => ({
            id: c.id,
            class_name_amharic: c.class_name_amharic
        }));
    }
}
exports.ClassesRepository = ClassesRepository;
exports.classesRepository = new ClassesRepository();
