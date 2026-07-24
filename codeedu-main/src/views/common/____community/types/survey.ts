import { PollQuestion } from "./poll";

export interface SurveyItem {
    content_id: number;
    name: string;
    description: string;
    start_date: number;
    end_date: number;

    questions: PollQuestion[];
    attempt_on?: string;
}

export interface AttemptedSurveyApiResponse {
    status: number;
    data: SurveyItem[];
    error: string | string[];
}
