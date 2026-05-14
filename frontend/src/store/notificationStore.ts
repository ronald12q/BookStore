import { create } from 'zustand';

export type NotificationStatus = 'success' | 'danger' | 'warning' | 'accent';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  status: NotificationStatus;
  duration?: number;
}

interface NotificationStore {
  items: NotificationItem[];
  push: (item: Omit<NotificationItem, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  items: [],
  push: (item) => {
    const id = crypto.randomUUID();
    set({ items: [...get().items, { id, ...item }] });
  },
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: [] }),
}));
