import express from "express";
import {protect, adminOnly} from '../Middlewares/auth.middleware';
export const Orderroutes = express.Router();
import {createOrder, getMyOrders, getAllOrders, updateOrderStatus} from '../Controllers/order.controller';

Orderroutes.post('/', protect,createOrder );
// Antes habia dos GET '/' y la ruta admin quedaba tapada por getMyOrders.
Orderroutes.get('/my-orders', protect, getMyOrders);
Orderroutes.get('/all', protect, adminOnly, getAllOrders,);
Orderroutes.patch('/:id', protect, adminOnly, updateOrderStatus);
