import ApiService from '@/services/ApiService';
import { CommunityJoinResponse } from '@/@types/learner/communityJoin';

export async function fetchCommunityJoin(all_category_ids: string): Promise<CommunityJoinResponse> {
    try {
      
        const response = await ApiService.fetchDataWithAxios<CommunityJoinResponse>({
            url: `/courses/user-mapping?category_ids=${encodeURIComponent(all_category_ids)}`,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
