/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventApiResponse, Event, EventDetails, EventDetailsResponse, EventCategoryApiResponse, EventCategory } from '@/@types/collaborate/events';
import ApiService from '@/services/ApiService';

export async function fetchEvents(): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
            url: 'get-competitons',
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
export async function fetchEventApply(id: string, event_type?: string): Promise<EventDetails> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: `learner-competition-detail/${id}`,
            method: 'get',
            params: {
                is_applied: 1,
                ...(event_type ? { event_type } : {})
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchEventById(
    id: string | undefined,
    event_type?: string,
    user_calender_id?: string
): Promise<EventDetails> {
    if (!id) throw new Error("ID is required");
    try {
        const params: Record<string, string> = {};
        if (event_type) {
            params.event_type = event_type;
        }
        if (user_calender_id) {
            params.user_calender_id = user_calender_id;
        }

        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: `competitins-details/${id}`,
            method: 'get',
            params: Object.keys(params).length > 0 ? params : undefined
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInternshipApply(id: string, document_url?: string, user_id?: string): Promise<EventDetails> {
    try {
        let url = `learner-competition-detail/${id}?is_applied=1`;
        if (document_url) {
            url += `&document_url=${encodeURIComponent(document_url)}`;
        }
        if (user_id) {
            url += `&user_id=${user_id}`;
        }

        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchLearnerCompetitionDetail(id: string): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `learner-competition-detail/${id}`,
            method: 'get'
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

// event categories
export async function fetchEventCategories(): Promise<EventCategory[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventCategoryApiResponse>({
            url: '/event-category?get_parent_category=1',
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// create event
export interface CreateEventRequest {
    name: string;
    start_date: string;
    end_date: string;
    reg_due_date: string;
    description: string;
    event_mode: 'online' | 'offline';
    instructions: string;
    venue?: string;
    event_category_id: number;
    expertDesignation: string;
    expertImage?: File;
    image: string;
    file: File | null;
    'skill_id[]': string[];
    domain_id: string;
    creatorLevel: string;
    organization_id: number;
}

export async function createEvent(data: CreateEventRequest): Promise<any> {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'skill_id[]' && Array.isArray(value)) {
                    // Append each skill ID separately as skill_id[]
                    value.forEach((skillId) => {
                        formData.append('skill_id[]', skillId);
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await ApiService.fetchDataWithAxios({
            url: '/v1/event-create',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

// update event
export interface UpdateEventRequest extends CreateEventRequest {
    program_id: string;
}

export async function updateEvent(data: UpdateEventRequest): Promise<any> {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'skill_id[]' && Array.isArray(value)) {
                    // Append each skill ID separately as skill_id[]
                    value.forEach((skillId) => {
                        formData.append('skill_id[]', skillId);
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await ApiService.fetchDataWithAxios({
            url: '/v1/event-create',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
