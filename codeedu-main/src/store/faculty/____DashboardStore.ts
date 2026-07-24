import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { StatCount } from "@/@types/faculty/dashboard";
import { fetchStatCount } from '@services/faculty/DashboardService'
import { createExpiringStorage } from '@store/createExpiringStorage';

type StatCountState = {
    statCount: StatCount | null;
    setStatCount: (statCount: StatCount) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchStatCount: () => Promise<void>;
};

export const useStatCountStore = create<StatCountState>()(
    persist(
        (set) => ({
            statCount: null,
            setStatCount: (statCount: StatCount) => set({ statCount }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchStatCount: async () => {
                set({ loading: true });
                set({ error: null });
                try {
                    const response = await fetchStatCount();
                    set({ statCount: response || {} as StatCount });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    console.error('Error fetching stat count:', error);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'dashboard-stat-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);