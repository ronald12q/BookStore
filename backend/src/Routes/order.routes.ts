import express from "express";
import { protect, adminOnly } from '../Middlewares/auth.middleware';
import {
  checkout,
  confirmPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../Controllers/order.controller';

export const Orderroutes = express.Router();

Orderroutes.post('/checkout', protect, checkout);
Orderroutes.post('/confirm-payment', protect, confirmPayment);
Orderroutes.get('/my-orders', protect, getMyOrders);
Orderroutes.get('/all', protect, adminOnly, getAllOrders);
Orderroutes.patch('/:id', protect, adminOnly, updateOrderStatus);
