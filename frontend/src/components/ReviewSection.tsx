import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useGetReviews } from "../hooks/getReviewsHook";
import { useCreateReview } from "../hooks/createReviewHook";
import { useDeleteReview } from "../hooks/deleteReviewHook";
import { authStore } from "../store/authStore";

interface ReviewSectionProps {
  bookId: string;
}

export const ReviewSection = ({ bookId }: ReviewSectionProps) => {
  const { reviews, averageRating, total, loading, refetch } = useGetReviews(bookId);
  const { createReview, loading: creating } = useCreateReview();
  const { deleteReview, loading: deleting } = useDeleteReview();
  const User = authStore((state) => state.User);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    const result = await createReview(bookId, rating, comment || undefined);
    if (result) {
      setRating(0);
      setComment("");
      setShowForm(false);
      refetch();
    }
  };

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result) {
      refetch();
    }
  };

  const renderStars = (value: number, interactive = false, onClick?: (v: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? "cursor-pointer transition hover:scale-110" : "cursor-default"}`}
          onClick={() => onClick?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <Star
            className={`size-5 ${
              star <= (interactive ? hoverRating || rating : value)
                ? "fill-veloura-accent text-veloura-accent"
                : "text-veloura-inverse/30"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-10 rounded-[2rem] border border-[#3b332d] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-7 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Community</p>
          <h2 className="mt-2 text-2xl font-semibold text-veloura-surface-2">Reviews</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-sm text-veloura-inverse/50">
            {averageRating.toFixed(1)} ({total} {total === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {User && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-5 w-full rounded-full border border-veloura-accent/30 bg-veloura-accent/10 py-3 text-sm font-semibold text-veloura-accent transition hover:bg-veloura-accent/20"
        >
          Write a review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-2xl border border-veloura-accent/15 bg-black/20 p-5">
          <div>
            <p className="mb-2 text-sm font-medium text-veloura-surface-2">Your rating</p>
            {renderStars(rating, true, setRating)}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
            className="min-h-24 w-full rounded-2xl border border-veloura-border/20 bg-veloura-surface/95 px-4 py-3 text-sm text-veloura-text outline-none focus:border-veloura-accent"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating || rating < 1}
              className="flex-1 rounded-full bg-veloura-accent px-5 py-3 text-sm font-semibold text-veloura-text transition hover:bg-[#d6b17b] disabled:opacity-50"
            >
              {creating ? "Submitting..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setRating(0); setComment(""); }}
              className="rounded-full border border-veloura-border/20 px-5 py-3 text-sm font-semibold text-veloura-surface-2 transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="mt-5 text-sm text-veloura-surface-2/60">Loading reviews...</p>}

      {!loading && total === 0 && (
        <p className="mt-5 text-center text-sm text-veloura-inverse/40">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="mt-5 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-veloura-border/10 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-veloura-surface-2">{review.user.name}</p>
                  <p className="text-xs text-veloura-inverse/40">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {User && review.user.name === User.user.name && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => handleDelete(review.id)}
                    className="rounded-full border border-red-300/15 p-2 text-red-300 transition hover:bg-red-950/30 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <div className="mt-2">{renderStars(review.rating)}</div>
              {review.comment && (
                <p className="mt-3 text-sm leading-6 text-veloura-inverse/70">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
