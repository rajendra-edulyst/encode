import { QuickAction } from '@/@types/learner/quick-action';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type InterestState = {
    quickActions: QuickAction[];
    setQuickAction: (quickActions: QuickAction[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useQuickActionStore = create<InterestState>()(
    persist(
        (set) => ({
            quickActions: [],
            setQuickAction: (quickActions: QuickAction[]) => set({ quickActions }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'quickActionStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
