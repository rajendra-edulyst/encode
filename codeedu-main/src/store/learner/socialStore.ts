import { Post } from '@/@types/learner/Social';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SocialState = {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

const createStore = (storeName: string) => {
    return create<SocialState>()(
        persist(
            (set) => ({
                posts: [],
                setPosts: (posts: Post[]) => set({ posts }),
                loading: false,
                setLoading: (loading: boolean) => set({ loading }),
                error: null,
                setError: (error: string | null) => set({ error }),
            }),
            {
                name: storeName,
                storage: {
                    getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                    setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                    removeItem: (key) => localStorage.removeItem(key),
                },
            },
        ),
    );
};

// post detail store 
type PostDetailState = {
    post: Post | null;
    setPost: (post: Post | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const usePostDetailStore = create<PostDetailState>()(
    persist(
        (set) => ({
            post: null,
            setPost: (post: Post | null) => set({ post }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'postDetailStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        },
    ),
);


// Create stores using the reusable function
export const useNewsStore = createStore('newsStore');
export const useBlogStore = createStore('blogStore');
