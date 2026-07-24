

export interface AssessmentDetails {
    content_id: string;
    assessment_id: number;
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    passing_marks: number;
    question_count: number;
    attempt_allowed: number;
    duration_in_minutes: number;
    certificate: number;
    difficulty_level: string;
    attempt_count: number;
    is_attempted: number;
    score: number;
    is_review_allowed: number;
    quiz_type: string;
    passcode: string | null;
    submitted_on_date: number;
    allow_after_passing: number;
    is_certificate: number;
    show_diagnostic: number;
    certificate_html_url: string;
    is_passed: number;
    latest_attempt_id: number

}

export interface AssessmentInstruction {
    statement: string[];
    details: AssessmentDetails;
}


export interface AssessmentInstructionApiResponse {
    status: number;
    data: {
        instruction: AssessmentInstruction;
    };
    error: string;
}


// Assesment Question Response
export interface Option {
    option_id: number;
    option_statement: string;
    attempted: number;
}

export interface Question {
    question_id: number;
    question: string;
    question_image: string[];
    question_type: string;
    question_type_id: number;
    response_medium: string;
    negative_marks: number;
    marks: number;
    attempted: number;
    difficulty_level: string;
    time_taken: number;
    options: Option[];
    correct_answer_statement?: string[]; // For Match The Following questions
}

export interface AssessmentAttempt {
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    passing_marks: number;
    question_count: number;
    negative_marking: number;
    negative_marks: number;
    total_attempts: number;
    attempt_count: number;
    duration_in_minutes: number;
    questions: Question[];
    attempted_id: number;
    question_sequence?: string;
}

export interface AssessmentAttemptApiResponse {
    status: number;
    data: {
        assessment_details: AssessmentAttempt;
    };
    error: string[];
}


// assesment submit response

export type AssessmentSubmitResponse = {
    status: number;
    message: string;
    data?: {
        attempt_id: number;
    };
    error?: string[];
};


// assesment finish response
export type AssessmentFinishResponse = {
    status: number;
    message: string;
    error: string[];
};


// review assesment response

export interface QuestionOption {
    option_id: number;
    option_statement: string;
    user_answer: number;
}


export interface ReviewQuestion {
    question_id: number;
    question: string;
    question_type_id: number;
    marks: number;
    correct_options: string[];
    question_options: QuestionOption[];
    image: string | null;
    question_image: string[];
    question_type: string;
    is_correct: number;
    marks_obtained: number;
    attempt_state: number;
    answer_statement?: string;
}

export interface AssessmentReview {
    content_id: string;
    score: number;
    start_date: number;
    end_date: number;
    question_count: number;
    negative_marking: number;
    negative_marks: number;
    question_attempted: number;
    question_skipped: number;
    duration_in_minutes: number;
    total_attempts: number;
    attempt_count: number;
    time_taken: number;
    questions: ReviewQuestion[];
    assessement_name: string;
    error: string[];
    assessment_name: string;
    attempt_id: string;
    program_id: string;
    attempt_ids: number[];
    maximum_marks: number;
    attempt_started_at: string;
    attempt_completed_at: string;
    program_name: string;
    module_name: string;
    is_passed: number;
    leaderboard: {
        topStudentsList: {
            user_id: number;
            completion_percentage: number | null;
            completion_time: string | null;
            updated_at: string | null;
            name: string;
            email: string;
            profile_image: string;
        }[];
        studentRank: number;
        studentLastViewed: string;
    }
}

export interface AssessmentReviewResponse {
    status: number;
    data: {
        assessment_review: AssessmentReview;
    };
}