"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryRepository = exports.LibraryRepository = void 0;
const db_1 = require("../../config/db");
class LibraryRepository {
    async listAll() {
        return db_1.db.library_items.findMany({
            where: { is_link_broken: false },
            orderBy: { created_at: "desc" },
        });
    }
    async findById(id) {
        return db_1.db.library_items.findUnique({ where: { id } });
    }
    async filterByCategory(category) {
        return db_1.db.library_items.findMany({
            where: {
                category: category,
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async filterByDepartment(department) {
        return db_1.db.library_items.findMany({
            where: {
                academic_department: department,
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async filterByAcademicYear(academicYear) {
        return db_1.db.library_items.findMany({
            where: {
                academic_year: academicYear,
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async filterByCourse(courseId) {
        return db_1.db.library_items.findMany({
            where: {
                course_id: courseId,
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async filterByDocumentType(documentType) {
        return db_1.db.library_items.findMany({
            where: {
                document_type: documentType,
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async filterRecursive(filters) {
        return db_1.db.library_items.findMany({
            where: {
                ...(filters.category && { category: filters.category }),
                ...(filters.academic_department && {
                    academic_department: filters.academic_department,
                }),
                ...(filters.academic_year && { academic_year: filters.academic_year }),
                ...(filters.course_id && { course_id: filters.course_id }),
                ...(filters.document_type && {
                    document_type: filters.document_type,
                }),
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async searchByTitle(query) {
        return db_1.db.library_items.findMany({
            where: {
                title: { contains: query, mode: "insensitive" },
                is_link_broken: false,
            },
            orderBy: { created_at: "desc" },
        });
    }
    async incrementLikes(id) {
        return db_1.db.library_items.update({
            where: { id },
            data: { likes: { increment: 1 } },
        });
    }
    async incrementDownloads(id) {
        return db_1.db.library_items.update({
            where: { id },
            data: { downloads: { increment: 1 } },
        });
    }
    async createItem(data) {
        return db_1.db.library_items.create({
            data,
        });
    }
    async updateItem(id, data) {
        return db_1.db.library_items.update({
            where: { id },
            data,
        });
    }
    async deleteItem(id) {
        await db_1.db.library_items.delete({ where: { id } });
    }
    async markLinkBroken(id) {
        return db_1.db.library_items.update({
            where: { id },
            data: {
                is_link_broken: true,
                last_checked_at: new Date(),
            },
        });
    }
    async markLinkWorking(id) {
        return db_1.db.library_items.update({
            where: { id },
            data: {
                is_link_broken: false,
                last_checked_at: new Date(),
            },
        });
    }
    async getAllItemsForLinkCheck() {
        return db_1.db.library_items.findMany({
            select: { id: true, drive_url: true },
        });
    }
}
exports.LibraryRepository = LibraryRepository;
exports.libraryRepository = new LibraryRepository();
