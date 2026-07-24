import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunityCategory, Post } from '@community/types/community';


interface Pagination {
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

type CommunityState = {
  community: CommunityCategory[];
  setCommunity: (community: CommunityCategory[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      community: [],
      setCommunity: (community: CommunityCategory[]) => set({ community }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityStore',
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
  community: CommunityCategory;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  setCommunity: (community: CommunityCategory) => void;
  communityContent: Post[];
  setCommunityContent: (communityContent: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityDetailsStore = create<CommunityDetailsState>()(
  persist(
    (set) => ({
      community: {} as CommunityCategory,
      pagination: {} as Pagination,
      setPagination: (pagination: Pagination) => set({ pagination }),
      setCommunity: (community: CommunityCategory) => set({ community }),
      communityContent: [],
      setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
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

// my posts store

type CommunityMyPostsState = {
  community: CommunityCategory;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  setCommunity: (community: CommunityCategory) => void;
  communityContent: Post[];
  setCommunityContent: (communityContent: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityMyPostsStore = create<CommunityMyPostsState>()(
  persist(
    (set) => ({
      community: {} as CommunityCategory,
      pagination: {} as Pagination,
      setPagination: (pagination: Pagination) => set({ pagination }),
      setCommunity: (community: CommunityCategory) => set({ community }),
      communityContent: [],
      setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityMyPostsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// community post comment store
type CommunityPostCommentState = {
  postId: string;
  setPostId: (postId: string) => void;
  comments: Post[];
  setComments: (comments: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityPostCommentStore = create<CommunityPostCommentState>()(
  persist(
    (set) => ({
      postId: '',
      setPostId: (postId: string) => set({ postId }),
      comments: [],
      setComments: (comments: Post[]) => set({ comments }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityPostCommentStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// announcement store
type AnnouncementDetailsState = {
  community: CommunityCategory;
  setCommunity: (community: CommunityCategory) => void;
  communityContent: Post[];
  setCommunityContent: (communityContent: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};


export const useAnnouncementStore = create<AnnouncementDetailsState>()(
  persist(
    (set) => ({
      community: {} as CommunityCategory,
      setCommunity: (community: CommunityCategory) => set({ community }),
      communityContent: [],
      setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'announcementStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);