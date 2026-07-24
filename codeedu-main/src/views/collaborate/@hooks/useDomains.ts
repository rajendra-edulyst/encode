import { fetchDomains } from "@/views/common/community/services/CommunityService";
import { Domain } from "@/views/industry/@types/jobs";
import { useQuery } from "@tanstack/react-query";


export const useDomains = () => {
    return useQuery<Array<Domain>>({
        queryKey: ['domains'],
        queryFn: async () => {
            const res = await fetchDomains();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};