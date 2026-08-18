"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.addItem = exports.getCartItem = void 0;
const prisma_1 = require("../lib/prisma");
const getCartItem = async (req, res) => {
    try {
        const cart = await prisma_1.prisma.cart.findFirst({ where: { userId: req.user.id }, include: { items: { include: { book: true } } } });
        if (!cart) {
            return res.status(404).json({ message: 'not cart founded yet' });
        }
        return res.status(200).json({ cart });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'something with the request that faill', error: error.message });
    }
};
exports.getCartItem = getCartItem;
const addItem = async (req, res) => {
    const { Bookid } = req.body;
    const UserId = req.user.id;
    const cart = await prisma_1.prisma.cart.findUnique({ where: { userId: UserId } });
    if (!cart) {
        return res.status(400).json({ message: "the cart not exist" });
    }
    const itemExist = await prisma_1.prisma.cartItem.findFirst({ where: { cartId: cart?.id, bookId: Bookid } });
    if (itemExist) {
        const itemUpdated = await prisma_1.prisma.cartItem.update({
            where: { id: itemExist.id },
            data: { quantity: itemExist.quantity + 1 }
        });
        return res.status(200).json({ itemUpdated });
    }
    else {
        const newItem = await prisma_1.prisma.cartItem.create({
            data: {
                cartId: cart?.id,
                bookId: Bookid,
                quantity: 1
            }
        });
        return res.status(200).json({ newItem });
    }
};
exports.addItem = addItem;
const removeItem = async (req, res) => {
    const { Bookid } = req.body;
    const UserId = req.user.id;
    const cart = await prisma_1.prisma.cart.findFirst({ where: { userId: UserId } });
    if (!cart) {
        return res.status(400).json({ message: 'cart not exist' });
    }
    const removeItem = await prisma_1.prisma.cartItem.deleteMany({ where: { cartId: cart?.id, bookId: Bookid } });
    return res.status(200).json({ removeItem });
};
exports.removeItem = removeItem;
//# sourceMappingURL=cart.controller.js.map