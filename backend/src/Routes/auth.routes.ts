import express from "express";
import  {createUser, loginUser, getMe}  from "../Controllers/auth.controller.js";
import { protect } from "../Middlewares/auth.middleware.js";
export const Authroutes = express.Router();



Authroutes.post('/register', createUser );
Authroutes.post('/login', loginUser);
Authroutes.post('/me', protect, getMe);

