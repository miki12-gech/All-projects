"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryLinkValidationJob = exports.LibraryLinkValidationJob = void 0;
const library_service_1 = require("./library.service");
const db_1 = require("../../config/db");
/**
 * FR-LIB-03: Background Job for Weekly Link Validation
 *
 * This job performs HEAD requests on all Google Drive URLs in the library
 * to detect broken links. Broken links are marked and admins are notified.
 */
class LibraryLinkValidationJob {
    static BATCH_SIZE = 10; // Process URLs in batches to avoid overwhelming requests
    /**
     * Run the weekly link validation job
     */
    async runWeeklyLinkValidation() {
        console.log('[Library Job] Starting weekly link validation...');
        try {
            const items = await library_service_1.libraryService.getAllItemsForLinkCheck();
            console.log(`[Library Job] Checking ${items.length} library items...`);
            // Process in batches
            for (let i = 0; i < items.length; i += LibraryLinkValidationJob.BATCH_SIZE) {
                const batch = items.slice(i, i + LibraryLinkValidationJob.BATCH_SIZE);
                await Promise.all(batch.map(item => this.checkAndUpdateLink(item.id, item.drive_url)));
            }
            console.log('[Library Job] Link validation completed successfully');
        }
        catch (error) {
            console.error('[Library Job] Error during link validation:', error);
            // Notify admin of job failure
            await this.notifyAdminOfJobFailure(error);
        }
    }
    /**
     * Check a single link and update status
     */
    async checkAndUpdateLink(itemId, url) {
        try {
            const isHealthy = await library_service_1.libraryService.checkLinkHealth(url);
            if (isHealthy) {
                await library_service_1.libraryService.markLinkWorking(itemId);
                console.log(`[Library Job] ✓ Link working: ${itemId}`);
            }
            else {
                await library_service_1.libraryService.markLinkBroken(itemId);
                console.log(`[Library Job] ✗ Link broken: ${itemId}`);
                // Notify admin of broken link
                await this.notifyAdminOfBrokenLink(itemId, url);
            }
        }
        catch (error) {
            console.error(`[Library Job] Error checking link ${itemId}:`, error);
            await library_service_1.libraryService.markLinkBroken(itemId);
            await this.notifyAdminOfBrokenLink(itemId, url);
        }
    }
    /**
     * Send in-app notification to Library Administrator about broken link
     * FR-LIB-03: "the system must send an in-app notification to the Library Administrator"
     */
    async notifyAdminOfBrokenLink(itemId, url) {
        try {
            // Get Library Administrator (SECRETARIAT_CHAIRMAN role)
            const admins = await db_1.db.user.findMany({
                where: {
                    system_role: 'SECRETARIAT_CHAIRMAN'
                }
            });
            for (const admin of admins) {
                await db_1.db.notification.create({
                    data: {
                        user_id: admin.id,
                        title: 'Library Link Broken',
                        message: `A library item link has been detected as broken: ${url}`,
                        target_route: `/admin/library/${itemId}`,
                        type: 'LIBRARY_BROKEN_LINK',
                        related_entity_id: itemId
                    }
                });
            }
            console.log(`[Library Job] Notification sent to admins for broken link: ${itemId}`);
        }
        catch (error) {
            console.error(`[Library Job] Error notifying admin:`, error);
        }
    }
    /**
     * Notify admin of job failure
     */
    async notifyAdminOfJobFailure(error) {
        try {
            const admins = await db_1.db.user.findMany({
                where: {
                    system_role: 'SECRETARIAT_CHAIRMAN'
                }
            });
            for (const admin of admins) {
                await db_1.db.notification.create({
                    data: {
                        user_id: admin.id,
                        title: 'Library Link Validation Job Failed',
                        message: `The weekly library link validation job failed: ${error.message || 'Unknown error'}`,
                        target_route: `/admin/library`,
                        type: 'LIBRARY_JOB_FAILURE'
                    }
                });
            }
            console.log(`[Library Job] Failure notification sent to admins`);
        }
        catch (err) {
            console.error(`[Library Job] Error notifying admin of failure:`, err);
        }
    }
}
exports.LibraryLinkValidationJob = LibraryLinkValidationJob;
exports.libraryLinkValidationJob = new LibraryLinkValidationJob();
