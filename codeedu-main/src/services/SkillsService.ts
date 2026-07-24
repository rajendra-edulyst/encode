import { Skill, SkillsApiResponse } from "@/@types/skills";
import ApiService from "./ApiService";

/**
 * Centralized error handler for service calls
 * @param error - Error object
 * @param operation - Operation name for context
 * @throws Error with descriptive message
 */
function handleServiceError(error: unknown, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`[SkillsService] ${operation} failed:`, error);
    throw new Error(`${operation} failed: ${errorMessage}`);
}

/**
 * Fetches all available skills
 * @returns Promise resolving to array of skills
 * @throws Error if fetch fails
 * 
 * @example
 * const skills = await fetchSkills();
 */
export async function fetchSkills(): Promise<Skill[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillsApiResponse>({
            url: '/get_skill',
            method: 'get',
        });
        return response?.data ?? [];
    } catch (error) {
        handleServiceError(error, 'Fetch skills');
    }
}
