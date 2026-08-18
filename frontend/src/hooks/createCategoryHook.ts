import { API_URL } from "../lib/api";
import { useState } from "react";
import { authStore } from "../store/authStore";

export const createCategoryHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const createCategory = async (name: string, slug: string) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`${API_URL}/api/Category/createCategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify({ name, slug })
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to create category';
                console.error('[Create Category Error]', message, errorData);
                throw new Error(message);
            }

            const data = await request.json();
            return data;

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[Create Category Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[Create Category Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { createCategory, loading, error };
}
