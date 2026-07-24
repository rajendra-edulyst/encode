import ApiService from "../ApiService";

interface ApiResponse {
    status: number;
    error: string[];
    data: Cities[];
}

export interface Cities {
    id: number;
    name: string;
}

export async function getCities(stateId: number): Promise<Cities[] | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiResponse>({
            url: `/getCities?state_id=${stateId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        return null;
    }
}
