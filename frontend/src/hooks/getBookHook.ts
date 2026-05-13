import { useState } from "react";
import { useBookStore } from "../store/bookStore";


export const getBooksHook = () => {

    const {setBooks} = useBookStore();

    
    const [loading, setLoading] = useState< boolean> (false);
    const [error, setError] = useState< string | null> (null);

    const getApiBook = async (param?: string) => {
        try {
            setLoading(true);

            const request = param
                ? await fetch(`http://localhost:4000/api/Book/getBooks?nameBook=${encodeURIComponent(param)}`)
                : await fetch('http://localhost:4000/api/Book/getBooks');
            if(!request.ok) throw new Error('something went wrong during the request');
            const data = await request.json();
            setBooks(data);
        

            
        } catch (error) {
            
            if( error instanceof Error){
                console.error(error);
                setError(error.message);
            }else{
                console.error('unknown error', error);
                setError('unknown error');
                
                
            }
             
            
        }finally{
            setLoading(false);
        }

    }


    return {loading, error, getApiBook };

    
}
