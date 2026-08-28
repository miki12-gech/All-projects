"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const announcements_routes_1 = __importDefault(require("./modules/announcements/announcements.routes"));
const classes_routes_1 = __importDefault(require("./modules/classes/classes.routes"));
const posts_routes_1 = __importDefault(require("./modules/posts/posts.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const messages_routes_1 = __importDefault(require("./modules/messages/messages.routes"));
const library_routes_1 = __importDefault(require("./modules/library/library.routes"));
const membership_routes_1 = __importDefault(require("./modules/membership/membership.routes"));
const lms_routes_1 = __importDefault(require("./modules/lms/lms.routes"));
const memberAffairs_routes_1 = __importDefault(require("./routes/memberAffairs.routes"));
const education_routes_1 = __importDefault(require("./routes/education.routes"));
const approvals_routes_1 = __importDefault(require("./routes/approvals.routes"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// ─── Security ───────────────────────────────────────────────────────
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// CORS
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://endaeyesusbete.vercel.app'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        const isExactMatch = allowedOrigins.includes(origin);
        const isVercelPreview = origin.endsWith('.vercel.app');
        const isLocalhost = origin.startsWith('http://localhost:');
        if (isExactMatch || isVercelPreview || isLocalhost) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
// ─── Body Parsing ───────────────────────────────────────────────────
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ─── Static Files (uploaded images) ────────────────────────────────
// This can be removed after confirming Cloudinary works; keeping it for backward compatibility.
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// ─── Routes ─────────────────────────────────────────────────────────
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.use('/api/v1/announcements', announcements_routes_1.default);
app.use('/api/v1/classes', classes_routes_1.default);
app.use('/api/v1/posts', posts_routes_1.default);
app.use('/api/v1/upload', upload_routes_1.default);
app.use('/api/v1/notifications', notifications_routes_1.default);
app.use('/api/v1/messages', messages_routes_1.default);
app.use('/api/v1/library', library_routes_1.default);
app.use('/api/v1/membership', membership_routes_1.default);
app.use('/api/v1/lms', lms_routes_1.default);
app.use('/api/v1/member-affairs', memberAffairs_routes_1.default);
app.use('/api/v1/education', education_routes_1.default);
app.use('/api/v1/approvals', approvals_routes_1.default);
// ─── Health Check ───────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ─── Error Handler ──────────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
exports.default = app;
