import { Assignment, AssignmentsApiResponse, AssignmentApiResponse, AssignmentLearner, AssignmentLearnerApiResponse, AssignmentSubmission, AssignmentSubmissionApiResponse, AssignmentSubmissionReportApiResponse } from '@/@types/faculty/assignment';
import ApiService from '@/services/ApiService';

export async function fetchAssignments(parms?: URLSearchParams): Promise<Assignment[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentsApiResponse>({
            url: '/v1/faculty-assignment-list',
            method: 'get',
            params: parms,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Fetch assignment details
export async function fetchAssignment(assignmentId: string | undefined): Promise<Assignment | null> {
    if (!assignmentId) {
        throw new Error('Assignment ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentApiResponse>({
            url: `/v1/faculty-assignment-details/${assignmentId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// Fetch assignment learners
export async function fetchAssignmentSubmissionUsers(assignmentId: string | undefined): Promise<AssignmentLearner[]> {
    if (!assignmentId) {
        throw new Error('Assignment ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentLearnerApiResponse>({
            url: `/v1/assignment-submission-list/${assignmentId}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Fetch submit assignment listing for user
export async function fetchUserAssignmentSubmission(assessmentId: string | undefined, userId: number | undefined): Promise<AssignmentSubmission[]> {

    if (!assessmentId || !userId) {
        throw new Error('Assessment ID and User ID are required');
    }

    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentSubmissionApiResponse>({
            url: `/v1/submission-details/${assessmentId}/${userId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// add a review comment
export async function addReviewComment(data: FormData): Promise<AssignmentSubmission[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentSubmissionApiResponse>({
            url: `/v1/assignment-review-submit`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Assign certificate to learner
export async function assignAssignmentCertificate(content_id: number, user_id: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/assignment-certificate-assign`,
            method: 'get',
            params: {
                content_id,
                user_id
            }
        });
    } catch (error) {
        throw error as string;
    }
}

export async function fetchAssignmentSubmissionReport(program_id: string, batch_id?: string): Promise<AssignmentSubmissionReportApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentSubmissionReportApiResponse>({
            url: `/v1/assignment-submission-report`,
            method: 'get',
            params: { program_id, batch_id },
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}