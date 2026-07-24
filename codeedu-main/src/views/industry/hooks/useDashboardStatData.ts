import { useQuery } from '@tanstack/react-query';
import { fetchStatData } from '../services/DashboardService';
import { StatData } from '../@types/dashboard';

export const useDashboardStatData = () => {
    return useQuery<StatData>({
        queryKey: ['dashboardStatData'],
        queryFn: async () => {
            const res = await fetchStatData();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
