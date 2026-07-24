import { CreatePostResponse } from '@/@types/learner/createContent';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CreateContentState = {
    createContent?: CreatePostResponse;
    setCreateContent: (createContent: CreatePostResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCreateContentStore = create<CreateContentState>()(
    persist(
        (set) => ({
            setCreateContent: (createContent: CreatePostResponse) => set({ createContent }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'createContentStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
