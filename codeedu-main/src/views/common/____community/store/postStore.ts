import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, PostComment } from '@community/types/community';
import { fetchPosts as fetchCommunityPosts, deleteCommunityPost, fetchPostComments, likePost, sendComment } from '../services/PostService';
import { createExpiringStorage } from './createExpiringStorage';
import { repostPost, updateRepostPost } from '../services/CommunityService';

type PostsState = {
    // state variables
    error: string;
    loading: boolean;
    posts: {
        data?: Post[];
        loading?: boolean;
        error?: string;
    };
    pinPosts: {
        data?: Post[];
        loading?: boolean;
        error?: string;
    };
    myPosts: {
        data?: Post[];
        loading?: boolean;
        error?: string;
    };
    selectedPost: Post | null;
    postComments: PostComment[];
    industryPosts: {
        data: Post[];
        loading: boolean;
        error: string;
    };
    communityPosts: {
        data: Post[];
        loading: boolean;
        error: string;
    };
    // set state methods
    setPosts: (posts: Post[]) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    setPinPosts: (pinPosts: Post[]) => void;
    setMyPosts: (myPosts: Post[]) => void;
    setSelectedPost: (selectedPost: Post | null) => void;
    setPostComments: (postComments: PostComment[]) => void;
    setIndustryPosts: (industryPosts: Post[]) => void;
    setCommunityPosts: (communityPosts: Post[]) => void;
    // fetch methods
    fetchPosts: () => Promise<void>;
    fetchPinPosts: () => Promise<void>;
    fetchMyPosts: () => Promise<void>;
    fetchPostComments: (postId: number) => Promise<void>;
    fetchIndustryPosts: (org_ids: string) => Promise<void>; // This can be implemented to fetch posts related to specific industries
    fetchCommunityPosts: (communityId: string) => Promise<void>; // This can be implemented to fetch posts related to specific communities
    // additional methods
    likeDislikePost: (post: Post) => Promise<void>;
    deletePost: (postId: number) => Promise<void>;
    sendComment: (postId: number, content: string, type?: boolean) => Promise<void>;
    repost: (postId: number, data: {
        joy_content_id: number;
        description: string;
        category_id: string;
    }) => Promise<void>;
    updateRepost: (postId: number, data: {
        description: string;
        category_id: string;
        status: string
    }) => Promise<void>;
}


export const usePostsStore = create<PostsState>()(
    persist(
        (set, get) => ({
            posts: {
                data: [],
                loading: false,
                error: '',
            },
            pinPosts: {
                data: [],
                loading: false,
                error: '',
            },
            myPosts: {
                data: [],
                loading: false,
                error: '',
            },
            error: '',
            loading: false,
            selectedPost: null as Post | null,
            postComments: [],
            industryPosts: {
                data: [],
                loading: false,
                error: '',
            },
            communityPosts: {
                data: [],
                loading: false,
                error: '',
            },
            // Initialize industryPosts if needed
            // set state methods
            setPosts: (posts: Post[]) => set({ posts: { data: posts, loading: false, error: '' } }),
            setError: (error: string) => set({ error }),
            setLoading: (loading: boolean) => set({ loading }),
            setPinPosts: (pinPosts: Post[]) => set({ pinPosts: { data: pinPosts, loading: false, error: '' } }),
            setMyPosts: (myPosts: Post[]) => set({ myPosts: { data: myPosts, loading: false, error: '' } }),
            setSelectedPost: (selectedPost: Post | null) => set({ selectedPost }),
            setPostComments: (postComments: PostComment[]) => set({ postComments }),
            setIndustryPosts: (industryPosts: Post[]) => set({ industryPosts: { data: industryPosts, loading: false, error: '' } }),
            setCommunityPosts: (communityPosts: Post[]) => set({ communityPosts: { data: communityPosts, loading: false, error: '' } }),
            // fetch methods
            fetchPosts: async () => {
                const { posts } = get();
                set({ posts: { ...posts, loading: true, error: '' } });
                try {
                    const response = await fetchCommunityPosts();
                    set({ posts: { data: response || [], loading: false, error: '' } });
                } catch (error) {
                    set({ posts: { ...posts, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch posts' } });
                }
            },
            fetchPinPosts: async () => {
                const pinPosts = get().pinPosts;
                set({ pinPosts: { ...pinPosts, loading: true, error: '' } });
                // Fetch pinned posts
                try {
                    const response = await fetchCommunityPosts({ is_pin: 1 });
                    set({ pinPosts: { data: response || [], loading: false, error: '' } });
                } catch (error) {
                    set({ pinPosts: { ...pinPosts, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch pinned posts' } });
                }
            },
            fetchMyPosts: async () => {
                const myPosts = get().myPosts;
                // Fetch my posts
                set({ myPosts: { ...myPosts, loading: true, error: '' } });
                try {
                    const response = await fetchCommunityPosts({ my_post: 1 });
                    set({ myPosts: { data: response || [], loading: false, error: '' } });
                } catch (error) {
                    set({ myPosts: { ...myPosts, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch my posts' } });
                }
            },
            likeDislikePost: async (post: Post) => {
                const { posts, pinPosts, myPosts, communityPosts, industryPosts } = get();
                const postId = post?.repost_id || post.id;
                const user_liked = post?.repost_id ? post.is_user_repost_like : post.user_liked;

                if (!postId) {
                    set({ error: 'Post ID is required to like or unlike a post' });
                    return;
                }
                try {
                    await likePost(post);
                    // Update all posts state - posts, pinPosts, and myPosts if repost_id then update repost_like, else update like
                    const updatePosts = (postList: Post[]) => postList.map(p =>
                        p.id === postId || p.repost_id === postId
                            ? {
                                ...p,
                                user_liked: post?.repost_id ? post?.user_liked : (user_liked == 0 ? 1 : 0),
                                like_count: post?.repost_id ? p.like_count : (user_liked ? (p.like_count || 0) - 1 : (p.like_count || 0) + 1),
                                // repost fields
                                repost_like: post?.repost_id ? (user_liked ? (p.repost_like || 0) - 1 : (p.repost_like || 0) + 1) : p.repost_like,
                                is_user_repost_like: post?.repost_id ? !user_liked : p.is_user_repost_like,
                            } : p
                    );

                    set({
                        posts: { data: updatePosts(posts?.data ?? []), loading: false, error: '' },
                        pinPosts: { data: updatePosts(pinPosts?.data ?? []), loading: false, error: '' },
                        myPosts: { data: updatePosts(myPosts?.data ?? []), loading: false, error: '' },
                        communityPosts: { data: updatePosts(communityPosts?.data ?? []), loading: false, error: '' },
                        industryPosts: { data: updatePosts(industryPosts?.data ?? []), loading: false, error: '' },
                    });

                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to like post' });
                }
            },
            fetchIndustryPosts: async (org_ids: string) => {
                const { industryPosts } = get();
                set({ industryPosts: { ...industryPosts, loading: true, error: '' } });
                // Fetch industry posts
                try {
                    const response = await fetchCommunityPosts({ org_id: org_ids });
                    set({ industryPosts: { data: response || [], loading: false, error: '' } });
                } catch (error) {
                    set({ industryPosts: { ...industryPosts, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch industry posts' } });
                }
            },
            fetchCommunityPosts: async (communityId: string) => {
                const { communityPosts } = get();
                set({ communityPosts: { ...communityPosts, loading: true, error: '' } });
                // Fetch community posts
                try {
                    const response = await fetchCommunityPosts({ category_id: communityId });
                    set({ communityPosts: { data: response || [], loading: false, error: '' } });
                } catch (error) {
                    set({ communityPosts: { ...communityPosts, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch community posts' } });
                }
            },
            deletePost: async (postId: number) => {
                if (!postId) {
                    set({ error: 'Post ID is required to delete a post' });
                    return;
                }

                try {
                    await deleteCommunityPost(postId);
                    // Remove the post from all states - posts, pinPosts, and myPosts
                    const { posts, pinPosts, myPosts, industryPosts, communityPosts } = get();
                    set({
                        posts: { data: posts?.data?.filter(post => post.id !== postId), loading: false, error: '' },
                        pinPosts: { data: pinPosts?.data?.filter(post => post.id !== postId), loading: false, error: '' },
                        myPosts: { data: myPosts?.data?.filter(post => post.id !== postId), loading: false, error: '' },
                        industryPosts: { data: industryPosts?.data?.filter(post => post.id !== postId), loading: false, error: '' },
                        communityPosts: { data: communityPosts?.data?.filter(post => post.id !== postId), loading: false, error: '' },
                        error: '',
                    });

                    // If the selected post is the one being deleted, clear it
                    const { selectedPost } = get();
                    if (selectedPost && selectedPost.id === postId) {
                        set({ selectedPost: null });
                    }
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to delete post' });
                }
            },
            fetchPostComments: async (postId: number) => {
                const { setPostComments } = get();
                if (!postId) return;
                try {
                    const response = await fetchPostComments(postId);
                    console.log('Fetched comments:', response);
                    setPostComments(response || []);
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to fetch post comments' });
                }
            },
            sendComment: async (postId: number, content: string, type?: boolean) => {
                if (!postId) return;
                try {
                    if (!content.trim()) {
                        set({ error: 'Comment content cannot be empty' });
                        return;
                    }

                    await sendComment(postId, content, type);

                    // increment comment count in all posts state - posts, pinPosts, and myPosts and selectedPost if it exists
                    const { posts, pinPosts, myPosts, selectedPost, communityPosts, industryPosts } = get();
                    const updatePosts = (postList: Post[]) => postList.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                comment_count: post.comment_count + 1,
                            } : post
                    );

                    set({
                        posts: { data: updatePosts(posts?.data ?? []), loading: false, error: '' },
                        pinPosts: { data: updatePosts(pinPosts?.data ?? []), loading: false, error: '' },
                        myPosts: { data: updatePosts(myPosts?.data ?? []), loading: false, error: '' },
                        communityPosts: { data: updatePosts(communityPosts?.data ?? []), loading: false, error: '' },
                        industryPosts: { data: updatePosts(industryPosts?.data ?? []), loading: false, error: '' },
                        selectedPost: selectedPost ? {
                            ...selectedPost,
                            comment_count: selectedPost.comment_count + 1,
                        } : null,
                        error: '',
                    });

                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to send comment' });
                }
            },
            repost: async (postId: number, data: { joy_content_id: number; description: string; category_id: string }) => {
                const { posts, pinPosts, myPosts, selectedPost, fetchPosts, communityPosts, industryPosts } = get();
                try {
                    await repostPost(data);
                    // change the repost_count in all posts state - posts, pinPosts, and myPosts and selectedPost if it exists
                    const updatePosts = (postList: Post[]) => postList.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                repost_count: post.repost_count + 1,
                            } : post
                    );

                    set({
                        posts: { data: updatePosts(posts?.data ?? []), loading: false, error: '' },
                        pinPosts: { data: updatePosts(pinPosts?.data ?? []), loading: false, error: '' },
                        myPosts: { data: updatePosts(myPosts?.data ?? []), loading: false, error: '' },
                        communityPosts: { data: updatePosts(communityPosts?.data ?? []), loading: false, error: '' },
                        industryPosts: { data: updatePosts(industryPosts?.data ?? []), loading: false, error: '' },
                        selectedPost: selectedPost ? {
                            ...selectedPost,
                            repost_count: selectedPost.repost_count + 1,
                        } : null,
                    });

                    // fetch updated again
                    fetchPosts();
                    set({ error: '' });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to repost' });
                }
            },
            updateRepost: async (repostId: number, data: { description: string; category_id: string; status: string }) => {
                const { posts, pinPosts, myPosts, selectedPost, fetchPosts, communityPosts, industryPosts } = get();
                try {
                    await updateRepostPost(repostId, data);


                    const updatePosts = (postList: Post[]) =>
                        postList.map(post =>
                            post.id === repostId
                                ? {
                                    ...post,

                                }
                                : post
                        );

                    set({
                        posts: { data: updatePosts(posts?.data ?? []), loading: false, error: '' },
                        pinPosts: { data: updatePosts(pinPosts?.data ?? []), loading: false, error: '' },
                        myPosts: { data: updatePosts(myPosts?.data ?? []), loading: false, error: '' },
                        selectedPost: selectedPost?.id === repostId ? { ...selectedPost } : selectedPost,
                        communityPosts: { data: updatePosts(communityPosts?.data ?? []), loading: false, error: '' },
                        industryPosts: { data: updatePosts(industryPosts?.data ?? []), loading: false, error: '' },
                    });

                    fetchPosts();
                    set({ error: '' });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update repost',
                    });
                }
            },

        }),
        {
            name: 'posts-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);