import ApiService from '@/services/ApiService';
import { EventActivityResponse } from '@/@types/learner/eventActivity';

export async function fetchEventActivity(event_id: number): Promise<EventActivityResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventActivityResponse>({
            url: '/learner-competition-detail/'+event_id,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}