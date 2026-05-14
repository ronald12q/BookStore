import { useState } from "react";
import { CartStore } from "../store/cartStore"
import { authStore } from "../store/authStore"
import { useNotificationStore } from "../store/notificationStore";

export const CreateCartItem = () => {
    const { triggerRefetch } = CartStore();
    const pushNotification = useNotificationStore((state) => state.push);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const requestCreateCartItem = async (bookId: string) => {
        const token = authStore.getState().User?.token;
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            const request = await fetch('http://localhost:4000/api/Cart/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ Bookid: bookId })
            });

            if (!request.ok) throw new Error('Failed to add item to cart');

            triggerRefetch();
            pushNotification({
                title: 'Added to cart',
                description: 'The book was added successfully.',
                status: 'success'
            });

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
                pushNotification({
                    title: 'Could not add item',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                setError('Unknown error during the request');
                pushNotification({
                    title: 'Could not add item',
                    description: 'Unknown error during the request',
                    status: 'danger'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, requestCreateCartItem };
}
