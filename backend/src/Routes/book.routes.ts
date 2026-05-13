import {getBookBySlug, getPublicBooks, createBook, deleteBook, updateBook} from '../Controllers/book.controller';
import  express  from 'express';
import {protect, adminOnly } from '../Middlewares/auth.middleware';
export const Bookroutes = express.Router();
import multer from 'multer';



const upload = multer({storage: multer.memoryStorage()});



Bookroutes.get('/getBooks', getPublicBooks);
Bookroutes.get('/', getBookBySlug);
// protect debe ir antes de adminOnly porque adminOnly necesita req.user.
Bookroutes.post('/createBook', protect, adminOnly, upload.single('image'), createBook );
// El orden correcto es token -> rol -> controller; antes protect corria al final.
Bookroutes.delete('/:id', protect, adminOnly, deleteBook);
Bookroutes.patch('/:id', protect, adminOnly, updateBook);
