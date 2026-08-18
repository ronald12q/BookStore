import { API_URL } from "../lib/api";
import { useState } from "react";

export const getBookBySlugHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getBookBySlug = async (slug: string) => {
        try {
            setLoading(true);

            const request = await fetch(`${API_URL}/api/Book?slug=${slug}`);
            if(!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to fetch book';
                console.error('[Get Book By Slug Error]', message, errorData);
                throw new Error(message);
            }
            const data = await request.json();
            return data;

        } catch (error) {
            if( error instanceof Error){
                setError(error.message);
                console.error('[Get Book By Slug Error]', error.message);
            }else{
                setError('An unexpected error occurred');
                console.error('[Get Book By Slug Error] Unknown error', error);
            }
        }finally{
            setLoading(false);
        }
    }

    return {loading, error, getBookBySlug};
}
