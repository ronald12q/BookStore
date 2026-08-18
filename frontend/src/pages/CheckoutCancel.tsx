import { Link, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";

export const CheckoutCancel = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-[#3b332d] bg-[radial-gradient(circle_at_top,rgba(198,161,106,0.06),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-8 text-center shadow-2xl">
        <XCircle className="size-20 text-red-400" />
        <h1 className="mt-6 text-3xl font-semibold text-veloura-accent sm:text-4xl">Payment Cancelled</h1>
        <p className="mt-3 text-sm leading-7 text-veloura-inverse/65 sm:text-base">
          Your payment was not completed. Your cart items are still saved and you can try again whenever you are ready.
        </p>
        {orderId && (
          <p className="mt-2 text-xs text-veloura-inverse/45">Order ID: {orderId}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-veloura-accent/30 bg-veloura-accent/10 px-6 py-3 text-sm font-semibold text-veloura-accent transition hover:bg-veloura-accent/20"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-veloura-accent px-6 py-3 text-sm font-semibold text-veloura-text transition hover:bg-[#d6b17b]"
          >
            <ShoppingCart className="size-4" />
            Return to cart
          </Link>
        </div>
      </div>
    </main>
  );
};
