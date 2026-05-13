export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isbn?: string; // Es opcional (?) porque en tu Prisma le pusiste "String?"
  published: boolean;
  categoryId: string;
  
  // Estas propiedades dependen de si en el backend hiciste el "include"
  category?: Category; 
  
  // Ojo aquí: Aunque en Prisma es un DateTime, cuando viaja 
  // por internet (JSON) llega al frontend como un texto (String ISO)
  createdAt: string; 
}



