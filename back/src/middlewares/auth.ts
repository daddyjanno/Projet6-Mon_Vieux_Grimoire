import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
    interface Request {
        auth?: {
            userId: string
        }
    }
}

interface DecodedToken extends JwtPayload {
    userId: string
}

function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const headers = req.headers.authorization

        if (!headers) {
            res.status(401).json({ error: 'Missing Authorization header' })
            return
        }

        const token = headers.split(' ')[1]
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET'
        ) as DecodedToken

        req.auth = {
            userId: decodedToken.userId,
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}

export default auth
