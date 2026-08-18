import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { getMyOrdersHook } from "../hooks/getMyOrdersHook";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  book: {
    title: string;
    imageUrl: string;
    slug: string;
  };
};

type Order = {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
};

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", icon: Clock },
  PAID: { label: "Paid", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", icon: CheckCircle },
  SHIPPED: { label: "Shipped", color: "text-purple-400 border-purple-400/30 bg-purple-400/10", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-400 border-green-400/30 bg-green-400/10", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "text-red-400 border-red-400/30 bg-red-400/10", icon: XCircle },
};

const formatCurrency = (value: number) => `$${Number(value || 0).toFixed(2)}`;

export const MyOrders = () => {
  const { getMyOrders, loading, error, orders } = getMyOrdersHook();

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <main className="min-h-screen bg-[#141210] px-4 py-10 text-veloura-surface-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/"
            className="rounded-full border border-[#5a4e44] bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-veloura-accent transition hover:border-[#8a786a] hover:bg-white/5"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Your purchases</p>
            <h1 className="text-3xl font-semibold text-veloura-accent">My Orders</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300/20 bg-red-950/25 px-5 py-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-veloura-surface-2/60">Loading your orders...</p>
        )}

        {!loading && (!orders || orders.length === 0) && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[2rem] border border-[#3b332d] bg-[#1b1714] p-8 text-center">
            <Package className="size-16 text-veloura-inverse/30" />
            <h2 className="mt-4 text-xl font-semibold text-veloura-surface-2">No orders yet</h2>
            <p className="mt-2 text-sm text-veloura-inverse/50">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-full bg-veloura-accent px-6 py-3 text-sm font-semibold text-veloura-text transition hover:bg-[#d6b17b]"
            >
              Browse books
            </Link>
          </div>
        )}

        {!loading && orders && orders.length > 0 && (
          <div className="space-y-6">
            {(orders as Order[]).map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="rounded-[1.5rem] border border-[#3b332d] bg-[#1b1714] p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs text-veloura-inverse/45">Order ID</p>
                      <p className="font-mono text-sm text-veloura-surface-2">{order.id}</p>
                      <p className="mt-1 text-xs text-veloura-inverse/45">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.color}`}>
                        <StatusIcon className="size-3" />
                        {status.label}
                      </span>
                      <span className="font-display text-xl font-bold text-veloura-accent">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-xl bg-black/20 p-3">
                        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                          {item.book.imageUrl && (
                            <img
                              src={item.book.imageUrl}
                              alt={item.book.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/book/${item.book.slug}`}
                            className="truncate text-sm font-semibold text-veloura-surface-2 hover:text-veloura-accent"
                          >
                            {item.book.title}
                          </Link>
                          <p className="text-xs text-veloura-inverse/50">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-veloura-accent">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
