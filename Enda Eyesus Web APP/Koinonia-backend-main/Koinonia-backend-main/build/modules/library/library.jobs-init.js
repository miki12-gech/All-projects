"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryLinkValidationJob = void 0;
exports.initializeLibraryJobs = initializeLibraryJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const library_job_1 = require("./library.job");
Object.defineProperty(exports, "libraryLinkValidationJob", { enumerable: true, get: function () { return library_job_1.libraryLinkValidationJob; } });
/**
 * Initialize library jobs
 * This sets up the weekly link validation job to run every Sunday at 2:00 AM
 */
function initializeLibraryJobs() {
    try {
        // Schedule: Run every Sunday at 2:00 AM
        // Format: "0 2 * * 0" (minute, hour, day of month, month, day of week)
        const job = node_cron_1.default.schedule('0 2 * * 0', async () => {
            console.log('[Library Jobs] Running scheduled link validation job...');
            await library_job_1.libraryLinkValidationJob.runWeeklyLinkValidation();
        });
        job.start();
        console.log('[Library Jobs] Library jobs initialized. Link validation scheduled for Sundays at 2:00 AM');
        return job;
    }
    catch (error) {
        console.error('[Library Jobs] Error initializing library jobs:', error);
        throw error;
    }
}
