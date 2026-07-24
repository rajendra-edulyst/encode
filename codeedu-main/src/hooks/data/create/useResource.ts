import { Resource } from "@/@types/learner/Courses";
import { fetchMyResource, fetchRecommendedResources, fetchResource } from "@/services/create/ResourceService"
import { useQuery } from "@tanstack/react-query";

export const useResource = (params?: URLSearchParams, enabled: boolean = true) => {
    return useQuery<Array<Resource>>({
        queryKey: ["resource", params?.toString()],
        queryFn: async () => {
            const res = await fetchResource(params);
            return res;
        },
        enabled,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useMyResource = (params?: URLSearchParams) => {
    return useQuery<Array<Resource>>({
        queryKey: ["myresource", params?.toString()],
        queryFn: async () => {
            const res = await fetchMyResource(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// fetchRecommendedResources
export const useRecommendedResources = (params?: URLSearchParams) => {
    return useQuery<Array<Resource>>({
        queryKey: ["recommended-resources", params?.toString()],
        queryFn: async () => {
            const res = await fetchRecommendedResources(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};