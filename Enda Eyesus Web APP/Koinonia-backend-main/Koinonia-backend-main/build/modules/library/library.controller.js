"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryController = exports.LibraryController = void 0;
const library_service_1 = require("./library.service");
class LibraryController {
    // Get all library items (with optional filters)
    async listLibrary(req, res, next) {
        try {
            const { category, department, academic_year, course_id, document_type, search } = req.query;
            // If search query provided
            if (search && typeof search === 'string') {
                const items = await library_service_1.libraryService.searchByTitle(search);
                return res.status(200).json({ status: 'success', items, count: items.length });
            }
            // If filters provided, use recursive filtering
            if (category || department || academic_year || course_id || document_type) {
                const filters = {
                    ...(category && { category: category }),
                    ...(department && { academic_department: department }),
                    ...(academic_year && { academic_year: parseInt(academic_year) }),
                    ...(course_id && { course_id: course_id }),
                    ...(document_type && { document_type: document_type })
                };
                const items = await library_service_1.libraryService.filterRecursive(filters);
                return res.status(200).json({ status: 'success', items, count: items.length });
            }
            // Return all items
            const items = await library_service_1.libraryService.listAll();
            res.status(200).json({ status: 'success', items, count: items.length });
        }
        catch (e) {
            next(e);
        }
    }
    // Like a library item
    async likeItem(req, res, next) {
        try {
            const item = await library_service_1.libraryService.likeItem(req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'Item liked successfully',
                likes_count: item.likes
            });
        }
        catch (e) {
            next(e);
        }
    }
    // Download a library item (increment download counter)
    async downloadItem(req, res, next) {
        try {
            const item = await library_service_1.libraryService.downloadItem(req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'Download tracked successfully',
                downloads_count: item.downloads
            });
        }
        catch (e) {
            next(e);
        }
    }
    // Create a new library item
    async createItem(req, res, next) {
        try {
            const userRole = req.user.role;
            const item = await library_service_1.libraryService.createItem(userRole, req.body);
            res.status(201).json({
                status: 'success',
                message: 'Library item created successfully',
                data: item
            });
        }
        catch (e) {
            next(e);
        }
    }
    // Update a library item
    async updateItem(req, res, next) {
        try {
            const userRole = req.user.role;
            const item = await library_service_1.libraryService.updateItem(userRole, req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                message: 'Library item updated successfully',
                data: item
            });
        }
        catch (e) {
            next(e);
        }
    }
    // Delete a library item
    async deleteItem(req, res, next) {
        try {
            const userRole = req.user.role;
            await library_service_1.libraryService.deleteItem(userRole, req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'Library item deleted successfully'
            });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.LibraryController = LibraryController;
exports.libraryController = new LibraryController();
