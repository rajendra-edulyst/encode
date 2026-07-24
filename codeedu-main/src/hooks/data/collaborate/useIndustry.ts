import { Industry, IndustryAnalysisCounts, Organization } from "@/@types/collaborate/industry";
import { fetchIndustry, fetchIndustryDetails, fetchInFocus } from "@/services/collaborate/industryService";
import { useQuery } from "@tanstack/react-query";

export function useIndustries() {
  return useQuery<Industry[], Error>({
    queryKey: ["industries"],
    queryFn: fetchIndustry,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}


export const useIndustryDetails = (id: string | undefined) => {
  const queryKey = ['organization', id];
  return useQuery<Organization>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await fetchIndustryDetails(id);
      console.log("In Focus Data:", res);
      return res ?? [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};


export const useIndustryAnalysis = () => {
  const queryKey = ['industryAnalysis'];
  return useQuery<IndustryAnalysisCounts>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await fetchInFocus();
      console.log("In Focus Data:", res);
      return res ?? [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}