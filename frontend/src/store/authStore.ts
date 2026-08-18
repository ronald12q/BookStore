import {create} from 'zustand';
import type {authInterface} from '../utilities/authInterface'
import { persist } from 'zustand/middleware';

interface authStore {
    User: authInterface | null,
    authModal: boolean,
    setUser: (user: authInterface) => void
    setAuthModal: (isOpen: boolean) => void
    logOut : () => void
    
}

export const authStore = create<authStore>()(
    
    persist(
        (set) => ({
            
            User: null,
            authModal: false,
            setUser: (user: authInterface) => set(() => ({User: user})),
            setAuthModal: (isOpen: boolean) => set({authModal: isOpen}),
            logOut: () => set({User: null}),
        }),
        {name: 'user-save', partialize: (state) => ({User: state.User})}


    )
)
