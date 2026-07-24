import { useQuery } from "@tanstack/react-query";
import { Industry } from "../types/community";
import { fetchIndustry } from "../services/CommunityService";

export function useIndustries() {
  return useQuery<Industry[], Error>({
    queryKey: ["industries"],
    queryFn: fetchIndustry,
    staleTime: 5 * 60 * 1000, 
    retry: 1, 
  });
}
