import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import { IMAGES_DIR } from './config/paths'

dotenv.config()

import bookRoutes from './routes/book'
import userRoutes from './routes/user'

mongoose
    .connect(
        `mongodb+srv://jnd:${process.env.DB_PASSWORD}@grimoiredb.gdg6pdq.mongodb.net/?retryWrites=true&w=majority&appName=GrimoireDB`,
        {}
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use(express.json())

app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
        )
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        )
        next()
    }
)

app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
}
app.use('/images', express.static(IMAGES_DIR))

export default app
