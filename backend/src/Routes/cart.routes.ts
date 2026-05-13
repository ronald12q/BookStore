import express from "express";
import { protect } from "../Middlewares/auth.middleware";
export const Cartroutes = express.Router()
import { getCartItem, addItem, removeItem } from "../Controllers/cart.controller";

Cartroutes.get('/getCart', getCartItem)
Cartroutes.post('/addItem', addItem,protect)
Cartroutes.delete('/:id', removeItem, protect)