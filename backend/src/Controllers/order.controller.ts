import { Request, Response } from 'express';
import {prisma} from '../lib/prisma' 
 


export const createOrder = async (req: Request, res: Response) => {
  try {
   
    const { items, address } = req.body; 
    const userId = req.user.id; 

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    
    const bookIds = items.map((item: any) => item.bookId);
    const booksInDb = await prisma.book.findMany({
      where: { id: { in: bookIds } }
    });

    
    let calculatedTotal = 0;
    const orderItemsData = items.map((item: any) => {
      const book = booksInDb.find(b => b.id === item.bookId);
      
      if (!book) throw new Error(`El libro con ID ${item.bookId} no existe`);
      if (book.stock < item.quantity) throw new Error(`No hay suficiente stock para ${book.title}`);

      const itemTotal = book.price * item.quantity;
      calculatedTotal += itemTotal;

      return {
        bookId: book.id,
        quantity: item.quantity,
        price: book.price 
      };
    });

    
    const order = await prisma.order.create({
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
  } catch (error) {
    console.error(error);
        res.status(500).json({message: 'something went wrong during the action', error: (error as Error).message});
  }
};


export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { book: { select: { title: true, imageUrl: true } } } // Traemos datos del libro para la UI
        }
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
        res.status(500).json({message: 'something went wrong during the action', error: (error as Error).message});
  }
};


export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } } 
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
        res.status(500).json({message: 'something went wrong during the action', error: (error as Error).message});
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { idParam } = req.params;
    const { status } = req.body;

    
  const id =
  typeof idParam === 'string'
    ? idParam
    : Array.isArray(idParam)
      ? idParam[0]
      : undefined;


    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'state not match' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'state has been updated', order });
  } catch (error) {
    console.error(error);
        res.status(500).json({message: 'something went wrong during the action', error: (error as Error).message});
  }
};