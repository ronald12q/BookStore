import { API_URL } from "../lib/api";
import { useState } from "react";
import { authStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pushNotification = useNotificationStore((state) => state.push);

  const createReview = async (bookId: string, rating: number, comment?: string) => {
    const token = authStore.getState().User?.token;
    if (!token) {
      pushNotification({
        title: 'Authentication required',
        description: 'You need to sign in to leave a review.',
        status: 'danger',
      });
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/Review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Failed to create review';
        console.error('[Create Review Error]', message, errorData);
        throw new Error(message);
      }

      const data = await response.json();
      pushNotification({
        title: 'Review submitted',
        description: 'Your review has been published.',
        status: 'success',
      });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      pushNotification({
        title: 'Review error',
        description: message,
        status: 'danger',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createReview, loading, error };
};
