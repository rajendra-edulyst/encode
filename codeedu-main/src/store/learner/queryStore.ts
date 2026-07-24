import { Query } from '@/@types/learner/mailbox';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QueryState = {
    inbox: Query[];
    drafts: Query[];
    sent: Query[];
    queries: Query[];
    setQueries: (queries: Query[]) => void;
    setInbox: (inbox: Query[]) => void;
    setDrafts: (drafts: Query[]) => void;
    setSent: (sent: Query[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useQueryStore = create<QueryState>()(
    persist(
        (set) => ({
            inbox: {} as Query[],
            drafts: {} as Query[],
            sent: {} as Query[],
            queries: {} as Query[],
            setInbox: (inbox: Query[]) => set({ inbox }),
            setDrafts: (drafts: Query[]) => set({ drafts }),
            setSent: (sent: Query[]) => set({ sent }),
            setQueries: (queries: Query[]) => set({ queries }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'queriesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);