import { useEffect, useState } from 'react';
import { CartStore } from '../store/cartStore'
import { authStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore';

export const GetCart = () => {
    const { setItems, clearCart, refetchTrigger } = CartStore();
    const User = authStore((state) => state.User);
    const pushNotification = useNotificationStore((state) => state.push);

    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [cartError, setCartError] = useState<string | null>(null);

    const getApiCart = async () => {
        const token = authStore.getState().User?.token;
        if (!token) return;

        try {
            setCartLoading(true);
            setCartError(null);

            const request = await fetch('http://localhost:4000/api/Cart/getCart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!request.ok) throw new Error('Failed to fetch cart');

            const data = await request.json();
            setItems(data.cart.items);

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setCartError(error.message);
                pushNotification({
                    title: 'Cart error',
                    description: error.message,
                    status: 'danger'
                });
            } else {
                setCartError('Unknown error during the request');
                pushNotification({
                    title: 'Cart error',
                    description: 'Unknown error during the request',
                    status: 'danger'
                });
            }
        } finally {
            setCartLoading(false);
        }
    }

    useEffect(() => {
        if (User) {
            getApiCart();
        } else {
            clearCart();
        }
    }, [User, refetchTrigger]);

    return { cartLoading, cartError, getApiCart };
}
