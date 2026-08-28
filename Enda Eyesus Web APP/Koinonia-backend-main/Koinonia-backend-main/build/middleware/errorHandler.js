"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error Handler caught:', err);
    if (err instanceof zod_1.ZodError || err.name === 'ZodError') {
        const issues = err.issues ?? err.errors ?? [];
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: issues.map((e) => ({ path: Array.isArray(e.path) ? e.path.join('.') : String(e.path), message: e.message }))
        });
    }
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                status: 'fail',
                message: 'A record with that unique field already exists.',
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                status: 'fail',
                message: 'Record not found.',
            });
        }
    }
    if (err.name === 'MulterError') {
        return res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
