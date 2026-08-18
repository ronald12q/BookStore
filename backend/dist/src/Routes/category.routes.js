"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoryroutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../Controllers/category.controller");
const auth_middleware_1 = require("../Middlewares/auth.middleware");
exports.Categoryroutes = express_1.default.Router();
exports.Categoryroutes.get('/getCategory', category_controller_1.getCategory);
// Admin routes need protect first to populate req.user before checking the role.
exports.Categoryroutes.delete('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, category_controller_1.deleteCategory);
exports.Categoryroutes.post('/createCategory', auth_middleware_1.protect, auth_middleware_1.adminOnly, category_controller_1.createNewCategory);
//# sourceMappingURL=category.routes.js.map