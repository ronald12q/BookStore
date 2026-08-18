"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = require("../lib/prisma");
const createOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'The cart is empty' });
        }
        const bookIds = items.map((item) => item.bookId);
        const booksInDb = await prisma_1.prisma.book.findMany({
            where: { id: { in: bookIds } }
        });
        let calculatedTotal = 0;
        const orderItemsData = items.map((item) => {
            const book = booksInDb.find(b => b.id === item.bookId);
            if (!book)
                throw new Error(`The book with ID ${item.bookId} does not exist`);
            if (book.stock < item.quantity)
                throw new Error(`There is not enough stock for ${book.title}`);
            const itemTotal = book.price * item.quantity;
            calculatedTotal += itemTotal;
            return {
                bookId: book.id,
                quantity: item.quantity,
                price: book.price
            };
        });
        const order = await prisma_1.prisma.order.create({
            data: {
                userId,
                address,
                total: calculatedTotal,
                status: 'PENDING',
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });
        res.status(201).json({ message: 'Order created', order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong during the action', error: error.message });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { book: { select: { title: true, imageUrl: true } } } // Include book data for the UI
                }
            }
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong during the action', error: error.message });
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }
            }
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong during the action', error: error.message });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        // The route is '/:id'; idParam never existed in req.params.
        const { id: rawId } = req.params;
        // Express can type params as string[]; Prisma needs a clean string id.
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'state not match' });
        }
        const order = await prisma_1.prisma.order.update({
            where: { id },
            data: { status }
        });
        res.status(200).json({ message: 'state has been updated', order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong during the action', error: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map