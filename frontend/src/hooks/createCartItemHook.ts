import { API_URL } from "../lib/api";
import { useState } from "react";
import { CartStore } from "../store/cartStore"
import { authStore } from "../store/authStore"
import { useNotificationStore } from "../store/notificationStore";

export const CreateCartItem = () => {
    const { triggerRefetch } = CartStore();
    const pushNotification = useNotificationStore((state) => state.push);
    const setAuthModal = authStore((state) => state.setAuthModal);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const requestCreateCartItem = async (bookId: string) => {
        const user = authStore.getState().User;
        const token = user?.token;

        if (!user || !token) {
            setAuthModal(true);
            pushNotification({
                title: 'Sign in required',
                description: 'You need to sign in first to add books to your cart.',
                status: 'danger'
            });
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`${API_URL}/api/Cart/addItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ Bookid: bookId })
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to add item to cart';
                console.error('[Add to Cart Error]', message, errorData);
                throw new Error(message);
            }

            triggerRefetch();
            pushNotification({
                title: 'Added to cart',
                description: 'The book was added successfully.',
                status: 'success'
            });

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                pushNotification({
                    title: 'Could not add item',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                console.error('[Add to Cart Error] Unknown error', error);
                setError('An unexpected error occurred');
                pushNotification({
                    title: 'Could not add item',
                    description: 'An unexpected error occurred',
                    status: 'danger'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, requestCreateCartItem };
}
