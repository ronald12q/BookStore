import { useState } from "react";
import { authStore } from "../store/authStore";

export const createBookHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const createBook = async (formData: FormData) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch('http://localhost:4000/api/Book/createBook', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${User?.token}`
                },
                body: formData
            });

            if (!request.ok) throw new Error('The request to the API failed');

            const data = await request.json();
            return data;

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
            } else {
                console.log('Unknown error during the request', error);
                setError('Unknown error during the request');
            }
        } finally {
            setLoading(false);
        }
    }

    return { createBook, loading, error };
}