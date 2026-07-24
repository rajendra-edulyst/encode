import ApiService from '@/services/ApiService'
import { CommunityCategory, CommunityPostsApiResponse, CommunityCategoryApiResponse, CommunityDetailsApiResponse, CommunityDetailsList, Post } from '@/@types/learner/community';

export async function fetchCommunity(): Promise<CommunityCategory[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityCategoryApiResponse>({
            url: '/user-joy-category',
            method: 'post',
        })
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityById(id: string): Promise<CommunityDetailsList> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityDetailsApiResponse>({
            url: `/joy/content?category_id=${id}`,
            method: 'get',
        })
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityPosts(id: string): Promise<CommunityPostsApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
            url: `/v1/communities/${id}/posts`,
            method: 'get',
        })
        return response
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityMyPosts(id: string): Promise<CommunityPostsApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
            url: `/v1/communities/${id}/posts/my-posts`,
            method: 'get',
        })
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function fetchCommunityTrending(id: string): Promise<CommunityPostsApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityPostsApiResponse>({
            url: `/v1/communities/${id}/posts/trending`,
            method: 'get',
        })
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function fetchAnnouncement(id?: string): Promise<Array<Post>> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityDetailsApiResponse>({
            url: `/joy/content`,
            method: 'get',
            params: {
                category_id: id ?? '351',
                content_type: '8',
            }
        })
        return response?.data?.list || []
    } catch (error) {
        throw error as string;
    }
}


export async function deleteCommunityPost(id: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: number;
            message: string;
            data: string;
        }>({
            url: `/joy/content/delete/${id}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

// edit post
export async function editCommunityPost(id: number, data: {
    title: string;
    description: string;
}): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            message: string;
            data: string;
        }>({
            url: `/joy/content/${id}`,
            method: 'post',
            data: data,
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

// get community post comments by post id