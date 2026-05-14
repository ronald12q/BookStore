import {create} from 'zustand'
import type { CartItem } from '../utilities/bookInterface'

interface CartStoreInterface {
    cartItems : CartItem[] | null,
    setItems : (Items: CartItem[]) => void,
    clearCart: () => void,
    refetchTrigger: number,
    triggerRefetch: () => void
}

export const CartStore = create<CartStoreInterface>()(
    (set) => ({
        cartItems: null,
        setItems : (items: CartItem[]) => set({cartItems: items}),
        clearCart: () => set({cartItems: null}),
        refetchTrigger: 0,
        triggerRefetch: () => set((state) => ({refetchTrigger: state.refetchTrigger + 1}))
    })
)
