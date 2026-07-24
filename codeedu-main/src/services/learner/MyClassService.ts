import ApiService from '@/services/ApiService';
import { LiveClass, LiveClassApiResponse, ZoomLCLoadResponse } from '@/@types/learner/MyClasses';
// Fetch all live classes
export async function fetchLiveClasses(): Promise<LiveClass[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<LiveClassApiResponse>({
            url: '/onboard-sessions',
            method: 'post',
        });
        return response?.data?.modules?.liveclass || [];
    } catch (error) {
        throw error as string;
    }
}


export async function fetchLcLoad(cid: string): Promise<ZoomLCLoadResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<ZoomLCLoadResponse>({
            url: '/lc/load',
            method: 'post',
            data: {
                cid: cid,
                is_mentoring: 0
            }
        });
        return response || [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorLcLoad(cid: string): Promise<ZoomLCLoadResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<ZoomLCLoadResponse>({
            url: '/lc/load',
            method: 'post',
            data: {
                cid: cid,
                is_mentoring: 1
            }
        });
        return response || [];
    } catch (error) {
        throw error as string;
    }
}