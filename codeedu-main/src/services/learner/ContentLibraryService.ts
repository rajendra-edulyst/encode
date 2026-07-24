import ApiService from '@/services/ApiService';
import { ContentAPiResponse } from '@/@types/learner/library';

export async function fetchContent(parms: URLSearchParams): Promise<ContentAPiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<ContentAPiResponse>({
            url: `/v1/programs/content${parms.toString() ? `?${parms.toString()}` : ''}`,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}