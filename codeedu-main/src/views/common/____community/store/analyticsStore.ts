import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from './createExpiringStorage';
import { AnalyticGraph, CommentPost, Events, Impressions, Internship, LikedPost, MyActivity } from '../types/analytics';
import { fetchCommentPosts, fetchEvents, fetchGraphData, fetchImpressionsData, fetchInternship, fetchLikedPosts, fetchMyActivityData, fetchUserCommunityAnalytics } from '../services/analyticsService';
import { UserCommunityAnalytics } from '../types/community';
// import { fetchEvent } from '../services/CommunityService';

type AnalyticState = {
    analytics: UserCommunityAnalytics;
    graph: AnalyticGraph[];
    impressions: Impressions | null;
    myactivity: MyActivity | null;
    likedPosts: LikedPost[];
    commentPosts: CommentPost[];
    Events: Events[];
    Internship: Internship[];
    setLikedPosts: (posts: LikedPost[]) => void;
    setCommentPosts: (posts: CommentPost[]) => void;
    setEvents: (posts: Events[]) => void;
    setInternship:(posts: Internship[]) =>void;
    fetchLikedPosts: () => Promise<void>;
   fetchCommentPosts: () =>Promise<void>;
   fetchEvents: () =>Promise<void>;
   fetchInternship: ()=>Promise<void>;
    loading: boolean;
    error: string;
    // setters
    setGraph: (graph: AnalyticGraph[]) => void;
    setImpressions: (impressions: Impressions) => void;
    setMyActivity: (myactivity: MyActivity) => void;
    setAnalytics: (analytics: UserCommunityAnalytics) => void;
    // fetch methods
    fetchGraphData: (type: 'weekly' | 'monthly') => Promise<void>;
    fetchImpressionsData: () => Promise<void>;
    fetchMyActivityData: () => Promise<void>;
    fetchUserCommunityAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticState>()(
    persist(
        (set) => ({
            graph: [] as AnalyticGraph[],
            impressions: null,
            myactivity: null,
            likedPosts:[] as LikedPost[],
            commentPosts:[] as CommentPost[],
            Events:[] as Events[],
            Internship: [] as Internship[],
            analytics: {} as UserCommunityAnalytics,
            loading: false,
            error: '',
            setGraph: (graph) => set({ graph }),
            setImpressions: (impressions) => set({ impressions }),
            setMyActivity: (myactivity) => set({ myactivity }),
            setLikedPosts: (posts) => set({ likedPosts: posts }),
            setCommentPosts: (posts) =>set({commentPosts: posts}),
            setEvents: (posts) =>set({Events: posts}),
            setInternship: (posts) =>set({Internship: posts}),
            setAnalytics: (analytics) => set({ analytics }),
            fetchGraphData: async (type) => {
                set({ loading: true, error: '' });
                // Fetch graph data
                try {
                    const response = await fetchGraphData(type);
                    set({ graph: response });

                }
                catch (error) {
                    set({ error: error as string });
                }
                finally {
                    set({ loading: false });
                }
            },
            fetchImpressionsData: async () => {
                set({ loading: true, error: '' });
                // Fetch impressions data
                try {
                    const response = await fetchImpressionsData();
                    set({ impressions: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
            fetchMyActivityData: async () => {
                set({ loading: true, error: '' });
                // Fetch my activity data
                try {
                    const response = await fetchMyActivityData();
                    set({ myactivity: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
            fetchLikedPosts: async () => {
                set({ loading: true, error: '' });
                try {
                    const response = await fetchLikedPosts();
                    set({ likedPosts: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
             fetchCommentPosts: async () => {
                set({ loading: true, error: '' });
                try {
                    const response = await fetchCommentPosts();
                    set({ commentPosts: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
             fetchEvents: async () => {
                set({ loading: true, error: '' });
                try {
                    const response = await fetchEvents();
                    set({ Events: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
             fetchInternship: async () => {
                set({ loading: true, error: '' });
                try {
                    const response = await fetchInternship();
                    set({ Internship: response });
                } catch (error) {
                    set({ error: error as string });
                } finally {
                    set({ loading: false });
                }
            },
            fetchUserCommunityAnalytics: async () => {
                set({ loading: true, error: '' });
                try {
                    const response = await fetchUserCommunityAnalytics();
                    set({ analytics: response || {}, loading: false });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to fetch analytics' });
                }
                finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'analytic-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);


