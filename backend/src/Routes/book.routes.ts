import {getBookBySlug, getPublicBooks, createBook, deleteBook, updateBook} from '../Controllers/book.controller';
import  express  from 'express';
import {protect, adminOnly } from '../Middlewares/auth.middleware';
export const Bookroutes = express.Router();
import multer from 'multer';



const upload = multer({storage: multer.memoryStorage()});



Bookroutes.get('/getBooks', getPublicBooks);
Bookroutes.get('/', getBookBySlug);
// protect must run before adminOnly because adminOnly needs req.user.
Bookroutes.post('/createBook', protect, adminOnly, upload.single('image'), createBook );
// The correct order is token -> role -> controller; protect used to run last.
Bookroutes.delete('/:id', protect, adminOnly, deleteBook);
Bookroutes.patch('/:id', protect, adminOnly, updateBook);
