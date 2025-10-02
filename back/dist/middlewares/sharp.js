"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const sharpOptimization = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    //Optimisation du fichier d'origine en .webp avec resize
    const webpBuffer = await (0, sharp_1.default)(req.file.path)
        .webp({ quality: 80 })
        .resize({ height: 300, fit: 'inside', withoutEnlargement: true })
        .toBuffer();
    // Suppression du fichier d'origine
    fs_1.default.unlinkSync(req.file.path);
    // On remplace l'extension d'origine dans le nom et dans le chemin du fichier par "_optimized.webp"
    const webpPath = req.file.path
        .split('.')
        .slice(0, -1)
        .concat('optimized.webp')
        .join('_');
    const webpFileName = req.file.filename
        .split('.')
        .slice(0, -1)
        .concat('optimized.webp')
        .join('_');
    // Enregistrement du nouveau fichier .webp
    fs_1.default.writeFileSync(webpPath, webpBuffer);
    console.log(webpFileName, webpPath);
    // Mise à jour du nom et du chemin d'accès du fichier dans la requête pour pointer vers le nouveau fichier .webp
    req.file.path = webpPath;
    req.file.filename = webpFileName;
    next();
};
exports.default = sharpOptimization;
