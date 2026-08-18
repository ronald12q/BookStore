"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cartroutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../Middlewares/auth.middleware");
exports.Cartroutes = express_1.default.Router();
const cart_controller_1 = require("../Controllers/cart.controller");
exports.Cartroutes.get('/getCart', auth_middleware_1.protect, cart_controller_1.getCartItem);
exports.Cartroutes.post('/addItem', auth_middleware_1.protect, cart_controller_1.addItem);
exports.Cartroutes.delete('/:id', auth_middleware_1.protect, cart_controller_1.removeItem);
//# sourceMappingURL=cart.routes.js.map