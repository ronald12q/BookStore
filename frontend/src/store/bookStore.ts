import type { Book, Category } from "../utilities/bookInterface"
import {create} from 'zustand'

interface BookStore {
    allBooks: Book[] ,
    category: Category[],
    setBooks: (books : Book[]) => void,
    setCategory : (categorys:Category[]) => void,
    setSlug : (slug: string) => void
    slugCategory: string | null;
}




export const useBookStore = create<BookStore>((set) => ({
  allBooks: [],
  category: [],
  slugCategory: null,
  
  setBooks: (books : Book[]) => set({allBooks: books}),
  setCategory: (categorys: Category[]) => set({category: categorys}),
  setSlug: (slug: string) => set({slugCategory: slug})



}))

