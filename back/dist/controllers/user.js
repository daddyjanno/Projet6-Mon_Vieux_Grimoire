"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const signup = (req, res, next) => {
    bcrypt_1.default
        .hash(req.body.password, 10)
        .then((hash) => {
        const user = new User_1.default({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(() => res
            .status(201)
            .json({ message: 'Utilisateur créé avec succès' }))
            .catch((error) => res.status(400).json({ error }));
    })
        .catch((error) => res.status(500).json({ error }));
};
const login = (req, res, next) => {
    User_1.default.findOne({ email: req.body.email })
        .then((user) => {
        if (!user) {
            res.status(401).json({
                message: 'Paire login/mot de passe incorrecte',
            });
            return;
        }
        const isValid = bcrypt_1.default.compare(req.body.password, user.password);
        if (!isValid) {
            res.status(401).json({
                message: 'Paire login/mot de passe incorrecte',
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
        res.status(200).json({
            userId: user._id,
            token: jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
        });
    })
        .catch((error) => res.status(500).json({ error }));
};
exports.default = { signup, login };
