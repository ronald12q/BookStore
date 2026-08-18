import { useState } from "react";
import { authStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

export const useDeleteReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pushNotification = useNotificationStore((state) => state.push);

  const deleteReview = async (reviewId: string) => {
    const token = authStore.getState().User?.token;
    if (!token) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/Review/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Failed to delete review';
        console.error('[Delete Review Error]', message, errorData);
        throw new Error(message);
      }

      pushNotification({
        title: 'Review deleted',
        description: 'Your review has been removed.',
        status: 'success',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      pushNotification({
        title: 'Delete error',
        description: message,
        status: 'danger',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteReview, loading, error };
};
