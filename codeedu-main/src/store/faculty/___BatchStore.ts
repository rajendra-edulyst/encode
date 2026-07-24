import { Batch } from "@/@types/faculty/batch";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { fetchBatches } from "@/services/faculty/BatchService";

type BatchState = {
    batches: Batch[];
    setBatches: (batches: Batch[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchBatches: (params?: URLSearchParams) => Promise<void>;
};

export const useBatchStore = create<BatchState>()(
    persist(
        (set) => ({
            batches: [],
            setBatches: (batches: Batch[]) => set({ batches }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchBatches: async (params?: URLSearchParams) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchBatches(params);
                    set({ batches: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching batches:', error.message);
                    } else {
                        console.error('Unknown error fetching batches:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'batches-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);
