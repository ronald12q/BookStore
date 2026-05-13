import {create} from 'zustand'
import type { Book } from '../utilities/bookInterface'
import { persist } from 'zustand/middleware'


 interface CartStoreInterface {

    cartItems : Book[] | null,
    setItems : (Items: Book) => void,
    clearCart: () => void
}

export const CartStore = create<CartStoreInterface>()(

    persist(
        (set) => ({
            cartItems: null,

            setItems : (item: Book) => set((state) => ({cartItems: [...(state.cartItems ?? []), item],})),

            clearCart: () => set({cartItems: null})
        }),

        {name: 'cart-save', partialize: (state) => ({cartItems: state.cartItems})}
    )
)