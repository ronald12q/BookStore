import { API_URL } from "../lib/api";
import { useState } from "react";
import { authStore } from "../store/authStore";

export const createOrderHook = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { User } = authStore();

    const createOrder = async (items: {bookId: string, quantity: number}[], address: string) => {
        try {
            setLoading(true);
            setError(null);

            const request = await fetch(`${API_URL}/api/Order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${User?.token}`
                },
                body: JSON.stringify({ items, address })
            });

            if (!request.ok) throw new Error('The request to the API failed');

            const data = await request.json();
            return data;

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

    return { createOrder, loading, error };
}