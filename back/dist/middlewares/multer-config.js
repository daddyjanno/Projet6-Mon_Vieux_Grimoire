"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../config/paths");
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, paths_1.IMAGES_DIR);
    },
    filename: (req, file, callback) => {
        const safe = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype] || path_1.default.extname(safe).replace('.', '');
        callback(null, `${safe}_${Date.now()}.${extension}`);
    },
});
const upload = (0, multer_1.default)({ storage }).single('image');
exports.default = upload;
