import { useQuery } from "@tanstack/react-query";
import { Company } from "../@types";
import { fetchCompanies } from "../@services/CompanyService";


export const useCompanies = () => {
    return useQuery<Array<Company>>({
        queryKey: ['companies'],
        queryFn: async () => {
            const res = await fetchCompanies();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};