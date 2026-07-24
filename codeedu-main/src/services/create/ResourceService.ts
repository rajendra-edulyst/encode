import { Resource, ResourcesApiResponse } from "@/@types/learner/Courses";
import ApiService from "../ApiService";



export async function fetchResource(params?: URLSearchParams): Promise<Resource[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ResourcesApiResponse>({
            url: '/v1/resources',
            method: 'get',
            params
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);

        throw error as string;
    }
}


export async function fetchMyResource(params?: URLSearchParams): Promise<Resource[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ResourcesApiResponse>({
            url: '/v1/user-resources',
            method: 'get',
            params
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);

        throw error as string;
    }
}


export async function mapResourceIds(resourceIds: number[]) {
    try {
        const response = await ApiService.fetchDataWithAxios<ResourcesApiResponse>({
            url: '/v1/resource-map',
            method: 'post',
            data: {
                resource_ids: resourceIds
            }
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error as string;
    }
}


export async function fetchRecommendedResources(params?: URLSearchParams): Promise<Resource[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ResourcesApiResponse>({
            url: '/v1/recmmd-resources',
            method: 'get',
            params
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching recommended resources:", error);

        throw error as string;
    }
}