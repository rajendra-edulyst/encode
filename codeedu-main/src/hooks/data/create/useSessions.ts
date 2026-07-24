import { LiveClass } from "@/@types/learner/MyClasses";
import { fetchLiveClasses } from "@/services/learner/MyClassService";
import { useQuery } from "@tanstack/react-query";


export const useLiveClasses = () => {
    return useQuery<Array<LiveClass>>({
        queryKey: ['liveClasses'],
        queryFn: async () => {
            const res = await fetchLiveClasses();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
