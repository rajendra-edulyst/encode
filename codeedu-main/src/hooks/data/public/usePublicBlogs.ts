import { useQuery } from '@tanstack/react-query';
import { fetchPublicBlogs } from '@/services/learner/SocialService';

export const usePublicBlogs = () => {
    return useQuery({
        queryKey: ['publicBlogs'],
        queryFn: fetchPublicBlogs,
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    });
};
