"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const library_jobs_init_1 = require("./modules/library/library.jobs-init");
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        await db_1.db.$connect();
        console.log('📦 Connected to the database successfully');
        // Initialize background jobs
        (0, library_jobs_init_1.initializeLibraryJobs)();
        server.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server is running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// Graceful Shutdown
process.on('SIGINT', async () => {
    await db_1.db.$disconnect();
    console.log('📦 Database disconnected');
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await db_1.db.$disconnect();
    console.log('📦 Database disconnected');
    process.exit(0);
});
