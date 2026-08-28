"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middleware/auth");
const errors_1 = require("../../utils/errors");
const cloudinary_1 = require("cloudinary");
// streamifier doesn't have types; use require to bypass or add declaration
const streamifier = require('streamifier');
// ─── Cloudinary Configuration ──────────────────────────────────────
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// ─── Multer Memory Storage ─────────────────────────────────────────
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideos = ['video/mp4', 'video/webm', 'video/ogg'];
    const allowedPDFs = ['application/pdf'];
    if (allowedImages.includes(file.mimetype) || allowedVideos.includes(file.mimetype) || allowedPDFs.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.BadRequestError('Only jpg, png, webp images, mp4/webm videos, and pdf files are allowed'), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
const router = (0, express_1.Router)();
// ─── Helper: Upload to Cloudinary ─────────────────────────────────
async function uploadToCloudinary(buffer, folder, resourceType) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: resourceType,
        }, (err, result) => {
            if (err)
                return reject(err);
            if (!result)
                return reject(new Error('No result from Cloudinary'));
            resolve(result.secure_url);
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}
// ─── Routes ─────────────────────────────────────────────────────────
router.post('/image', auth_1.requireAuth, auth_1.requireActiveStatus, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file)
            throw new errors_1.BadRequestError('No image file provided');
        const url = await uploadToCloudinary(req.file.buffer, 'announcements/images', 'image');
        res.status(200).json({ status: 'success', data: { imageURL: url } });
    }
    catch (e) {
        next(e);
    }
});
router.post('/video', auth_1.requireAuth, auth_1.requireActiveStatus, upload.single('video'), async (req, res, next) => {
    try {
        if (!req.file)
            throw new errors_1.BadRequestError('No video file provided');
        const url = await uploadToCloudinary(req.file.buffer, 'announcements/videos', 'video');
        res.status(200).json({ status: 'success', data: { videoURL: url } });
    }
    catch (e) {
        next(e);
    }
});
router.post('/pdf', auth_1.requireAuth, auth_1.requireActiveStatus, upload.single('pdf'), async (req, res, next) => {
    try {
        if (!req.file)
            throw new errors_1.BadRequestError('No PDF file provided');
        const url = await uploadToCloudinary(req.file.buffer, 'announcements/pdfs', 'raw');
        res.status(200).json({ status: 'success', data: { pdfURL: url } });
    }
    catch (e) {
        next(e);
    }
});
// Public upload (registration profile pictures – no auth)
router.post('/public-image', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file)
            throw new errors_1.BadRequestError('No image file provided');
        const url = await uploadToCloudinary(req.file.buffer, 'profiles', 'image');
        res.status(200).json({ status: 'success', data: { imageURL: url } });
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
