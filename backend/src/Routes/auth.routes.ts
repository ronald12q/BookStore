import express from "express";
import  {createUser, loginUser}  from "../Controllers/auth.controller.js";
export const Authroutes = express.Router();



Authroutes.post('/register', createUser );
Authroutes.post('/login', loginUser);
