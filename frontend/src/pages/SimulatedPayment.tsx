import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import { useConfirmPayment } from "../hooks/confirmPaymentHook";
import { CartStore } from "../store/cartStore";
import { useNotificationStore } from "../store/notificationStore";

type PendingItem = {
  bookId: string;
  quantity: number;
  price: number;
  book: {
    title: string;
    imageUrl: string;
    slug: string;
    price: number;
  };
};

type PendingOrder = {
  orderId: string;
  total: number;
  items: PendingItem[];
};

export const SimulatedPayment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();
  const { confirmPayment, loading: confirming } = useConfirmPayment();
  const triggerRefetch = CartStore((state) => state.triggerRefetch);
  const pushNotification = useNotificationStore((state) => state.push);
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingOrder');
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        console.error('Failed to parse pending order');
      }
    }
  }, []);

  const handleConfirmPayment = async () => {
    if (!orderId) return;

    const result = await confirmPayment(orderId);
    if (!result) return;

    setConfirmed(true);
    triggerRefetch();
    pushNotification({
      title: 'Payment successful',
      description: 'Your order has been confirmed.',
      status: 'success',
    });

    sessionStorage.removeItem('pendingOrder');

    setTimeout(() => {
      navigate(`/checkout/success?order_id=${orderId}`);
    }, 500);
  };

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
          <CheckCircle className="size-20 text-green-400" />
          <h1 className="mt-6 text-2xl font-semibold text-veloura-accent">Payment confirmed!</h1>
          <p className="mt-2 text-sm text-veloura-inverse/60">Redirecting to your order summary...</p>
        </div>
      </main>
    );
  }

  const total = order?.total ?? 0;
  const items = order?.items ?? [];

  return (
    <main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#5a4e44] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-veloura-accent transition hover:bg-white/5"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </button>

        <div className="rounded-[2rem] border border-[#3b332d] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-7 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-veloura-accent/20 text-veloura-accent">
              <CreditCard className="size-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Simulated payment</p>
              <h1 className="text-2xl font-semibold text-veloura-accent">Complete your order</h1>
            </div>
          </div>

          <div className="py-5">
            <p className="mb-3 text-sm font-medium text-veloura-surface-2">Order summary</p>
            <div className="space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-veloura-inverse/50">Loading order details...</p>
              )}
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-black/20 p-3">
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {item.book.imageUrl && (
                      <img src={item.book.imageUrl} alt={item.book.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-veloura-surface-2">{item.book.title}</p>
                    <p className="text-xs text-veloura-inverse/50">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-veloura-accent">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-veloura-surface-2">Total</span>
              <span className="text-2xl font-bold text-veloura-accent">${total.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-veloura-inverse/40">This is a simulated payment. No real charge will be made.</p>
          </div>

          <button
            type="button"
            disabled={confirming || items.length === 0}
            onClick={handleConfirmPayment}
            className="mt-6 w-full rounded-full bg-veloura-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-text shadow-lg shadow-black/30 transition hover:scale-[0.99] hover:bg-[#d6b17b] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirming ? 'Processing...' : 'Confirm payment'}
          </button>
        </div>
      </div>
    </main>
  );
};
