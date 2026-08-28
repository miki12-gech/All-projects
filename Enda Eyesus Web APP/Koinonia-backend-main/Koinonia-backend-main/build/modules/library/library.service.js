"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryService = exports.LibraryService = void 0;
const library_repository_1 = require("./library.repository");
const errors_1 = require("../../utils/errors");
// Updated: Accepts drive.google.com/file/... AND docs.google.com (documents, presentations, spreadsheets, forms)
const GOOGLE_DRIVE_URL_PATTERN = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/|docs\.google\.com\/(document|presentation|spreadsheets|forms)\/d\/)([a-zA-Z0-9_-]+)\/(?:edit|view|preview|viewform)(?:\?.*)?$/;
class LibraryService {
    async listAll() {
        const items = await library_repository_1.libraryRepository.listAll();
        return items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            drive_url: item.drive_url,
            category: item.category,
            academic_department: item.academic_department,
            academic_year: item.academic_year,
            course_id: item.course_id,
            document_type: item.document_type,
            likes_count: item.likes,
            downloads_count: item.downloads,
            is_link_broken: item.is_link_broken,
            last_checked_at: item.last_checked_at,
            created_at: item.created_at
        }));
    }
    // FR-LIB-05: Recursive filtering by Department → Academic Year → Course ID → Document Type
    async filterRecursive(filters) {
        const items = await library_repository_1.libraryRepository.filterRecursive(filters);
        return items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            drive_url: item.drive_url,
            category: item.category,
            academic_department: item.academic_department,
            academic_year: item.academic_year,
            course_id: item.course_id,
            document_type: item.document_type,
            likes_count: item.likes,
            downloads_count: item.downloads,
            is_link_broken: item.is_link_broken,
            last_checked_at: item.last_checked_at,
            created_at: item.created_at
        }));
    }
    async searchByTitle(query) {
        const items = await library_repository_1.libraryRepository.searchByTitle(query);
        return items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            drive_url: item.drive_url,
            category: item.category,
            academic_department: item.academic_department,
            academic_year: item.academic_year,
            course_id: item.course_id,
            document_type: item.document_type,
            likes_count: item.likes,
            downloads_count: item.downloads,
            is_link_broken: item.is_link_broken,
            created_at: item.created_at
        }));
    }
    // FR-LIB-02: Validate Google Drive URLs (now accepts docs.google.com)
    validateGoogleDriveUrl(url) {
        return GOOGLE_DRIVE_URL_PATTERN.test(url);
    }
    // Extract drive file id from known Drive URL formats
    extractDriveFileId(url) {
        const m = url.match(GOOGLE_DRIVE_URL_PATTERN);
        if (!m)
            return null;
        // m[3] is the capture group for the file/document ID
        return m[3] || null;
    }
    // FR-LIB-01: Reject direct binary file uploads
    validateNoDirectFileUpload(data) {
        if (data.file || data.binary || data.upload) {
            throw new errors_1.BadRequestError('Direct file uploads are not allowed. Please provide a public Google Drive URL instead.');
        }
    }
    // FR-LIB-06: Track user interactions
    async likeItem(id) {
        const item = await library_repository_1.libraryRepository.findById(id);
        if (!item)
            throw new errors_1.NotFoundError('Library item not found');
        return library_repository_1.libraryRepository.incrementLikes(id);
    }
    // FR-LIB-06: Track downloads
    async downloadItem(id) {
        const item = await library_repository_1.libraryRepository.findById(id);
        if (!item)
            throw new errors_1.NotFoundError('Library item not found');
        return library_repository_1.libraryRepository.incrementDownloads(id);
    }
    async createItem(userRole, data) {
        // FR-LIB-07: Secretariat roles and Service Managers can create library items
        const allowedRoles = [
            'SECRETARIAT_CHAIRMAN',
            'SECRETARIAT_VICE',
            'SECRETARIAT_SECRETARY',
            'SERVICE_MANAGER',
            'SUPER_ADMIN'
        ];
        if (!allowedRoles.includes(userRole)) {
            throw new errors_1.ForbiddenError('Insufficient permissions to create library items');
        }
        // FR-LIB-01: Validate no direct file uploads
        this.validateNoDirectFileUpload(data);
        // FR-LIB-02: Validate Google Drive URL
        if (!this.validateGoogleDriveUrl(data.drive_url)) {
            throw new errors_1.BadRequestError('Only public Google Drive or Google Docs URLs are accepted. Examples: https://drive.google.com/file/d/.../view  or  https://docs.google.com/presentation/d/.../edit');
        }
        // Validate category
        const allowedCategories = ['SPIRITUAL', 'ACADEMIC', 'OTHER'];
        if (!data.category || !allowedCategories.includes(data.category)) {
            throw new errors_1.BadRequestError('Invalid or missing category. Must be one of SPIRITUAL, ACADEMIC, OTHER');
        }
        const itemData = {
            title: data.title,
            description: data.description || null,
            drive_url: data.drive_url,
            category: data.category,
            drive_file_id: this.extractDriveFileId(data.drive_url),
            preview_url: this.extractDriveFileId(data.drive_url)
                ? `https://drive.google.com/file/d/${this.extractDriveFileId(data.drive_url)}/preview`
                : data.drive_url,
            academic_department: data.academic_department || null,
            academic_year: data.academic_year || null,
            course_id: data.course_id || null,
            document_type: data.document_type || null
        };
        return library_repository_1.libraryRepository.createItem(itemData);
    }
    async updateItem(userRole, id, data) {
        const item = await library_repository_1.libraryRepository.findById(id);
        if (!item)
            throw new errors_1.NotFoundError('Library item not found');
        const allowedRoles = [
            'SECRETARIAT_CHAIRMAN',
            'SECRETARIAT_VICE',
            'SECRETARIAT_SECRETARY',
            'SERVICE_MANAGER',
            'SUPER_ADMIN'
        ];
        if (!allowedRoles.includes(userRole)) {
            throw new errors_1.ForbiddenError('Insufficient permissions to edit library items');
        }
        // FR-LIB-01: Validate no direct file uploads
        this.validateNoDirectFileUpload(data);
        // FR-LIB-02: Validate Google Drive URL if provided
        if (data.drive_url && !this.validateGoogleDriveUrl(data.drive_url)) {
            throw new errors_1.BadRequestError('Only public Google Drive or Google Docs URLs are accepted. Examples: https://drive.google.com/file/d/.../view  or  https://docs.google.com/presentation/d/.../edit');
        }
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.drive_url)
            updateData.drive_url = data.drive_url;
        if (data.category)
            updateData.category = data.category;
        if (data.drive_url) {
            const fid = this.extractDriveFileId(data.drive_url);
            updateData.drive_file_id = fid;
            updateData.preview_url = fid ? `https://drive.google.com/file/d/${fid}/preview` : data.drive_url;
        }
        if (data.academic_department !== undefined)
            updateData.academic_department = data.academic_department;
        if (data.academic_year !== undefined)
            updateData.academic_year = data.academic_year;
        if (data.course_id !== undefined)
            updateData.course_id = data.course_id;
        if (data.document_type !== undefined)
            updateData.document_type = data.document_type;
        return library_repository_1.libraryRepository.updateItem(id, updateData);
    }
    async deleteItem(userRole, id) {
        const item = await library_repository_1.libraryRepository.findById(id);
        if (!item)
            throw new errors_1.NotFoundError('Library item not found');
        const allowedRolesDelete = [
            'SECRETARIAT_CHAIRMAN',
            'SECRETARIAT_VICE',
            'SECRETARIAT_SECRETARY',
            'SERVICE_MANAGER',
            'SUPER_ADMIN'
        ];
        if (!allowedRolesDelete.includes(userRole)) {
            throw new errors_1.ForbiddenError('Insufficient permissions to delete library items');
        }
        return library_repository_1.libraryRepository.deleteItem(id);
    }
    // FR-LIB-03: Helper method to check if link is broken
    async checkLinkHealth(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
    // FR-LIB-03: Mark link as broken (called by background job)
    async markLinkBroken(id) {
        return library_repository_1.libraryRepository.markLinkBroken(id);
    }
    // FR-LIB-03: Mark link as working (called by background job)
    async markLinkWorking(id) {
        return library_repository_1.libraryRepository.markLinkWorking(id);
    }
    // FR-LIB-03: Get all items for link validation
    async getAllItemsForLinkCheck() {
        return library_repository_1.libraryRepository.getAllItemsForLinkCheck();
    }
}
exports.LibraryService = LibraryService;
exports.libraryService = new LibraryService();
