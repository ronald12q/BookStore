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

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to update book';
                console.error('[Update Book Error]', message, errorData);
                throw new Error(message);
            }

            const result = await request.json();
            return result;

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[Update Book Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[Update Book Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { updateBook, loading, error };
}
