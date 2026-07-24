import ApiService from '@/services/ApiService';
import { MentorApiResponse, User, MentorConnectRequest, MentorConnectResponse } from '@/@types/learner/mentor';

export async function fetchMentorList(queryType?: string): Promise<User[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<MentorApiResponse>({
            url: `/get-mentor-list?type=${queryType}`,
            method: 'post',
        });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function connectMentor(event: MentorConnectRequest): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<MentorConnectResponse>({
            url: 'user-calendar-save',
            method: 'post',
            data: event as MentorConnectRequest,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}