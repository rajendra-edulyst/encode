import ApiService from '@/services/ApiService';
import { Event, EventData, EventResponse } from '@calendar/@types/calendar';

export async function fetchEvents(): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventData>({
            url: 'user-calendar-list',
            method: 'post',
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch events');
    }
}

export async function createEvent(event: Event): Promise<Event> {
    try {

        event.start_date = event.start;
        event.end_date = event.end;

        const response = await ApiService.fetchDataWithAxios<EventResponse>({
            url: 'user-calendar-save',
            method: 'post',
            data: event,
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to create event');
    }
}

export async function updateEvent(event: Event): Promise<Event> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventResponse>({
            url: `wp/calendar/events/${event.id}`,
            method: 'put',
            data: event,
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update event');
    }
}

export async function deleteEvent(eventId: string): Promise<void> {
    try {
        console.log(eventId);
        await ApiService.fetchDataWithAxios<void>({
            url: `user-calendar-delete`,
            method: 'post',
            data: { calender_id: eventId },
        });
    } catch (error) {
        throw new Error('Failed to delete event');
    }
}
