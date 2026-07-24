import ApiService from '@/services/ApiService';
import { Patners, PatnersApiResponse } from '@/@types/settings';

export async function fetchExternalPartners(): Promise<Patners> {
    try {
        const response = await ApiService.fetchDataWithAxios<PatnersApiResponse>({
            url: '/v1/external-partners',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}