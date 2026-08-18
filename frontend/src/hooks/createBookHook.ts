import { API_URL } from "../lib/api";
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

            const request = await fetch(`${API_URL}/api/Book/createBook`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${User?.token}`
                },
                body: formData
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to create book';
                console.error('[Create Book Error]', message, errorData);
                throw new Error(message);
            }

            const data = await request.json();
            return data;

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[Create Book Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[Create Book Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { createBook, loading, error };
}
