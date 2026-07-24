import ApiService from '@/services/ApiService'
import { AnalyticGraph, AnalyticsApiResponse, AnalyticsImpressionsApiResponse, CommentPost, CommentPostApiResponse, Events, EventsApiResponse, Impressions, Internship, InternshipApiResponse, LikedPost, LikedPostApiResponse, MyActivity, MyActivityApiResponse } from '../types/analytics';
import { UserCommunityAnalytics, UserCommunityAnalyticsApiResponse } from '../types/community';


// analytics
export async function fetchUserCommunityAnalytics(): Promise<UserCommunityAnalytics> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserCommunityAnalyticsApiResponse>({
            url: '/v1/user-community-analytics',
            method: 'get',
        });
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchGraphData(type?: 'weekly' | 'monthly'): Promise<AnalyticGraph[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AnalyticsApiResponse>({
            url: '/v1/community-analytics-graph',
            method: 'get',
            params: { data_type: type }
        })
        return response?.data as AnalyticGraph[];
    } catch (error) {
        throw error as string;
    }
}

// export interface AnalyticsImpressionsApiResponse {

export async function fetchImpressionsData(): Promise<Impressions> {
    try {
        const response = await ApiService.fetchDataWithAxios<AnalyticsImpressionsApiResponse>({
            url: '/v1/community-impression',
            method: 'get'
        })
        return response?.data as Impressions;
    } catch (error) {
        throw error as string;
    }
}

// MyActivityApiResponse
export async function fetchMyActivityData(): Promise<MyActivity> {
    try {
        const response = await ApiService.fetchDataWithAxios<MyActivityApiResponse>({
            url: '/v1/community-my-activity',
            method: 'get'
        })
        return response?.data as MyActivity;
    } catch (error) {
        throw error as string;
    }
}

// likedpostapi response

export async function fetchLikedPosts() : Promise<LikedPost[]>{
    try{
        const response = await ApiService.fetchDataWithAxios<LikedPostApiResponse>({
            url: '/v1/user-liked-post',
            method: 'get'
        })
        return response?.data as LikedPost[];
    }catch(error){
        throw error as string;
    }
}

// commentpsotapi

export async function fetchCommentPosts() : Promise<CommentPost[]>{
    try{
        const response = await ApiService.fetchDataWithAxios<CommentPostApiResponse>({
            url:'/v1/user-comments-post',
            method: 'get'
        })
        return response?.data as CommentPost[];
    }catch(error){
        throw error as string;
    }
}
//eventsapi

export async function fetchEvents() : Promise<Events[]>{
    try{
        const response = await ApiService.fetchDataWithAxios<EventsApiResponse>({
            url:'/competition-list',
            method: 'get'
        })
        return response?.data as Events[];
    }catch(error){
        throw error as string;
    }
}

// internshipapi

export async function fetchInternship() : Promise<Internship[]>{
    try{
        const response = await ApiService.fetchDataWithAxios<InternshipApiResponse>({
            url: '/job-list-wow',
            method: 'get'
        })
        return response?.data as Internship[];
    }catch(error){
        throw error as string;
    }
}


