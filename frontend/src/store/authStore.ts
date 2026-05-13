import {create} from 'zustand';
import type {authInterface} from '../utilities/authInterface'
import { persist } from 'zustand/middleware';

interface authStore {
    User: authInterface | null,
    setUser: (user: authInterface) => void
    logOut : () => void
    
}

export const authStore = create<authStore>()(
    
    persist(
        (set) => ({
            
            User: null,
            setUser: (user: authInterface) => set(() => ({User: user})),
            logOut: () => set({User: null}),
        }),
        {name: 'user-save', partialize: (state) => ({User: state.User})}


    )
)
