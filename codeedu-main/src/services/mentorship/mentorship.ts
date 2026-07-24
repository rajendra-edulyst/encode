import ApiService from '@/services/ApiService';

export interface ApplyForMentorshipPayload {
    domain_map: number[];
    goal_of_mentoring: string;
    resume?: string;
    mou?: string;
    t_and_c: 0 | 1;
    r_and_r: 0 | 1;
    my_profile: 0 | 1;
    role?: string;
}


export interface MentorRequest {
    user_id: number;
    domain_map: number[];
    goal_of_mentoring: string;
    resume: string;
    mou: string;
    status: string;
    approved_by: null;
    updated_at: string;
    created_at: string;
    id: number;
    t_and_c: 0 | 1 | null;
    r_and_r: 0 | 1 | null;
    my_profile: 0 | 1 | null;
    role: string | null;
}

export interface ApplyForMentorshipResponse {
    status: number;
    message: string;
    data: MentorRequest;
}

export async function ApplyForMentorship(data: ApplyForMentorshipPayload): Promise<ApplyForMentorshipResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApplyForMentorshipResponse>({
            url: '/apply-for-mentorship',
            method: 'post',
            data: {
                domain_map: data.domain_map,
                goal_of_mentoring: data.goal_of_mentoring,
                resume: data.resume,
                mou: data.mou,
                t_and_c: data.t_and_c,
                r_and_r: data.r_and_r,
                my_profile: data.my_profile,
                role: data.role,
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

export interface getMentorshipStatusResponse {
    status: number;
    message: string;
    data: MentorRequest;
}

export async function getMentorshipStatus(): Promise<getMentorshipStatusResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<getMentorshipStatusResponse>({
            url: '/get-mentorship-status',
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}