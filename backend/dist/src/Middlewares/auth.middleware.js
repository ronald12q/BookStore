"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const secret = process.env.JWT_SECRET;
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // The header arrives as "Bearer TOKEN"; split('') separated it by characters and broke the JWT.
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'There is not token' });
        }
        if (!secret) {
            return res.status(500).json({ message: 'there is not any secret on .env' });
        }
        const decoded = await jsonwebtoken_1.default.verify(token, secret);
        const user = await prisma_1.prisma?.user.findUnique({ where: { id: decoded.id }, select: { name: true, role: true, email: true, id: true } });
        if (!user) {
            return res.status(401).json({ message: 'there is not any user' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong during the action', error: error.message });
    }
    ;
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    }
    else {
        return res.status(403).json({ message: 'you must to be administrator' });
    }
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=auth.middleware.js.map