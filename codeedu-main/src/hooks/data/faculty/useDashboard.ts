import { StatCount } from "@/@types/faculty/dashboard";
import { fetchStatCount } from "@/services/faculty/DashboardService";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStatCount = (params?: URLSearchParams) => {
    return useQuery<StatCount>({
        queryKey: ['dashboard-stat-count', params?.toString()],
        queryFn: async () => {
            const res = await fetchStatCount();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
