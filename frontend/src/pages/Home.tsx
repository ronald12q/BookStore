
import { useEffect } from "react";
import { Carousel } from "../components/carousel"
import { getBooksHook } from "../hooks/getBookHook";
import { getCategoryHook } from "../hooks/getCategoryHooks";
import { useBookStore } from "../store/bookStore";
import type { Book } from "../utilities/bookInterface";
import { CardItem } from "../components/cardItem";



export const Home = () => {

  const {category, allBooks, setSlug, slugCategory} = useBookStore();

  useEffect(() => {
    getApiBook();
    getApiCategory();


  },[])


  

  const caruselBooks : Book[] = allBooks.slice(0, 3);
  
  const {getApiCategory} = getCategoryHook ();
  const {getApiBook} = getBooksHook();


  const bookToShow = allBooks.filter(book => slugCategory ? book.category?.slug === slugCategory : book )
                         

    return (
        <main className="min-h-screen bg-[#141210] text-veloura-surface-2">
          <Carousel items={caruselBooks} />

          <section className="mx-auto flex max-w-7xl flex-col items-center border-t border-white/10 px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-veloura-accent sm:text-4xl">Explore by categories</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-veloura-inverse/60 sm:text-base">Sumérgete en miles de títulos organizados por género y temática</p>
            <section className="mt-10 flex flex-wrap justify-center gap-3">{category.map(e => (<div className="rounded-full border border-[#3b332d] bg-black/20 px-5 py-2 text-sm font-medium text-veloura-accent transition duration-200 hover:-translate-y-0.5 hover:border-[#5a4e44] hover:bg-black/30"> {e.name} </div> ))}</section>
          </section>

          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-veloura-accent sm:text-5xl">Trending</h1>
              <p className="mt-2 text-sm text-veloura-inverse/70 sm:text-base">the best of the best</p>
            </div>
          </section>

          <div className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            {bookToShow.map(book => (<CardItem Item={book} ></CardItem>))}
          </div>
        </main>
    )

    
}
