"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./Routes/auth.routes");
const book_routes_1 = require("./Routes/book.routes");
const category_routes_1 = require("./Routes/category.routes");
const order_routes_1 = require("./Routes/order.routes");
const cart_routes_1 = require("./Routes/cart.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4001;
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.status(200).json({ ok: true, message: "BookStore backend running" });
});
app.use('/api/auth', auth_routes_1.Authroutes);
app.use('/api/Book', book_routes_1.Bookroutes);
app.use('/api/Category', category_routes_1.Categoryroutes);
app.use('/api/Order', order_routes_1.Orderroutes);
app.use('/api/Cart', cart_routes_1.Cartroutes);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map