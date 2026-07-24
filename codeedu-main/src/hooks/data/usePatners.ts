import { Patners } from "@/@types/settings";
import { fetchExternalPartners } from "@/services/patners";
import { useQuery } from "@tanstack/react-query";

export const usePatners = () => {
    return useQuery<Patners>({
        queryKey: ['patners'],
        queryFn: async () => {
            const res = await fetchExternalPartners();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


// patners stat count  data fetch logic