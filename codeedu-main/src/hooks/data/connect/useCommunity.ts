import { CommunityCategory, CommunityMembersApiResponse, OrgCommunities } from "@/@types/connect/community";
import { csvMapCommunityUsers, fetchCommunityDetails, fetchCommunityMembers, fetchOrgCommunities, joinCommunity, leaveCommunity, mapCommunityUsers, reportCommunity, muteCommunity, deleteCommunity } from "@/services/connect/CommunityService";
import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

// ==================== QUERY KEY FACTORY ====================

/**
 * Centralized query key factory for community-related queries
 * Helps maintain consistency and enables easier cache management
 */
export const communityKeys = {
    all: ['communities'] as const,
    lists: () => [...communityKeys.all, 'list'] as const,
    list: (params?: URLSearchParams) => [...communityKeys.lists(), { params: params?.toString() }] as const,
    details: () => [...communityKeys.all, 'detail'] as const,
    detail: (id: number) => [...communityKeys.details(), id] as const,
    members: (communityId: number) => [...communityKeys.all, 'members', communityId] as const,
} as const;

// ==================== TYPES ====================

interface JoinCommunityVariables {
    id: number;
}

interface LeaveCommunityVariables {
    id: number;
}

interface ReportCommunityVariables {
    communityId: number;
    reason: string;
}

interface MuteCommunityVariables {
    communityId: number;
}

interface DeleteCommunityVariables {
    communityId: number;
}

interface MapCommunityUsersVariables {
    categoryId: number;
}

interface CsvMapCommunityUsersVariables {
    categoryId: number;
    file: File;
}

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch organization communities with optional filters
 * @param params - Optional URL search parameters
 * @returns Query result with communities data, loading state, and error
 */
export const useOrgCommunities = (params?: URLSearchParams): UseQueryResult<Array<OrgCommunities>, Error> => {
    return useQuery<Array<OrgCommunities>, Error>({
        queryKey: communityKeys.list(params),
        queryFn: async () => {
            const res = await fetchOrgCommunities(params);
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

// ==================== MUTATION HOOKS ====================

/**
 * Hook to join a community
 * @returns Mutation result with mutate function, loading state, and error
 */
export const useJoinCommunity = (): UseMutationResult<void, Error, JoinCommunityVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, JoinCommunityVariables>({
        mutationFn: async ({ id }: JoinCommunityVariables) => {
            await joinCommunity(id);
        },
        onSuccess: () => {
            toast.success('Successfully joined the community!', {
                description: 'You can now participate in discussions and view posts.',
            });

            // Invalidate all community queries to refresh data
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useJoinCommunity] Error:', error);
            toast.error('Failed to join community', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Hook to leave a community
 * @returns Mutation result with mutate function, loading state, and error
 */
export const useLeaveCommunity = (): UseMutationResult<void, Error, LeaveCommunityVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, LeaveCommunityVariables>({
        mutationFn: async ({ id }: LeaveCommunityVariables) => {
            await leaveCommunity(id);
        },
        onSuccess: () => {
            toast.success('Successfully left the community', {
                description: 'You will no longer see posts from this community.',
            });

            // Invalidate all community queries to refresh data
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useLeaveCommunity] Error:', error);
            toast.error('Failed to leave community', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Hook to report a community
 * @returns Mutation result with mutate function, loading state, and error
 */
export const useReportCommunity = (): UseMutationResult<void, Error, ReportCommunityVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, ReportCommunityVariables>({
        mutationFn: async ({ communityId, reason }: ReportCommunityVariables) => {
            await reportCommunity(communityId, reason);
        },
        onSuccess: () => {
            toast.success('Community reported successfully', {
                description: 'Thank you for helping keep our community safe.',
            });

            // Invalidate all community queries to refresh data
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useReportCommunity] Error:', error);
            toast.error('Failed to report community', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Hook to mute or unmute a community
 * @returns Mutation result with mutate function, loading state, and error
 */
export const useMuteCommunity = (): UseMutationResult<void, Error, MuteCommunityVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, MuteCommunityVariables>({
        mutationFn: async ({ communityId }: MuteCommunityVariables) => {
            await muteCommunity(communityId);
        },
        onSuccess: () => {
            toast.success('Community mute status updated successfully', {
                description: 'Your notification preferences have been updated.',
            });

            // Invalidate all community queries to refresh data
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useMuteCommunity] Error:', error);
            toast.error('Failed to update mute status', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Hook to delete a community (admin only)
 * @returns Mutation result with mutate function, loading state, and error
 */
export const useDeleteCommunity = (): UseMutationResult<void, Error, DeleteCommunityVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteCommunityVariables>({
        mutationFn: async ({ communityId }: DeleteCommunityVariables) => {
            await deleteCommunity(communityId);
        },
        onSuccess: () => {
            toast.success('Community deleted successfully', {
                description: 'The community has been permanently removed.',
            });

            // Invalidate all community queries to refresh data
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useDeleteCommunity] Error:', error);
            toast.error('Failed to delete community', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Map all learners from the organization to the selected community (POST map_user).
 */
export const useMapCommunityUsers = (): UseMutationResult<void, Error, MapCommunityUsersVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, MapCommunityUsersVariables>({
        mutationFn: async ({ categoryId }: MapCommunityUsersVariables) => {
            await mapCommunityUsers(categoryId);
        },
        onSuccess: () => {
            toast.success('Users mapped successfully', {
                description: 'Learners from your organization have been mapped to this community.',
            });
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useMapCommunityUsers] Error:', error);
            toast.error('Failed to map users', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Map users from CSV upload (POST csv_map_user).
 */
export const useCsvMapCommunityUsers = (): UseMutationResult<void, Error, CsvMapCommunityUsersVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, CsvMapCommunityUsersVariables>({
        mutationFn: async ({ categoryId, file }: CsvMapCommunityUsersVariables) => {
            await csvMapCommunityUsers(categoryId, file);
        },
        onSuccess: () => {
            toast.success('CSV processed successfully', {
                description: 'Users from the CSV have been mapped to this community.',
            });
            queryClient.invalidateQueries({ queryKey: communityKeys.all });
        },
        onError: (error: Error) => {
            console.error('[useCsvMapCommunityUsers] Error:', error);
            toast.error('Failed to upload CSV', {
                description: error.message || 'Please try again later.',
            });
        },
    });
};

/**
 * Hook to get details of a specific community by ID
 * @returns Query result with data, loading state, and error
 */

export const useCommunityDetails = (id: number): UseQueryResult<CommunityCategory, Error> => {
    return useQuery<CommunityCategory, Error>({
        queryKey: communityKeys.detail(id),
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('category_id', id.toString());
            const res = await fetchCommunityDetails(params);
            return res;
        },
        enabled: !!id,
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Hook to get community joined members by community ID
 * @returns Query result with data, loading state, and error
 */

export const useCommunityMembers = (communityId: number): UseQueryResult<CommunityMembersApiResponse, Error> => {
    return useQuery<CommunityMembersApiResponse, Error>({
        queryKey: communityKeys.members(communityId),
        queryFn: async () => {
            const res = await fetchCommunityMembers(communityId);
            return res;
        },
        enabled: !!communityId,
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}