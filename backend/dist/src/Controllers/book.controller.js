"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBook = exports.deleteBook = exports.createBook = exports.getBookBySlug = exports.getPublicBooks = void 0;
const prisma_1 = require("../lib/prisma");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const getPublicBooks = async (req, res) => {
    try {
        const { nameBook } = req.query;
        const books = await prisma_1.prisma.book.findMany({
            where: nameBook
                ? {
                    title: {
                        contains: String(nameBook),
                        mode: 'insensitive'
                    }
                }
                : undefined,
            include: {
                category: true
            }
        });
        return res.status(200).json(books);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something is going wrong with the system',
            error: error.message
        });
    }
};
exports.getPublicBooks = getPublicBooks;
const getBookBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const book = await prisma_1.prisma.book.findUnique({
            where: { slug },
            include: {
                category: true
            }
        });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error getting the book'
        });
    }
};
exports.getBookBySlug = getBookBySlug;
// endpoints to admin crud of books
const createBook = async (req, res) => {
    try {
        const { title, slug, author, description, price, stock, isbn, categoryId } = req.body;
        const existBook = await prisma_1.prisma.book.findUnique({ where: { slug: slug } });
        if (existBook) {
            return res.status(401).json({ message: 'it seems that this book is already register' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'the image is a mandatory' });
        }
        const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({ folder: 'tienda-libros' }, // Folder in Cloudinary
                (error, result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                stream.end(buffer); // Disparamos el archivo a Cloudinary
            });
        };
        const cloudResult = await uploadFromBuffer(req.file.buffer);
        const newBook = await prisma_1.prisma.book.create({ data: { title, slug, author, description, price: Number(price), stock: Number(stock) || 0, imageUrl: cloudResult.secure_url, isbn: isbn || undefined, categoryId, published: true } });
        return res.status(201).json({
            message: 'the created of the book was succesfull', book: newBook
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'aparently system is not working well', error: error.message });
    }
};
exports.createBook = createBook;
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const bookDeleted = await prisma_1.prisma.book.delete({ where: { id: bookId } });
        if (!bookDeleted) {
            return res.status(400).json({ message: 'book not found' });
        }
        return res.status(200).json({ message: 'book was succesfull remove', book: bookDeleted });
    }
    catch (error) {
    }
};
exports.deleteBook = deleteBook;
const updateBook = async (req, res) => {
    try {
        // The route is '/:id'; rawId never existed in req.params.
        const { id: rawId } = req.params;
        // Express can type params as string[]; Prisma needs a clean string id.
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const update = {
            ...req.body,
            ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
            ...(req.body.stock !== undefined ? { stock: Number(req.body.stock) } : {}),
            ...(req.body.isbn === '' ? { isbn: null } : {}),
        };
        const updatedBook = await prisma_1.prisma.book.update({ where: { id: id }, data: update });
        if (!updatedBook) {
            return res.status(401).json({ message: "book not found" });
        }
        // Return the updated book, not the controller function.
        return res.status(200).json({ message: "book was succesfull updated", book: updatedBook });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'the system is not working well', error: error.message });
    }
};
exports.updateBook = updateBook;
//# sourceMappingURL=book.controller.js.map