import {prisma} from '../lib/prisma'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { includes } from 'zod'






export const getCartItem =  async (req: Request, res: Response) => {
    try {



        const cart = await prisma.cart.findFirst({where: {userId: req.user.id}, include: {items: {include: {book: true} }}})


        if(!cart){
            return res.status(404).json({message: 'not cart founded yet' })
        }

        return res.status(200).json({cart});




        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'something with the request that faill', error: (error as Error).message})
        
    }
}



export const addItem = async (req: Request, res: Response) => {
    const {Bookid} = req.body;
    const {UserId} = req.user.id;

    const cart  = await prisma.cart.findUnique({where:{userId: UserId}})
     
    if(!cart){
        return res.status(400).json({message: "the cart not exist"})
    }


   
    const itemExist = await prisma.cartItem.findFirst({where: {cartId: cart?.id, bookId: Bookid}})


   

    if(itemExist){
        const itemUpdated = await prisma.cartItem.update({
            where: {id: itemExist.id},
            data: {quantity: itemExist.quantity + 1}
        })
        return res.status(200).json({itemUpdated})
    }else {
const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart?.id,
          bookId: Bookid,
          quantity: 1
        }
      });

      return res.status(200).json({newItem})

        
    }
   
}


export const removeItem = async(req: Request, res: Response) => {
    const {Bookid} = req.body
    const {UserId} = req.user.id

    const cart = await prisma.cart.findFirst({where: {userId: UserId}})

    if(!cart){
        return res.status(400).json({message:'cart not exist'})
    }

    const removeItem = await prisma.cartItem.deleteMany({where: {cartId: cart?.id, bookId: Bookid}})

    return res.status(200).json({removeItem})

    
}