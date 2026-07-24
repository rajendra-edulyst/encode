import { LiveClass, Pagination } from "@/@types/learner/MyClasses";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LiveClassState = {
    liveClasses: LiveClass[];
    pagination: Pagination;
    setLiveClasses: (liveClasses: LiveClass[]) => void;
    setPagination: (pagination: Pagination) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useLiveClassStore = create<LiveClassState>()(
    persist(
        (set) => ({
            liveClasses: [],
            setLiveClasses: (liveClasses: LiveClass[]) => set({ liveClasses }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            setPagination: (pagination: Pagination) => set({ pagination }),
            pagination: {} as Pagination,
        }),
        {
            name: 'liveClassStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);