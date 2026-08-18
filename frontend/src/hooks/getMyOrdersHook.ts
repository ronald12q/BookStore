import { useState } from "react";
import { authStore } from "../store/authStore";

export const getMyOrdersHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[] | null>(null);
    const { User } = authStore();

    const getMyOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch('http://localhost:4000/api/Order/my-orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${User?.token}`
                }
            });

            if (!request.ok) {
                const errorData = await request.json();
                const message = errorData?.message || 'Failed to fetch orders';
                console.error('[My Orders Error]', message, errorData);
                throw new Error(message);
            }

            const data = await request.json();
            setOrders(data);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('[My Orders Error]', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('[My Orders Error] Unknown error', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { getMyOrders, loading, error, orders };
}
