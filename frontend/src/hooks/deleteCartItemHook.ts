import { API_URL } from "../lib/api";
import { useState } from "react";
import { CartStore } from "../store/cartStore"
import { authStore } from "../store/authStore"
import { useNotificationStore } from "../store/notificationStore";

export const DeleteCartItem = () => {
    const { triggerRefetch } = CartStore();
    const pushNotification = useNotificationStore((state) => state.push);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const requestDeleteCartItem = async (bookId: string) => {
        const token = authStore.getState().User?.token;
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`${API_URL}/api/Cart/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ Bookid: bookId })
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to remove item from cart';
                console.error('[Delete Cart Item Error]', message, errorData);
                throw new Error(message);
            }

            triggerRefetch();
            pushNotification({
                title: 'Removed from cart',
                description: 'The item was deleted successfully.',
                status: 'success'
            });

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                pushNotification({
                    title: 'Could not remove item',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.error('[Delete Cart Item Error] Unknown error', error);
                setError('An unexpected error occurred');
                pushNotification({
                    title: 'Could not remove item',
                    description: 'An unexpected error occurred',
                    status: 'danger'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, requestDeleteCartItem };
}
