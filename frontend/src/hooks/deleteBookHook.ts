import { useState } from "react";
import { authStore } from "../store/authStore";

export const deleteBookHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const deleteBook = async (bookId: string) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`http://localhost:4000/api/Book/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify({ bookId })
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

    return { deleteBook, loading, error };
}