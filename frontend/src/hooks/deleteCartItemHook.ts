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

            const request = await fetch(`http://localhost:4000/api/Cart/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ Bookid: bookId })
            });

            if (!request.ok) throw new Error('Failed to remove item from cart');

            triggerRefetch();
            pushNotification({
                title: 'Removed from cart',
                description: 'The item was deleted successfully.',
                status: 'success'
            });

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
                pushNotification({
                    title: 'Could not remove item',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                setError('Unknown error during the request');
                pushNotification({
                    title: 'Could not remove item',
                    description: 'Unknown error during the request',
                    status: 'danger'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, requestDeleteCartItem };
}
