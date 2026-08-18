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
            if(!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to fetch categories';
                console.error('[Get Categories Error]', message, errorData);
                throw new Error(message);
            }
            const data = await request.json();
            setCategory(data);

        } catch (error) {
            if( error instanceof Error){
                setError(error.message);
                console.error('[Get Categories Error]', error.message);
            }else{
                setError('An unexpected error occurred');
                console.error('[Get Categories Error] Unknown error', error);
            }
        }finally{
            setLoading(false);
        }
    }

    return {loading, error, getApiCategory};
}
