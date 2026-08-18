import { useEffect, useState } from "react";

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
  };
};

export const useGetReviews = (bookId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [total, setTotal] = useState(0);

  const getReviews = async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/Review/${bookId}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Failed to fetch reviews';
        console.error('[Get Reviews Error]', message, errorData);
        throw new Error(message);
      }

      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotal(data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('[Get Reviews Error]', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [bookId]);

  return { reviews, averageRating, total, loading, error, refetch: getReviews };
};
