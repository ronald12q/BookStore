import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {Authroutes} from './Routes/auth.routes';
import {Bookroutes} from './Routes/book.routes';
import {Categoryroutes} from './Routes/category.routes';
import { Orderroutes } from "./Routes/order.routes";
import { Cartroutes } from "./Routes/cart.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4001;



app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).json({ ok: true, message: "BookStore backend running" });
});

app.use('/api/auth', Authroutes);
app.use('/api/Book', Bookroutes);
app.use('/api/Category', Categoryroutes);
app.use('/api/Order', Orderroutes);
app.use('/api/Cart', Cartroutes)

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
