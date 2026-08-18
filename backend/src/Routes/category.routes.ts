import  express  from "express";
import {getCategory, deleteCategory, createNewCategory} from '../Controllers/category.controller';
import { protect, adminOnly } from "../Middlewares/auth.middleware";
export const Categoryroutes = express.Router();



Categoryroutes.get('/getCategory', getCategory);
// Admin routes need protect first to populate req.user before checking the role.
Categoryroutes.delete('/:id', protect, adminOnly, deleteCategory);
Categoryroutes.post('/createCategory', protect, adminOnly, createNewCategory);
