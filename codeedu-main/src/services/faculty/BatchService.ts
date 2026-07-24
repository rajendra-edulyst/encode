import { Batch, BatchApiResponse } from '@/@types/faculty/batch';
import ApiService from '@/services/ApiService';

export async function fetchBatches(parms?: URLSearchParams): Promise<Batch[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<BatchApiResponse>({
            url: '/v1/faculty-batches',
            method: 'get',
            params: parms,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}