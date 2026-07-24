import { EventDetails, EventDetailsResponse } from '@/@types/collaborate/events';
import ApiService from '@/services/ApiService'

export async function fetchEventDetails(event_id: string, event_type?: string | null): Promise<EventDetails> {
    try {
        const params = event_type ? { event_type } : undefined;
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: '/learner-competition-detail/' + event_id,
            method: 'get',
            params,
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

