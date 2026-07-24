import { Settings } from "@/@types/settings";
import { fetchSettings } from "@/services/SettingsService";
import { useQuery } from "@tanstack/react-query";

export const useSettings = () => {
    return useQuery<Settings>({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await fetchSettings();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
