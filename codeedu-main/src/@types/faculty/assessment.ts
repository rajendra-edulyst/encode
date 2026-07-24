export interface Assessment {
    title: string;
    id: number;
    start_date: string;
    end_date: string;
    program_name: string;
    expected_duration: number;
    content_type: string;
    module_id: number;
    total_learner: number;
    total_submissions: number;
    program_id: number;
    quiz_type: string;
    mode_of_delivery: string;
}

export interface AssessmentApiResponse {
    data: Assessment[];
    message: string;
    status: number;
}


// Fetch assessment details

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
    submitted_on_date: number;
    allow_after_passing: number;
    attempt_id: string;
    is_passed: number;
    program_name: string;
    module_name: string;
    type: string;
    program_id: number;
    module_id: number;
    latest_attempt_id: number;
}

export interface AssessmentInstructions {
    statement: string[];
    details: AssessmentDetails;
}

export interface AssessmentDetailsApiResponse {
    data: {
        instruction: AssessmentInstructions;
    }
    message: string;
    status: number;
}


// Fetch assessment learners
export interface AssessmentLearner {
    user_id: number;
    name: string;
    email: string;
    attempt_id: string;
    content_id: string;
    is_passed: number;
    maximum_marks: number;
    passing_marks: number;
    score: number;
    is_completed: number;
    enrollment_number: string;
    profile_image: string;
    time_taken_in_sec: number;
    certificate_url: string;
}

export interface AssessmentLearnerApiResponse {
    data: AssessmentLearner[];
    message: string;
    status: number;
}

// assessment questions
export interface Option {
    option_id: number;
    option_statement: string;
    attempted: number;
}

export interface Question {
    question_id: string;
    question: string;
    question_image: string;
    question_type: string;
    question_type_id: number;
    response_medium: string;
    negative_marks: number;
    marks: number;
    attempted: number;
    difficulty_level: string;
    time_taken: number;
    options: Option[];
}


export interface QuestionCreateRequest {
    assessment_id: string;
    program_id: string;
    content_id: string;
    que_statement: string;
    que_type: 1 | 2; // 1 for true/false, 2 for single-choice
    que_marks: number;
    options: string;
    que_number: number;
    correct_options: string | boolean; // true/false for true/false questions, option id for single-choice
}