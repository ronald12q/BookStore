"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenGenerator_1 = require("../utilities/tokenGenerator");
const zod_1 = require("zod");
const createUser = async (req, res) => {
    const userCreateSchema = zod_1.z.object({
        name: zod_1.z.string().trim().min(1, 'name is required'),
        email: zod_1.z.email('email is required'),
        password: zod_1.z.string().trim().min(8, 'password needs almost 8 letters')
    });
    try {
        const result = userCreateSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: 'something went wrong with the data sent' });
        }
        const { name, email, password } = result.data;
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (user) {
            return res.status(401).json({ message: 'user already exist' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const createUser = await prisma_1.prisma.user.create({ data: { name: name, email: normalizedEmail, password: hashedPassword, cart: { create: {} } } });
        const token = (0, tokenGenerator_1.generateToken)(createUser.id);
        return res.status(201).json({ token, user: { name: createUser.name, email: createUser.email, role: createUser.role } });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "something was wrong creating a new user", error: error.message });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const userLoginSchema = zod_1.z.object({
        email: zod_1.z.email('email is required'),
        password: zod_1.z.string().trim().min(8, 'password needs almost 8 letters')
    });
    try {
        const result = userLoginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: 'something went wrong with the data sent' });
        }
        const { email, password } = result.data;
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(500).json({ message: 'user not find' });
        }
        const decryptedPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!decryptedPassword) {
            return res.status(401).json({ message: 'error password does not match' });
        }
        const token = (0, tokenGenerator_1.generateToken)(user.id);
        return res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'something was wrong during the action', error: error.message });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map