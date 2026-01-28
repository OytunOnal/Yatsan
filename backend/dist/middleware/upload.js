"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'));
    }
};
// Multer configuration with image processing
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 15
    }
});
// Image processing function to resize and optimize images
const processImage = async (filePath) => {
    try {
        const image = (0, sharp_1.default)(filePath);
        const metadata = await image.metadata();
        // Only process if image is larger than 1920px width or 1080px height
        if (metadata.width && metadata.width > 1920) {
            await image
                .resize(1920, 1080, {
                fit: 'inside',
                withoutEnlargement: true
            })
                .jpeg({ quality: 85 })
                .toFile(filePath + '.tmp');
            // Replace original with processed file
            await promises_1.default.unlink(filePath);
            await promises_1.default.rename(filePath + '.tmp', filePath);
        }
        else {
            // Just optimize quality without resizing
            await image
                .jpeg({ quality: 85 })
                .toFile(filePath + '.tmp');
            await promises_1.default.unlink(filePath);
            await promises_1.default.rename(filePath + '.tmp', filePath);
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};
exports.processImage = processImage;
