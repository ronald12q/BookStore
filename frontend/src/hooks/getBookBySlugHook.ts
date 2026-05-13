import { useState } from "react";

export const getBookBySlugHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getBookBySlug = async (slug: string) => {
        try {
            setLoading(true);

            const request = await fetch(`http://localhost:4000/api/Book?slug=${slug}`);
            if(!request.ok) throw new Error('something went wrong during the request');
            const data = await request.json();
            return data;

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

    return {loading, error, getBookBySlug};
}