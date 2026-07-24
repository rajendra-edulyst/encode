import { FunctionalDomain } from "@/@types/functionalDomain";
import { fetchFunctionalDomains } from "@/services/FunctionalDomainService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * Hook to fetch all available functional domains
 * @returns Query result with functional domains data, loading state, and error
 * 
 * @example
 * const { data: domains = [], isLoading, error } = useFunctionalDomains();
 */
export const useFunctionalDomains = (): UseQueryResult<FunctionalDomain[], Error> => {
    return useQuery<FunctionalDomain[], Error>({
        queryKey: ['functionalDomains'],
        queryFn: async () => {
            const data = await fetchFunctionalDomains();
            return data ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 10, // 10 minutes - domains don't change often
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};
