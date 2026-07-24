import { Post } from "@/@types/learner/community";
import { fetchAnnouncement } from "@/services/public/CommunityService";
import { useQuery } from "@tanstack/react-query";

export const useAnnouncements = () => {
    return useQuery<Array<Post>>({
        queryKey: ['announcements'],
        queryFn: async () => {
            const res = await fetchAnnouncement();
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
