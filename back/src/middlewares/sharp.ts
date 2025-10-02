import sharp from 'sharp'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'

const sharpOptimization = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.file) {
        return next()
    }
    //Optimisation du fichier d'origine en .webp avec resize
    const webpBuffer = await sharp(req.file.path)
        .webp({ quality: 80 })
        .resize({ height: 300, fit: 'inside', withoutEnlargement: true })
        .toBuffer()

    // Suppression du fichier d'origine
    fs.unlinkSync(req.file.path)

    // On remplace l'extension d'origine dans le nom et dans le chemin du fichier par "_optimized.webp"
    const webpPath = req.file.path
        .split('.')
        .slice(0, -1)
        .concat('optimized.webp')
        .join('_')
    const webpFileName = req.file.filename
        .split('.')
        .slice(0, -1)
        .concat('optimized.webp')
        .join('_')

    // Enregistrement du nouveau fichier .webp
    fs.writeFileSync(webpPath, webpBuffer)

    console.log(webpFileName, webpPath)

    // Mise à jour du nom et du chemin d'accès du fichier dans la requête pour pointer vers le nouveau fichier .webp
    req.file.path = webpPath
    req.file.filename = webpFileName

    next()
}

export default sharpOptimization
