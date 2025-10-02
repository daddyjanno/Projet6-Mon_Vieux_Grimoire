import multer from 'multer'
import { Request } from 'express'
import path from 'path'
import { IMAGES_DIR } from '../config/paths'

const MIME_TYPES: Record<string, string> = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
    ) => {
        callback(null, IMAGES_DIR)
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) => {
        const safe = file.originalname.split(' ').join('_')

        const extension =
            MIME_TYPES[file.mimetype] || path.extname(safe).replace('.', '')
        callback(null, `${safe}_${Date.now()}.${extension}`)
    },
})

const upload = multer({ storage }).single('image')

export default upload
