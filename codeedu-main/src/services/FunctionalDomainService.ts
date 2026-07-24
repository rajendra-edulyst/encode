import { FunctionalDomain, FunctionalDomainApiResponse } from "@/@types/functionalDomain";
import ApiService from "./ApiService";

/**
 * Centralized error handler for service calls
 * @param error - Error object
 * @param operation - Operation name for context
 * @throws Error with descriptive message
 */
function handleServiceError(error: unknown, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`[FunctionalDomainService] ${operation} failed:`, error);
    throw new Error(`${operation} failed: ${errorMessage}`);
}

/**
 * Fetches all available functional domains
 * @returns Promise resolving to array of functional domains
 * @throws Error if fetch fails
 * 
 * @example
 * const domains = await fetchFunctionalDomains();
 */
export async function fetchFunctionalDomains(): Promise<FunctionalDomain[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<FunctionalDomainApiResponse>({
            url: '/v1/get-functional-domain',
            method: 'get',
        });
        return response?.data ?? [];
    } catch (error) {
        handleServiceError(error, 'Fetch functional domains');
    }
}
