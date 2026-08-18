"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orderroutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../Middlewares/auth.middleware");
exports.Orderroutes = express_1.default.Router();
const order_controller_1 = require("../Controllers/order.controller");
exports.Orderroutes.post('/', auth_middleware_1.protect, order_controller_1.createOrder);
// Previously there were two GET '/' routes, and the admin route was shadowed by getMyOrders.
exports.Orderroutes.get('/my-orders', auth_middleware_1.protect, order_controller_1.getMyOrders);
exports.Orderroutes.get('/all', auth_middleware_1.protect, auth_middleware_1.adminOnly, order_controller_1.getAllOrders);
exports.Orderroutes.patch('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, order_controller_1.updateOrderStatus);
//# sourceMappingURL=order.routes.js.map