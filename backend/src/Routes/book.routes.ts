import {getBookBySlug, getPublicBooks, createBook, deleteBook, updateBook} from '../Controllers/book.controller';
import  express  from 'express';
import {protect, adminOnly } from '../Middlewares/auth.middleware';
export const Bookroutes = express.Router();
import multer from 'multer';



const upload = multer({storage: multer.memoryStorage()});



Bookroutes.get('/getBooks', getPublicBooks);
Bookroutes.get('/', getBookBySlug);
Bookroutes.post('/createBook', adminOnly, createBook, upload.single('image'),protect );
Bookroutes.delete('/:id', adminOnly, deleteBook, protect);
Bookroutes.patch('/:id', adminOnly, updateBook, protect);
