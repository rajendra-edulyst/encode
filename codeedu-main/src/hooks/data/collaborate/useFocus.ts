import { useQuery } from "@tanstack/react-query";
import { fetchInFocus } from "@/services/collaborate/CollaborateService";
import { InFocus } from "@/@types/collaborate";


export const useInFocus = () => {
    const queryKey = ['inFocus'];
    return useQuery<Array<InFocus>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchInFocus();
            console.log("In Focus Data:", res);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};