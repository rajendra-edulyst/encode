export interface PollOption {
    option_id: number;
    option_statement: string;
    percentage: number;
    count: number;
    is_selected: number;
}

export interface PollQuestion {
    question_id: number;
    question_no: number;
    que_statement: string;
    que_type: number;

    question_options: PollOption[];
}


export interface PollResult {
    content_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    questions: PollQuestion[];

}

export interface PollResultApiResponse {
    data: {
        survey_result: PollResult;
    };
    error: string[];
    status: number;
}