import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { CartStore } from "../store/cartStore";
import { useNotificationStore } from "../store/notificationStore";

export const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const clearCart = CartStore((state) => state.clearCart);
  const triggerRefetch = CartStore((state) => state.triggerRefetch);
  const pushNotification = useNotificationStore((state) => state.push);

  useEffect(() => {
    clearCart();
    triggerRefetch();
    pushNotification({
      title: 'Payment successful',
      description: 'Your order has been confirmed. Thank you for your purchase!',
      status: 'success',
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-[#3b332d] bg-[radial-gradient(circle_at_top,rgba(198,161,106,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-8 text-center shadow-2xl">
        <CheckCircle className="size-20 text-green-400" />
        <h1 className="mt-6 text-3xl font-semibold text-veloura-accent sm:text-4xl">Payment Successful</h1>
        <p className="mt-3 text-sm leading-7 text-veloura-inverse/65 sm:text-base">
          Your order has been confirmed and is being processed.
        </p>
        {orderId && (
          <p className="mt-2 text-xs text-veloura-inverse/45">Order ID: {orderId}</p>
        )}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-veloura-accent/30 bg-veloura-accent/10 px-6 py-3 text-sm font-semibold text-veloura-accent transition hover:bg-veloura-accent/20"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
};
