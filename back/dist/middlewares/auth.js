"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    try {
        const headers = req.headers.authorization;
        if (!headers) {
            res.status(401).json({ error: 'Missing Authorization header' });
            return;
        }
        const token = headers.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ?? 'RANDOM_TOKEN_SECRET');
        req.auth = {
            userId: decodedToken.userId,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error });
    }
}
exports.default = auth;
