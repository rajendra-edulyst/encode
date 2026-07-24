import { Community, CommunityDetailsList } from '@/@types/common/community';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CommunityState = {
    communities: Community[];
    setCommunities: (communities: Community[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useCommunityStore = create<CommunityState>()(
    persist(
        (set) => ({
            communities: [],
            setCommunities: (communities: Community[]) => set({ communities }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'communitiesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// community details store
type CommunityDetailsState = {
    community: CommunityDetailsList;
    setCommunity: (community: CommunityDetailsList) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useCommunityDetailsStore = create<CommunityDetailsState>()(
    persist(
        (set) => ({
            community: {} as CommunityDetailsList,
            setCommunity: (community: CommunityDetailsList) => set({ community }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'communityDetailsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);