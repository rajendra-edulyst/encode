import ApiService from '@/services/ApiService'
import { LeaderboardApiResponse, LeaderboardUser, learnerCompetitionDetail, learnerCompetitionDetailResponse } from '@/@types/learner/leaderboard'

export async function fetchMyCompetitionLeaderboard(): Promise<LeaderboardUser> {
    try {
        const response = await ApiService.fetchDataWithAxios<LeaderboardApiResponse>({
            url: '/competition-leaderboard?type=program&skip_other_user=1',
            method: 'post',
        })
        return response?.data[0] ?? null;
    } catch (error) {
        throw error as string;
    }
}


export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<LeaderboardApiResponse>({
            url: '/competition-leaderboard?type=program',
            method: 'post',
        })
        return response?.data || [];
    } catch (error) {
        throw error as string;
    }
}

export async function fecthMyScoreContentDetail(program_id: string): Promise<learnerCompetitionDetail[]> {
    try {
        let apiUrl = `/learner-competition-content-detail/${program_id}`;
        if (program_id === "all") {
            apiUrl = '/learner-competition-content-detail/0';
        }
        const response = await ApiService.fetchDataWithAxios<learnerCompetitionDetailResponse>({
            url: apiUrl,
            method: 'get',
        })
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}
