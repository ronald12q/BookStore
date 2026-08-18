import { useState } from "react";
import { authStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pushNotification = useNotificationStore((state) => state.push);

  const checkout = async () => {
    const token = authStore.getState().User?.token;
    if (!token) {
      pushNotification({
        title: 'Authentication required',
        description: 'You need to sign in to proceed with checkout.',
        status: 'danger',
      });
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/Order/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Checkout failed';
        console.error('[Checkout Error]', message, errorData);
        throw new Error(message);
      }

      const data = await response.json();

      sessionStorage.setItem('pendingOrder', JSON.stringify(data));

      window.location.href = `/checkout/payment?order_id=${data.orderId}`;
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      pushNotification({
        title: 'Checkout error',
        description: message,
        status: 'danger',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
};
