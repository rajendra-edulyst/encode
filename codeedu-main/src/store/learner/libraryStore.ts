import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Content, ContentAPiResponse } from '@/@types/learner/library';

type ContentState = {
    contents: Content[];
    setContents: (contents: Content[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    setPagination: (pagination: ContentAPiResponse['pagination']) => void;
};

export const useContentStore = create<ContentState>()(
    persist(
        (set) => ({
            contents: [],
            setContents: (contents: Content[]) => set({ contents }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            pagination: {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
                next_page_url: null,
                prev_page_url: null,
            },
            setPagination: (pagination) => set({ pagination }),
        }),
        {
            name: 'contentLibraryStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
