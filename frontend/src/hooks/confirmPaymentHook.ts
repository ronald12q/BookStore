import { useState } from "react";
import { authStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

export const useConfirmPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pushNotification = useNotificationStore((state) => state.push);

  const confirmPayment = async (orderId: string) => {
    const token = authStore.getState().User?.token;
    if (!token) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/Order/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Payment confirmation failed';
        console.error('[Confirm Payment Error]', message, errorData);
        throw new Error(message);
      }

      const data = await response.json();
      sessionStorage.removeItem('pendingOrder');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      pushNotification({
        title: 'Payment error',
        description: message,
        status: 'danger',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { confirmPayment, loading, error };
};
