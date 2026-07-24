import { FunctionalDomain, Preference, UserProfile, CCIStage1StatusResponse } from "@/@types/getting-started";
import { fetchFunctionalDomains, fetchPreference, fetchUserProfile, saveUserInterest, updateCCIStartDate, UserInterestPayload, fetchCCIStage1Status, fetchPackages, fetchPackagesById, fetchCCITimeslots } from "@/services/getting-started";
import { fetchCCIStage3Status, fetchCCIStage2Status, fetchUserPackageDetails, fetchPackageContentParameters } from "@/services/learner/CCIService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSessionUser } from '@/store/authStore';


export const usePreferences = (params?: URLSearchParams) => {
    const paramsKey = params?.toString() ?? '';
    return useQuery<Preference[]>({
        queryKey: ['preferences', paramsKey],
        queryFn: async () => {
            const data = await fetchPreference(params);
            return data ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePackages = (params?: URLSearchParams) => {
    const paramsKey = params?.toString() ?? '';
    return useQuery<Preference[]>({
        queryKey: ['packages', paramsKey],
        queryFn: async () => {
            const data = await fetchPackages(params);
            return data ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePackageDetails = (id: any) => {
    return useQuery<Preference[]>({
        queryKey: ['packages-details', id],
        queryFn: async () => {
            const data = await fetchPackagesById(id);
            return data ?? null;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePackageParameters = (params?: URLSearchParams) => {
    const paramsKey = params?.toString() ?? '';
    return useQuery<Preference[]>({
        queryKey: ['package-parameters', paramsKey],
        queryFn: async () => {
            const data = await fetchPackageContentParameters();
            return data ?? [];
        }
    })
}

// get-functional-domain' fetchFunctionalDomains
export const useFunctionalDomains = () => {
    return useQuery<FunctionalDomain[]>({
        queryKey: ['functional-domains'],
        queryFn: fetchFunctionalDomains,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// fetchUserProfile
export const useUserProfile = (enabled = true) => {
    return useQuery<UserProfile>({
        queryKey: ['user-profile'],
        queryFn: fetchUserProfile,
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled,
    });
};

// useSaveUserInterest mutation
export const useSaveUserInterest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserInterestPayload) => saveUserInterest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });
};

export const useUpdateCCIStartDate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (date: string) => updateCCIStartDate(date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });
};

export const useCCIStage1Status = (userId?: number | string, enabled = true) => {
    return useQuery<CCIStage1StatusResponse>({
        queryKey: ['cci-stage-1-status', userId],
        queryFn: () => fetchCCIStage1Status(userId),
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled,
    });
};

export const useCCIStage3Status = () => {
    return useQuery<any>({
        queryKey: ['cci-stage-3-status'],
        queryFn: () => fetchCCIStage3Status(),
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCCIStage2Status = () => {
    return useQuery<any>({
        queryKey: ['cci-stage-2-status'],
        queryFn: () => fetchCCIStage2Status(),
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUserPackageDetails = (userId?: number | string) => {
    return useQuery({
        queryKey: ['user-package-details', userId],
        queryFn: () => fetchUserPackageDetails(userId!),
        enabled: !!userId,
        retry: 1,
    });
};

export const useCCITimeslots = () => {
    return useQuery<any>({
        queryKey: ['cci-timeslots'],
        queryFn: fetchCCITimeslots,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};