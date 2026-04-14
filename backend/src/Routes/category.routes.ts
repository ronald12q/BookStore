import  express  from "express";
import {getCategory, deleteCategory, createNewCategory} from '../Controllers/category.controller';
import { adminOnly } from "../Middlewares/auth.middleware";
export const Categoryroutes = express.Router();



Categoryroutes.get('/getCategory', getCategory);
Categoryroutes.delete('/:id', adminOnly, deleteCategory);
Categoryroutes.post('/createCategory', adminOnly, createNewCategory);
