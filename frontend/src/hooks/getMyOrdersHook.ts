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

            // El backend separa esta ruta de la ruta admin /all.
            const request = await fetch('http://localhost:4000/api/Order/my-orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${User?.token}`
                }
            });

            if (!request.ok) throw new Error('The request to the API failed');

            const data = await request.json();
            setOrders(data);

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
            } else {
                console.log('Unknown error during the request', error);
                setError('Unknown error during the request');
            }
        } finally {
            setLoading(false);
        }
    }

    return { getMyOrders, loading, error, orders };
}
