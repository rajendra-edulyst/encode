import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IndustryPost, Poll, Post, PostComment, Event as CommunityEvent } from "../types/community";
import { fetchAdvertisements, fetchEvent, fetchIndustryLatestPosts, fetchPinedPosts, fetchPollPosts, fetchPostComments, fetchPosts } from "../services/CommunityService";
import { fetchJobs } from "@/services/learner/OpportunitieService";
import { Program } from "@/@types/learner/Jobs";
import { likePost } from "../services/PostService";
import { PollResult } from "../types/poll";
import { getPollAttemptedSurvey, getPollResults } from "../services/PollService";
import { Advertisement } from "@/@types/learner/advtisements";

export const usePosts = (params?: URLSearchParams) => {
    return useQuery<Array<Post>>({
        queryKey: ['posts', params],
        queryFn: async () => {
            const res = await fetchPosts(params);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const usePinnedPost = () => {
    return useQuery<Array<Post>>({
        queryKey: ['pinnedPosts'],
        queryFn: async () => {
            const res = await fetchPinedPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};



export const usePostComments = (postId: number | string) => {
    return useQuery<Array<PostComment>>({
        queryKey: ['postComments', postId],
        queryFn: async () => {
            const res = await fetchPostComments(postId);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useOpinionPolls = () => {
    return useQuery<Array<Poll>>({
        queryKey: ['opinionPolls'],
        queryFn: async () => {
            const res = await fetchPollPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
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

// usePollResult
export const useOpinionPollResult = (pollId: number, enabled: boolean = true) => {
    return useQuery<PollResult>({
        queryKey: ['opinionPollResult', pollId],
        queryFn: async () => {
            const res = await getPollResults(pollId);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!pollId && pollId > 0 && enabled,
    });
};

import { SurveyItem } from "../types/survey";

export const usePollAttemptedSurvey = (type: string) => {
    return useQuery<SurveyItem[]>({
        queryKey: ['pollAttemptedSurvey', type],
        queryFn: async () => {
            const res = await getPollAttemptedSurvey(type);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// post like 

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (post: Post) => {
            return await likePost(post);
        },
        onMutate: async (post: Post) => {
            // Cancel outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            // Snapshot previous values
            const previousPosts = queryClient.getQueryData(["posts"]);

            // Determine current liked state
            const isRepost = post.repost_id != null;
            const currentlyLiked = isRepost ? post.is_user_repost_like : !!post.user_liked;
            const nextLiked = !currentlyLiked;

            // Optimistically update posts list
            queryClient.setQueryData<Post[]>(["posts"], (oldData) => {
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
            });

            return { previousPosts };
        },
        onError: (err, post, context) => {
            // Rollback to previous values on error
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSettled: () => {
            // We've removed the manual invalidation here to allow the optimistic 
            // update to persist. The state will sync naturally during the next 
            // background refetch.
        },
    });
};


// Emerging Industries - useEmergingIndustries()

export const useIndustryLatestPosts = () => {
    return useQuery<Array<IndustryPost>>({
        queryKey: ['industryposts'],
        queryFn: async () => {
            const res = await fetchIndustryLatestPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

//events and design jams

export const useEvents = (ongoing_date?: string | null, is_assigned?: number) => {
    return useQuery<Array<CommunityEvent>>({
        queryKey: ['events', ongoing_date, is_assigned],
        queryFn: async () => {
            const res = await fetchEvent(ongoing_date, is_assigned);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usejobs = () => {
    return useQuery<Array<Program>>({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await fetchJobs();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
