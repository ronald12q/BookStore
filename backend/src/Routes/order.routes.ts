import express from "express";
import {protect, adminOnly} from '../Middlewares/auth.middleware';
export const Orderroutes = express.Router();
import {createOrder, getMyOrders, getAllOrders, updateOrderStatus} from '../Controllers/order.controller';

Orderroutes.post('/', protect,createOrder );
Orderroutes.get('/', protect, getMyOrders);
Orderroutes.get('/', protect, adminOnly, getAllOrders,);
Orderroutes.patch('/:id', protect, adminOnly, updateOrderStatus);