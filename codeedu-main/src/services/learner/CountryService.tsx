import ApiService from '@/services/ApiService';

interface ApiResponse {
    status: number;
    error: string[];
    data: Country[];
}

export interface Country {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
    country_id: number;
}

interface StateApiResponse {
    status: number;
    error: string[];
    data: State[];
}

export interface Cities {
    id: number;
    name: string;
    state_id: number;
}

interface CiryApiResponse {
    status: number;
    error: string[];
    data: Cities[];
}



export async function getCounties(): Promise<Country[] | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiResponse>({
            url: '/get-country-list?items=1000',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
}


export async function getCountryStates(country_id: string | undefined): Promise<State[] | null> {
    try {

        if (!country_id) {
            return [] as State[]; // Return empty array if country_id is not provided
        }
        
        const response = await ApiService.fetchDataWithAxios<StateApiResponse>({
            url: '/getStates',
            method: 'get',
            params: {
                country_id: country_id,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
}

export async function getCities(stateId: string | undefined): Promise<Cities[] | null> {
    try {

        if (!stateId) {
            return [] as Cities[]; // Return empty array if stateId is not provided
        }

        const response = await ApiService.fetchDataWithAxios<CiryApiResponse>({
            url: `/getCities?state_id=${stateId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        return null;
    }
}
