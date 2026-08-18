"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookroutes = void 0;
const book_controller_1 = require("../Controllers/book.controller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../Middlewares/auth.middleware");
exports.Bookroutes = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.Bookroutes.get('/getBooks', book_controller_1.getPublicBooks);
exports.Bookroutes.get('/', book_controller_1.getBookBySlug);
// protect must run before adminOnly because adminOnly needs req.user.
exports.Bookroutes.post('/createBook', auth_middleware_1.protect, auth_middleware_1.adminOnly, upload.single('image'), book_controller_1.createBook);
// The correct order is token -> role -> controller; protect used to run last.
exports.Bookroutes.delete('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, book_controller_1.deleteBook);
exports.Bookroutes.patch('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, book_controller_1.updateBook);
//# sourceMappingURL=book.routes.js.map