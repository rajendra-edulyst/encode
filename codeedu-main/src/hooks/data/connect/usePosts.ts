import { Advertisement } from "@/@types/connect/advertisement";
import { PollResult, Post, PostComment, Suggestion, SavePollResponseData, SavePollResponseResult, LikedUser } from "@/@types/connect/posts";
import {
    createRepost,
    fetchPostComments,
    fetchPosts,
    fetchSuggestions,
    likePost,
    RepostData,
    sendComment,
    addCommunityPost,
    updateCommunityPost,
    CreatePostResponse,
    UpdatePostResponse,
    fetchPostDetails,
    getPollResults,
    savePollResponse,
    fetchAdvertisements,
    deletePost,
    updateRepost,
    deleteRepost,
    fetchLikedUsers
} from "@/services/connect/PostService";
import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

// QUERY KEYS
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (params?: URLSearchParams) => [...postKeys.lists(), params?.toString()] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: number) => [...postKeys.details(), id] as const,
    comments: (postId: number | string) => [...postKeys.all, 'comments', postId] as const,
    likedUsers: (postId: number | string, type: 'repost' | 'contents') => [...postKeys.all, 'liked-users', postId, type] as const,
    suggestions: (query: string) => [...postKeys.all, 'suggestions', query] as const,
    polls: () => [...postKeys.all, 'polls'] as const,
    pollResults: (pollId: number) => [...postKeys.polls(), 'result', pollId] as const,
};

export type UsePostsOptions = {
    /**
     * Poll interval in ms while the document tab is visible.
     * Omit to disable polling (default).
     */
    refetchIntervalMs?: number;
};

// QUERY HOOKS

/**
 * Fetches posts with optional filtering parameters
 * @param params - URLSearchParams for filtering posts
 * @returns UseQueryResult with posts array
 */
export const usePosts = (
    params?: URLSearchParams,
    options?: UsePostsOptions
): UseQueryResult<Post[], Error> => {
    const intervalMs = options?.refetchIntervalMs;
    return useQuery<Post[], Error>({
        queryKey: postKeys.list(params),
        queryFn: async () => {
            const res = await fetchPosts(params);
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchInterval:
            typeof intervalMs === 'number' && intervalMs > 0
                ? () =>
                      typeof document !== 'undefined' && document.visibilityState === 'hidden'
                          ? false
                          : intervalMs
                : false,
        refetchIntervalInBackground: false,
    });
};

/**
 * Fetches detailed information for a specific post
 * @param postId - The ID of the post
 * @returns UseQueryResult with post details
 */
export const usePostDetails = (postId: string | undefined): UseQueryResult<Post | null, Error> => {
    const idNum = postId ? Number(postId) : NaN;
    return useQuery<Post | null, Error>({
        /** Avoid `NaN` in the key when `postId` is omitted (e.g. non-blog cards). */
        queryKey: postKeys.detail(Number.isFinite(idNum) ? idNum : -1),
        queryFn: async () => {
            const res = await fetchPostDetails(postId);
            return res;
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
        enabled: !!postId && Number.isFinite(idNum),
    });
}


/**
 * Fetches comments for a specific post
 * @param postId - The ID of the post
 * @param enabled - Whether the query should run
 * @returns UseQueryResult with comments array
 */
export const useFetchPostComments = (
    postId: number | string,
    enabled: boolean = true
): UseQueryResult<PostComment[], Error> => {
    return useQuery<PostComment[], Error>({
        queryKey: postKeys.comments(postId),
        queryFn: async () => {
            const res = await fetchPostComments(postId);
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
        enabled: !!postId && enabled,
    });
};

export const useFetchLikedUsers = (
    post: { id: number; repost_id?: number | null },
    enabled: boolean = true
): UseQueryResult<LikedUser[], Error> => {
    const isRepost = post?.repost_id != null;
    const contentId = isRepost ? post.repost_id : post.id;
    return useQuery<LikedUser[], Error>({
        queryKey: postKeys.likedUsers(contentId || 0, isRepost ? 'repost' : 'contents'),
        queryFn: async () => {
            const res = await fetchLikedUsers(post);
            return res ?? [];
        },
        retry: 1,
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        refetchOnMount: 'always',
        enabled: !!contentId && enabled,
    });
};

/**
 * Fetches search suggestions based on query
 * @param query - Search query string
 * @param enabled - Whether the query should run
 * @returns UseQueryResult with suggestions array
 */
export const useFetchSuggestions = (
    query: string,
    enabled: boolean = true
): UseQueryResult<Suggestion[], Error> => {
    return useQuery<Suggestion[], Error>({
        queryKey: postKeys.suggestions(query),
        queryFn: async () => {
            const res = await fetchSuggestions(query);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!query && enabled,
    });
};

// MUTATION HOOKS

/**
 * Hook for liking/unliking a post with optimistic updates
 * @returns UseMutationResult for like/unlike operation
 */
export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (post: Post) => {
            return await likePost(post);
        },
        onMutate: async (post: Post) => {
            // Cancel outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: postKeys.lists() });
            await queryClient.cancelQueries({ queryKey: postKeys.detail(post.id) });

            // Snapshot previous values
            const previousPosts = queryClient.getQueriesData({ queryKey: postKeys.lists() });
            const previousPostDetail = queryClient.getQueryData(postKeys.detail(post.id));

            // Determine if it's a repost for correct field toggling
            const isRepost = post.repost_id != null;
            const currentlyLiked = isRepost
                ? (post.is_user_repost_like === true || (post.is_user_repost_like as any) === 1 || String(post.is_user_repost_like) === '1' || String(post.is_user_repost_like) === 'true')
                : (post.user_liked === 1 || (post.user_liked as any) === true || String(post.user_liked) === '1' || String(post.user_liked) === 'true');
            const nextLiked = !currentlyLiked;

            // Optimistically update posts list
            queryClient.setQueriesData<Post[]>(
                { queryKey: postKeys.lists() },
                (oldData) => {
                    if (!oldData) return oldData;

                    return oldData.map((p) => {
                        if (p.id === post.id) {
                            return {
                                ...p,
                                user_liked: nextLiked ? 1 : 0,
                                is_user_repost_like: nextLiked,
                                like_count: currentlyLiked
                                    ? Math.max(0, p.like_count - 1)
                                    : p.like_count + 1,
                                repost_like: isRepost
                                    ? (currentlyLiked 
                                        ? Math.max(0, (p.repost_like ?? 0) - 1) 
                                        : (p.repost_like ?? 0) + 1)
                                    : p.repost_like
                            };
                        }
                        return p;
                    });
                }
            );

            // Optimistically update individual post detail
            queryClient.setQueryData<Post>(
                postKeys.detail(post.id),
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        user_liked: nextLiked ? 1 : 0,
                        is_user_repost_like: nextLiked,
                        like_count: currentlyLiked
                            ? Math.max(0, oldData.like_count - 1)
                            : oldData.like_count + 1,
                        repost_like: isRepost
                            ? (currentlyLiked 
                                ? Math.max(0, (oldData.repost_like ?? 0) - 1) 
                                : (oldData.repost_like ?? 0) + 1)
                            : oldData.repost_like
                    };
                }
            );

            return { previousPosts, previousPostDetail };
        },
        onError: (err, post, context) => {
            // Rollback to previous values on error
            if (context?.previousPosts) {
                context.previousPosts.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }

            // Rollback post detail
            if (context?.previousPostDetail) {
                queryClient.setQueryData(postKeys.detail(post.id), context.previousPostDetail);
            }

            toast.error("Error", {
                description: err instanceof Error ? err.message : "Failed to update like status",
            });
        },
        onSettled: (_, __, post) => {
            // We've removed the refetch here to avoid the backend delay causing 
            // the UI to revert to old data. The optimistic update handles the UI 
            // state, and it will sync naturally on the next background refetch.
            
            const isRepost = post.repost_id != null;
            const contentId = isRepost ? post.repost_id : post.id;
            if (contentId != null && contentId !== 0) {
                queryClient.invalidateQueries({
                    queryKey: postKeys.likedUsers(contentId, isRepost ? 'repost' : 'contents'),
                });
            }
        },
    });
};

/**
 * Hook for sending a comment on a post
 * @returns UseMutationResult for comment operation
 */
export const useSendComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ post, content }: { post: Post; content: string }) => {
            return await sendComment(post, content);
        },
        onSuccess: (_, { post }) => {
            // Invalidate comment thread for this post (reposts comment on original id)
            const commentThreadId = post.repost_id || post.id;
            queryClient.invalidateQueries({ queryKey: postKeys.comments(commentThreadId) });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });

            toast.success("Comment posted successfully");
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to post comment");
        },
    });
};

/**
 * Hook for creating a repost (re-Buzz)
 * @returns UseMutationResult for repost operation
 */
export const useCreateRepost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RepostData) => {
            return await createRepost(data);
        },
        onSuccess: async (response) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate posts and public blogs
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);

            toast.success(response?.data?.message || "Post re-buzzed successfully");
        },
        // Don't handle error here, let the component handle it
    });
};

/**
 * Hook for UPDATING a repost (re-Buzz)
 * @returns UseMutationResult for repost operation
 */
export const useUpdateRepost = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RepostData) => {
            return await updateRepost(data, id);
        },
        onSuccess: async (response) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate posts and public blogs
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);

            toast.success(response?.data?.message || "Post re-buzzed successfully");
        },
        // Don't handle error here, let the component handle it
    });
};

/**
 * Hook for creating a new community post
 * @returns UseMutationResult for post creation
 */
export const useAddCommunityPost = (): UseMutationResult<CreatePostResponse, Error, FormData> => {
    const queryClient = useQueryClient();

    return useMutation<CreatePostResponse, Error, FormData>({
        mutationFn: async (data: FormData) => {
            return await addCommunityPost(data);
        },
        onSuccess: async (response) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate posts and public blogs query to show new post
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);

            toast.success(response?.data?.message || "Post created successfully");
        },
        // Errors: callers (e.g. Add Buzz) toast with the server message via mutate(..., { onError })
    });
};

/**
 * Hook for updating an existing community post
 * @returns UseMutationResult for post update
 */
export const useUpdateCommunityPost = (): UseMutationResult<
    UpdatePostResponse,
    Error,
    { postId: string; data: FormData }
> => {
    const queryClient = useQueryClient();

    return useMutation<UpdatePostResponse, Error, { postId: string; data: FormData }>({
        mutationFn: async ({ postId, data }) => {
            return await updateCommunityPost(postId, data);
        },
        onSuccess: async (response, { postId }) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate specific post and posts list
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);

            toast.success(response?.data?.message || "Post updated successfully");
        },
    });
};


/**
 * Hook for fetching opinion poll results
 * @param pollId - The poll ID to fetch results for
 * @returns UseQueryResult with poll results
 */
export const useOpinionPollResult = (pollId: number, enabled: boolean = true): UseQueryResult<PollResult, Error> => {
    return useQuery<PollResult, Error>({
        queryKey: postKeys.pollResults(pollId),
        queryFn: async () => {
            const res = await getPollResults(pollId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!pollId && pollId > 0 && enabled,
    });
};

/**
 * Hook for saving poll response
 * @returns UseMutationResult for saving poll response
 */
export const useSavePollResponse = (): UseMutationResult<SavePollResponseResult, Error, SavePollResponseData> => {
    const queryClient = useQueryClient();

    return useMutation<SavePollResponseResult, Error, SavePollResponseData>({
        mutationFn: async (data) => {
            return await savePollResponse(data);
        },
        onSuccess: (response, variables) => {
            // Invalidate poll results to show updated results
            const pollId = parseInt(variables.content_id);
            queryClient.invalidateQueries({ queryKey: postKeys.pollResults(pollId) });

            // Invalidate polls list to update attempted status
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.polls() });

            toast.success(response?.message || "Response saved successfully!");
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : "Failed to save response";
            toast.error(errorMessage);
        },
    });
};


export const useAdvertisement = () => {
    return useQuery<Array<Advertisement>>({
        queryKey: ['advertisement'],
        queryFn: async () => {
            const res = await fetchAdvertisements();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook for deleting a post
 * @returns UseMutationResult for post deletion
 */
export const useDeletePost = (): UseMutationResult<string, Error, number> => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, number>({
        mutationFn: async (postId: number) => {
            return await deletePost(postId);
        },
        onSuccess: async (message, postId) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate posts and public blogs
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);

            toast.success(message || "Post deleted successfully");
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to delete post");
        },
    });
};


/**
 * Hook for deleting a repost
 * @returns UseMutationResult for repost deletion
 */
export const useDeleteRepost = (): UseMutationResult<string, Error, number> => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, number>({
        mutationFn: async (postId: number) => {
            return await deleteRepost(postId);
        },
        onSuccess: async (message, postId) => {
            // Avert database write lag and ensure data is committed
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Invalidate posts and public blogs
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
                queryClient.invalidateQueries({ queryKey: ['publicBlogs'] }),
            ]);
            toast.success(message || "Post deleted successfully");
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to delete post");
        },
    });
};
