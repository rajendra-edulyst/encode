import { useQuery } from "@tanstack/react-query";
import { OrgCommunities } from "../types/community";
import { fetchPopularOrgCommunity } from "../services/CommunityService";


export const useOrgCommunities = (self_joined?: number) => {
    return useQuery<Array<OrgCommunities>>({
        queryKey: ['posts', self_joined],
        queryFn: async () => {
            const res = await fetchPopularOrgCommunity(self_joined);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};