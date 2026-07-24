export interface LeaderboardUser {
    user_id: number;
    completion_time: string,
    email: string,
    g_score: number,
    id: number,
    name: string,
    profile_image: string,
    total_activities: number,
}

export interface LeaderboardApiResponse {
    data: LeaderboardUser[];
    status: number;
    error: string[];
}

export interface learnerCompetitionDetail {
    user_content_attempt_id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    user_g_score: number;
    total_g_score: number;
    content_type: string;
    program_content_id: number;
    program_id: number;
    completion_percentage: number;
    activity_status: number;
    completion_time: string;
   
}

export interface learnerCompetitionDetailResponse {
    data: learnerCompetitionDetail[];
    status: number;
    error: string[];
}