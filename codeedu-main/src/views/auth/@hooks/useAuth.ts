import type { SignUpTokenApiResponse } from "@/@types/auth";
import { fetchSignUpTokenData } from "@/services/auth/AccountService";
import { useQuery } from "@tanstack/react-query";

export const userSignUpData = (token: string | null) => {
    const hasToken = Boolean(token && String(token).trim().length > 0);
    return useQuery<SignUpTokenApiResponse>({
        queryKey: ['signUpTokenData', token],
        queryFn: async () => {
            if (!token) throw new Error('No token provided');
            const res = await fetchSignUpTokenData(token);
            return res;
        },
        enabled: hasToken,
        retry: 1,
        /** Always refetch on mount so post–mobile-verify navigation sees fresh `/signup-lead-data`. */
        staleTime: 0,
        refetchOnMount: 'always',
        meta: {
            persist: false,
        },
    });
};