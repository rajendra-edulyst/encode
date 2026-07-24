import ApiService from '@/services/ApiService';

export interface VideoInterviewData {
    id: number;
    title: string;
    description: string;
    user_file: string | null;
    [key: string]: any;
}

export interface VideoInterviewResponse {
    status: number;
    data: VideoInterviewData[];
    error: any[];
}

export async function fetchVideoInterviewDetails(contentId: string): Promise<VideoInterviewResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<VideoInterviewResponse>({
            url: `/learner/video-interview/${contentId}`,
            method: 'get'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function submitVideoInterview(data: {
    content_id: string;
    question_id: string;
    durationSec: string;
    user_file: string;
    option_id?: string;
    mark_review?: string;
}): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/assessment-submit-v3',
            method: 'post',
            data: data
        });
        return response;
    } catch (error) {
        throw error;
    }
}
