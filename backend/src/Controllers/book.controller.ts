import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

// book controller for public request 

export const getPublicBooks = async (req: Request, res: Response) => {
  try {
    const { nameBook } = req.query;

    const books = await prisma.book.findMany({
      where: nameBook
        ? {
            title: {
              contains: String(nameBook),
              mode: 'insensitive'
            }
          }
        : undefined
    });

    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something is going wrong with the system',
      error: (error as Error).message
    });
  }
};




interface BookParams {
  slug: string;
}

export const getBookBySlug = async (
  req: Request<BookParams>,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        category: true
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting the book'
    });
  }
};



// endpoints to admin crud of books


export const createBook = async (req: Request, res: Response) => {
    try {
        const {title, slug, author, description, price, stock, isbn, categoryId} = req.body;
        
        const existBook = await prisma.book.findUnique({where: {slug: slug}});
        if(existBook){
            return res.status(401).json({message: 'it seems that this book is already register'})
        }


        if(!req.file){
          return res.status(400).json({message: 'the image is a mandatory'});
        }
       

      const uploadFromBuffer = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'tienda-libros' }, // Carpeta en tu Cloudinary
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(buffer); // Disparamos el archivo a Cloudinary
      });
    };

    const cloudResult = await uploadFromBuffer(req.file.buffer);
        
      const newBook = await prisma.book.create({data:{title, slug, author, description, price: Number(price), stock: Number(stock) || 0,imageUrl: cloudResult.secure_url, isbn: isbn || undefined,categoryId , published: true}})

        return res.status(201).json({
            message: 'the created of the book was succesfull', book: newBook
        })

        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'aparently system is not working well', error: (error as Error).message});
        
    }
}


export const deleteBook = async(req: Request, res: Response) => {
    try {

        const {bookId} = req.body;

        const bookDeleted = await prisma.book.delete({where: {id: bookId}});

        if(!bookDeleted){
            return res.status(400).json({message: 'book not found'});
        }

        return res.status(200).json({message: 'book was succesfull remove', book: bookDeleted});
        
    } catch (error) {
        
    }
    
    
}

export const updateBook = async (req: Request, res: Response) => {
 try {
  // La ruta es '/:id'; rawId nunca existia en req.params.
  const {id: rawId} = req.params;
  // Express puede tipar params como string[]; Prisma necesita un id string limpio.
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const update = {
    ...req.body,
    ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
    ...(req.body.stock !== undefined ? { stock: Number(req.body.stock) } : {}),
    ...(req.body.isbn === '' ? { isbn: null } : {}),
  };



  const updatedBook = await prisma.book.update({where: {id: id}, data:update });

  if(!updatedBook){
   return res.status(401).json({message: "book not found"});
  }

  // Hay que devolver el libro actualizado, no la funcion controller.
  return res.status(200).json({message: "book was succesfull updated", book: updatedBook});

  
 } catch (error) {
  console.error(error);
  return res.status(500).json({message: 'the system is not working well', error: (error as Error).message});
  
 }


}
