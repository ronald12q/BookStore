import { useState } from "react";
import { authStore } from "../store/authStore";

export const updateBookHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const updateBook = async (id: string, data: Record<string, any>) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`http://localhost:4000/api/Book/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify(data)
            });

            if (!request.ok) throw new Error('The request to the API failed');

            const result = await request.json();
            return result;

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

    return { updateBook, loading, error };
}