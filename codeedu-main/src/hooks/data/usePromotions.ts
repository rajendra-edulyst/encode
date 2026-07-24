import { Promotion } from "@/@types/promotions";
import { fetchPromotions } from "@/services/PromotionService";
import { useQuery } from "@tanstack/react-query";

export const usePromotions = (type?: string) => {
    return useQuery<Promotion[]>({
        queryKey: ['promotions', type],
        queryFn: async () => {
            const res = await fetchPromotions(type);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
