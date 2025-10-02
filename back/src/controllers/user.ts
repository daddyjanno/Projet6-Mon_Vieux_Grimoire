import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const signup = (req: Request, res: Response, next: NextFunction) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            })
            user.save()
                .then(() =>
                    res
                        .status(201)
                        .json({ message: 'Utilisateur créé avec succès' })
                )
                .catch((error) => res.status(400).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
}

const login = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    message: 'Paire login/mot de passe incorrecte',
                })
                return
            }

            const isValid = bcrypt.compare(req.body.password, user.password)

            if (!isValid) {
                res.status(401).json({
                    message: 'Paire login/mot de passe incorrecte',
                })
                return
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )

            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                ),
            })
        })
        .catch((error) => res.status(500).json({ error }))
}

export default { signup, login }
