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
  isbn?: string; 
  published: boolean;
  categoryId: string;
  

  category?: Category; 
  

  createdAt: string; 
}


export interface CartItem {
  id: string;
  cartId: string;
  bookId: string;
  quantity: number;
  book: Book; 
  createdAt?: string;
}


export interface Cart {
  id: string;
  userId: string;
  items: CartItem[]; 
  createdAt?: string;
  updatedAt?: string;
}


