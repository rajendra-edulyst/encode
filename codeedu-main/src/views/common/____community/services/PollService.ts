import ApiService from "@/services/ApiService";
import { PollResult, PollResultApiResponse } from "../types/poll";

export async function savePollResponse(data: { content_id: string; question_id: number; option_id: string | string[]; }): Promise<void> {
    try {
        const formData = new FormData();
        formData.append('content_id', data.content_id.toString());
        formData.append('question_id', data.question_id.toString());
        if (data.option_id !== null) {
            formData.append('option_id[]', data.option_id.toString());
        }
        formData.append('mark_review', '0');
        formData.append('durationSec', '0');

        await ApiService.fetchDataWithAxios({
            url: '/assessment-submit',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
    } catch (error) {
        throw error as string;
    }
}


// get poll results
export async function getPollResults(pollId: number): Promise<PollResult> {
    try {
        const response = await ApiService.fetchDataWithAxios<PollResultApiResponse>({
            url: `/survey-result/${pollId}`,
            method: 'get',
        });
        return response?.data?.survey_result;
    } catch (error) {
        throw error as string;
    }
}


import { AttemptedSurveyApiResponse, SurveyItem } from "../types/survey";

export async function getPollAttemptedSurvey(type: string): Promise<SurveyItem[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AttemptedSurveyApiResponse>({
            url: `/v1/dashboard/attempted-surveys?type=${type}`,
            method: 'get',
        });
        return response?.data || [];
    } catch (error) {
        throw error as string;
    }
}