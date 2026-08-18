import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { book: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    let calculatedTotal = 0;
    const orderItemsData = cart.items.map((item) => {
      if (item.book.stock < item.quantity) {
        throw new Error(`Not enough stock for "${item.book.title}"`);
      }
      const itemTotal = item.book.price * item.quantity;
      calculatedTotal += itemTotal;

      return {
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.book.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        address: 'Digital delivery',
        total: calculatedTotal,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { book: { select: { title: true, imageUrl: true, slug: true, price: true } } },
        },
      },
    });

    return res.status(201).json({ orderId: order.id, total: calculatedTotal, items: order.items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong during checkout',
      error: (error as Error).message,
    });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Order is already processed' });
    }

    for (const item of order.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });

    return res.status(200).json({ message: 'Payment confirmed', order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong confirming payment',
      error: (error as Error).message,
    });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { book: { select: { title: true, imageUrl: true, slug: true } } },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong during the action',
      error: (error as Error).message,
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { book: { select: { title: true, imageUrl: true } } },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong during the action',
      error: (error as Error).message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong during the action',
      error: (error as Error).message,
    });
  }
};
