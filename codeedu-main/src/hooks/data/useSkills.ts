import { Skill } from "@/@types/skills";
import { fetchSkills } from "@/services/SkillsService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * Hook to fetch all available skills
 * @returns Query result with skills data, loading state, and error
 * 
 * @example
 * const { data: skills = [], isLoading, error } = useSkills();
 */
export const useSkills = (): UseQueryResult<Skill[], Error> => {
    return useQuery<Skill[], Error>({
        queryKey: ['skills'],
        queryFn: async () => {
            const data = await fetchSkills();
            return data ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 10, // 10 minutes - skills don't change often
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};
