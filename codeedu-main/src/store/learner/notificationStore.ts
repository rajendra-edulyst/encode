import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/@types/notification';

type NotificationStore = {
    notifications: Notification[];
    setNotifications: (
        updater: Notification[] | ((prev: Notification[]) => Notification[])
    ) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useNotificationStore = create<NotificationStore>()(
    persist<NotificationStore>(
        (set, get) => ({
            notifications: [],
            setNotifications: (updater) => {
                const current = get().notifications;
                const next =
                    typeof updater === 'function' ? updater(current) : updater;
                set({ notifications: next });
            },
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error) => set({ error }),
        }),
        {
            name: 'notificationStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) =>
                    localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
