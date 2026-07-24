import { CommunityJoinResponse} from '@/@types/learner/communityJoin';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CommunityJoinState = {
    communityJoin?:CommunityJoinResponse;
    setCommunityJoin: ( communityJoin:  CommunityJoinResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCommunityJoinStore = create<CommunityJoinState>()(
    persist(
        (set) => ({
            setCommunityJoin: ( communityJoin:  CommunityJoinResponse) => set({communityJoin }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'communityJoinStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
