import ApiService from "@/services/ApiService";
import { Company, CompanyApiResponse } from "../@types";

export async function fetchCompanies(): Promise<Company[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CompanyApiResponse>({
            url: '/companies-list',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
