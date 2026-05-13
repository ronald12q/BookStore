import { useState } from "react";
import { useBookStore } from "../store/bookStore";

export const getCategoryHook = () => {

    const {setCategory} = useBookStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getApiCategory = async () => {
        try {
            setLoading(true);

            const request = await fetch('http://localhost:4000/api/Category/getCategory');
            if(!request.ok) throw new Error('something went wrong during the request');
            const data = await request.json();
            setCategory(data);

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

    return {loading, error, getApiCategory};
}