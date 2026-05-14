import { authStore } from "../store/authStore";
import { CartStore } from "../store/cartStore";
import { DeleteCartItem } from "../hooks/deleteCartItemHook";

interface SideBarProps {
  isOpen : boolean,
  setOpen: (isOPen : boolean) => void 
}

export const SidebarComponent = ({isOpen, setOpen}: SideBarProps) => {
  const User = authStore((state) => state.User);
  const { cartItems } = CartStore();
  const { requestDeleteCartItem } = DeleteCartItem();

  const total = cartItems?.reduce((sum, item) => sum + item.book.price * item.quantity, 0) ?? 0;

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-[35vw] border-l border-[#3b332d] bg-[#141210] px-4 py-4 text-veloura-surface-2 shadow-2xl sm:px-6 sm:py-6">
      <div className="flex h-full flex-col rounded-[1.75rem] border border-white/5 bg-black/20 p-5">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto rounded-full border border-[#5a4e44] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-veloura-accent transition hover:bg-white/5"
        >
          Close
        </button>

        {User === null ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-[1.5rem] border border-[#5a4e44] bg-[#1b1714] p-6 text-center shadow-lg">
              <p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Restricted access</p>
              <h3 className="mt-4 text-2xl font-semibold text-veloura-accent">You need an account</h3>
              <p className="mt-3 text-sm leading-6 text-veloura-inverse/65">
                Sign in to view your cart and continue with checkout.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 border-b border-white/10 pb-5">
              <p className="text-xs uppercase tracking-[0.35em] text-veloura-inverse/45">Your cart</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-veloura-accent">Selected Books</h2>
              <p className="mt-2 text-sm leading-6 text-veloura-inverse/60">
                Revisa los libros que agregaste antes de proceder al pago.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {!cartItems || cartItems.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-veloura-inverse/50">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border border-[#3b332d] bg-[#1b1714] p-3 shadow-sm">
                      <div className="h-24 w-16 shrink-0 rounded-xl overflow-hidden bg-white/10">
                        {item.book.imageUrl && (
                          <img src={item.book.imageUrl} alt={item.book.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-veloura-surface-2">{item.book.title}</p>
                            <p className="mt-1 text-xs text-veloura-inverse/55">{item.book.author}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => requestDeleteCartItem(item.bookId)}
                            className="shrink-0 text-xs text-red-400 hover:text-red-300 transition"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-veloura-accent">${item.book.price.toFixed(2)}</span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-veloura-inverse/50">Qty {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
              <div className="rounded-2xl border border-[#3b332d] bg-[#1b1714] p-4">
                <div className="flex items-center justify-between text-sm text-veloura-inverse/65">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-veloura-inverse/65">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-medium text-veloura-surface-2">Total</span>
                  <span className="text-xl font-semibold text-veloura-accent">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-veloura-accent px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-veloura-text shadow-lg shadow-black/30 transition hover:scale-[0.99] hover:bg-[#d6b17b]"
              >
                Proceed to pay
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
