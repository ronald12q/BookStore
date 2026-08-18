import { useState } from "react";
import { authStore } from "../store/authStore";

export const updateOrderStatusHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const updateOrderStatus = async (id: string, status: string) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`http://localhost:4000/api/Order/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify({ status })
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to update order';
                console.error('[Update Order Error]', message, errorData);
                throw new Error(message);
            }

            const data = await request.json();
            return data;

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[Update Order Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[Update Order Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { updateOrderStatus, loading, error };
}
