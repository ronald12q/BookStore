import cors from "cors";
import dotenv from "dotenv";
import express from "express";



dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4001;



app.use(cors({origin: "localhost:5173"}));
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).json({ ok: true, message: "BookStore backend running" });
});


app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
