import  express  from "express";
import {getCategory, deleteCategory, createNewCategory} from '../Controllers/category.controller';
import { protect, adminOnly } from "../Middlewares/auth.middleware";
export const Categoryroutes = express.Router();



Categoryroutes.get('/getCategory', getCategory);
// Las rutas admin necesitan protect primero para llenar req.user antes de revisar el rol.
Categoryroutes.delete('/:id', protect, adminOnly, deleteCategory);
Categoryroutes.post('/createCategory', protect, adminOnly, createNewCategory);
