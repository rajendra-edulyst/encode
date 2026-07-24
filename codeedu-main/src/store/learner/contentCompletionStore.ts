/* eslint-disable import/no-unresolved */
import { PercentageCompletionResponse} from '@/@types/learner/moduleContentCompletion';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ContentCompletionState = {
    contentCompletion?: PercentageCompletionResponse;
    setContentCompletion: ( contentCompletion:   PercentageCompletionResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useContentCompletionStore = create<ContentCompletionState>()(
    persist(
        (set) => ({
            setContentCompletion: ( contentCompletion:   PercentageCompletionResponse) => set({contentCompletion }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'contentCompletionStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
