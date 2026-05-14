import express from "express";
import { protect } from "../Middlewares/auth.middleware";
export const Cartroutes = express.Router()
import { getCartItem, addItem, removeItem } from "../Controllers/cart.controller";

Cartroutes.get('/getCart', protect, getCartItem)
Cartroutes.post('/addItem', protect, addItem)
Cartroutes.delete('/:id', protect, removeItem)