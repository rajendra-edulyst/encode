import { Assessment, AssessmentApiResponse, AssessmentDetailsApiResponse, AssessmentInstructions, AssessmentLearner, AssessmentLearnerApiResponse } from '@/@types/faculty/assessment';
import ApiService from '@/services/ApiService';

export async function fetchAssessments(parms?: URLSearchParams): Promise<Assessment[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentApiResponse>({
            url: '/v1/faculty-assessment-list',
            method: 'get',
            params: parms
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// assessment details
export async function fetchAssessment(assessmentId: string | undefined): Promise<AssessmentInstructions | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentDetailsApiResponse>({
            url: `/assessment-instructions/${assessmentId}`,
            method: 'get'
        });
        return response.data.instruction;
    } catch (error) {
        throw error as string;
    }
}

// Fetch assessment learners
export async function fetchAssessmentAttemptsUsers(assessmentId: number | string | undefined): Promise<AssessmentLearner[]> {
    if (!assessmentId) return [];
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentLearnerApiResponse>({
            url: `/v1/assessment-user-list/${assessmentId}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// create question
export async function createAssessmentQuestion(questionData: FormData): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/question-create`,
            method: 'post',
            data: questionData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        throw error as string;
    }
}

// Assign certificate to learner
export async function assignAssessmentCertificate(content_id: string, user_id: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/assessment-certificate-assign`,
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