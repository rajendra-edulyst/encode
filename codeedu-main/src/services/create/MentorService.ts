import { IndustryMentor, IndustryMentorApiResponse, LMSMentor, LMSMentorApiResponse, Mentor, MentorApiResponse, MentorMonthlyStats, MentorMonthlyStatsResponse, MentorPerformance, MentorPerformanceResponse, MentorRankingItem, MentorRankingResponse, MentorSessionDetails, MentorSessionDetailsResponse, MentorSessionHistoryItem, MentorSessionHistoryResponse, MentorSessionHistoryStat, MentorSessionHistoryStatResponse, MentorStatsData, MentorStatsResponse, MentorUpcomingSession, MentorUpcomingSessionsResponse, RecentActivityItem, RecentActivityResponse, UpcomingSessionStats, UpcomingSessionStatsResponse } from "@/@types/create/mentor";
import axios from "axios";
import ApiService from "../ApiService";

const data = {
    profileSection: ["about", "education", "basic_info", "social_links", "experience", "industry_experience", "areas_of_expertise", "qualification", "experience_summary"]
}

export async function fetchMentorsList(): Promise<Array<Mentor>> {
    try {
        const response = await axios<MentorApiResponse>({
            url: 'https://profiles.edulystventures.com/api/user/search/mentors',
            headers: {
                'x-frontend-key': 'e430f4c6473ee3b465be4c06f0078b85df63b91c8c644dfcd1b6106eadd90811',
            },
            method: 'post',
            data: data,
        });
        return response?.data?.data || [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMyMentorsList(): Promise<Array<LMSMentor>> {
    try {

        const response = await ApiService.fetchDataWithAxios<LMSMentorApiResponse>({
            url: '/my-mentor-list',
            method: 'post',
        });
        return response?.data || [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchIndustryMentorsList(params?: URLSearchParams): Promise<Array<IndustryMentor>> {
    try {
        // industry-mentors
        const response: any = await ApiService.fetchDataWithAxios<IndustryMentorApiResponse>({
            url: '/get-mentor-list-v2',
            method: 'get',
            params,
        });

        let mentorArray = response?.data || response || [];
        if (!Array.isArray(mentorArray) && mentorArray?.data) {
            mentorArray = mentorArray.data;
        }

        return Array.isArray(mentorArray) ? mentorArray : [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchRecommendedMentorsList(): Promise<Array<LMSMentor>> {
    try {
        // recommended-mentors
        const response = await ApiService.fetchDataWithAxios<LMSMentorApiResponse>({
            url: '/get-recmmd-mentor',
            method: 'get',
        });
        return response?.data || [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorStats(type?: string): Promise<MentorStatsData> {
    try {
        const response = await ApiService.fetchDataWithAxios<MentorStatsResponse>({
            url: `/v1/dashboard/mentor-stats?type=${type}`,
            method: 'get',
        });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}
export async function fetchMentorMonthlyStats(type?: string): Promise<MentorMonthlyStats[]> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorMonthlyStatsResponse>({
                url: `/v1/dashboard/monthly-trends?type=${type}`,
                method: 'get',
            });

        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorRanking(type?: string): Promise<MentorRankingItem[]> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorRankingResponse>({
                url: `/v1/dashboard/mentor-ranking?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchRecentActivity(type?: string): Promise<RecentActivityItem[]> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<RecentActivityResponse>({
                url: `/v1/dashboard/recent-activity?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUpcomingSessionStats(type?: string): Promise<UpcomingSessionStats> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<UpcomingSessionStatsResponse>({
                url: `/v1/dashboard/upcoming-session-stats?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorUpcomingSessions(type?: string): Promise<MentorUpcomingSession[]> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorUpcomingSessionsResponse>({
                url: `/v1/dashboard/mentor-upcoming-sessions?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorSessionHistoryStat(type?: string): Promise<MentorSessionHistoryStat> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorSessionHistoryStatResponse>({
                url: `/v1/dashboard/mentor-session-history-stats?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorSessionHistory(type?: string): Promise<MentorSessionHistoryItem[]> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorSessionHistoryResponse>({
                url: `/v1/dashboard/mentor-session-history?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorSessionDetails(
    sessionId: number
): Promise<MentorSessionDetails> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorSessionDetailsResponse>({
                url: `/v1/dashboard/mentor-session-details/${sessionId}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchMentorPerformance(type?: string): Promise<MentorPerformance> {
    try {
        const response =
            await ApiService.fetchDataWithAxios<MentorPerformanceResponse>({
                url: `/v1/dashboard/mentor-performance?type=${type}`,
                method: 'get',
            });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}








import axios from 'axios';
import { AllMentorListResponse } from '@/@types/create/mentor';

export async function fetchPublicMentorListV2(): Promise<AllMentorListResponse> {
    try {
        const response = await axios.get<AllMentorListResponse>('https://encodeapi.codeedu.co/api/get-mentor-list-v2', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2VuY29kZWFwaS5jb2RlZWR1LmNvL2FwaS9sb2dpbiIsImlhdCI6MTc4MjgyMDAyMCwiZXhwIjoxNzg2NDIwMDIwLCJuYmYiOjE3ODI4MjAwMjAsImp0aSI6IlpsRENNYVZKeFViOWRLM2YiLCJzdWIiOjMwOSwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.jP6qDO0KLegVK0pEq574f1EIP4euVKjXVnbf50MVzrg',
                'nlms-api-key': '0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu'
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
