import { LiveUrlApiResponse, Session, SessionApiResponse, SessionDetails, SessionDetailsApiResponse, SessionUsersApiData, SessionUsersApiResponse } from '@/@types/faculty/session';
import ApiService from '@/services/ApiService';

export async function fetchSessions(parms?: URLSearchParams): Promise<Session[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SessionApiResponse>({
            url: '/v1/faculty-liveclass-list',
            method: 'get',
            params: parms,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// get live url
export async function getLiveUrl(sessionId: string): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<LiveUrlApiResponse>({
            url: '/v1/liveclass-url',
            method: 'get',
            params: { cid: sessionId },
        });
        return response.data?.URL;
    } catch (error) {
        throw error as string;
    }
}

// get session users
export async function getSessionUsers(sessionId: number): Promise<SessionUsersApiData> {
    try {
        const response = await ApiService.fetchDataWithAxios<SessionUsersApiResponse>({
            url: `/v1/liveclass-user/${sessionId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// mark attendance
export async function markAttendance(sessionId: number, users: number[], status: 'Invited' | 'attended' | 'absent'): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/mark-attendence',
            method: 'post',
            data: {
                content_id: sessionId,
                attendance: status == 'attended' ? 'present' : status == 'Invited' ? '' : 'absent',
                users
            },
        });
    } catch (error) {
        throw error as string;
    }
}

// get session details
export async function getSessionDetails(sessionId: string): Promise<SessionDetails> {
    try {
        const response = await ApiService.fetchDataWithAxios<SessionDetailsApiResponse>({
            url: `/v1/liveclass-details/${sessionId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// change session status
export async function updateSessionStatus(sessionId: number, status: "Published" | "Draft"): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/liveclass-status-update',
            method: 'post',
            data: {
                content_id: sessionId,
                status
            },
        });
    } catch (error) {
        throw error as string;
    }
}


// create session
export async function createSession(data: FormData): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/create-liveclass',
            method: 'post',
            data,
        });
    } catch (error) {
        throw error as string;
    }
}