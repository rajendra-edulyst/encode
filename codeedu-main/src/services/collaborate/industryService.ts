import { Industry, IndustryAnalysisApiResponse, IndustryAnalysisCounts, IndustryApiResponse, Organization, OrganizationDetailsResponse } from "@/@types/collaborate/industry";
import ApiService from "../ApiService";

export async function fetchIndustry(): Promise<Industry[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<IndustryApiResponse>({
            url: '/university-list',
            method: 'get',
        })
        console.log("Industry response:", response);
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}


export async function fetchIndustryDetails(organizationId: string | undefined): Promise<Organization> {
    if (!organizationId) {
        throw new Error('Organization ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<OrganizationDetailsResponse>({
            url: `get-university-meta/${organizationId}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInFocus(): Promise<IndustryAnalysisCounts> {
    try {
        const response = await ApiService.fetchDataWithAxios<IndustryAnalysisApiResponse>({
            url: '/dashboard_analytics',
            method: 'get',
        })
        console.log("In Focus response:", response);
        return response.data ?? {};
    } catch (error) {
        throw error as string;
    }
}