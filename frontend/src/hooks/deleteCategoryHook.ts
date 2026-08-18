import { API_URL } from "../lib/api";
import { useState } from "react";
import { authStore } from "../store/authStore";

export const deleteCategoryHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const deleteCategory = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`${API_URL}/api/Category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify({ id })
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to delete category';
                console.error('[Delete Category Error]', message, errorData);
                throw new Error(message);
            }

            const data = await request.json();
            return data;

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[Delete Category Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[Delete Category Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { deleteCategory, loading, error };
}
