"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createNewCategory = exports.getCategory = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = __importDefault(require("zod"));
const getCategory = async (req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({ orderBy: { name: 'asc' } });
        if (categories.length === 0) {
            return res.status(400).json({ message: 'categories not found' });
        }
        return res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'aparently system is not working well', error: error.message });
    }
};
exports.getCategory = getCategory;
const createNewCategory = async (req, res) => {
    const categorySchema = zod_1.default.object({
        name: zod_1.default.string().min(1, 'name is required'),
        slug: zod_1.default.string().min(1, 'slug is required')
    });
    try {
        const result = categorySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: 'both fields must be fill' });
        }
        const { name, slug } = result.data;
        const existingCategory = await prisma_1.prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
        if (existingCategory) {
            return res.status(400).json({ message: 'the category name or slug already exist remember categories has to be unique' });
        }
        const newCategory = await prisma_1.prisma.category.create({ data: { name, slug } });
        return res.status(200).json({ message: 'a new category has been created succesfully', data: newCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'aparently system is not working well', error: error.message });
    }
};
exports.createNewCategory = createNewCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const booksInCategory = await prisma_1.prisma.book.findFirst({ where: { categoryId: id } });
        if (booksInCategory) {
            return res.status(400).json({ message: 'the category is not empty of book' });
        }
        const deleteCategory = await prisma_1.prisma.category.delete({ where: { id } });
        return res.status(200).json({ message: "the category has been deleted succesfully", data: deleteCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'aparently system is not working well', error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map