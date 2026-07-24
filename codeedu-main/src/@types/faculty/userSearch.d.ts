export interface SearchUser {
    id: number;
    email: string;
    login_type: string | null;
    name: string;
    username: string;
    permanent_address: string | null;
    profile_image: string | null;
    date_of_birth: string | null;
    pincode: string | null;
    organization_id: number;
    mobile_no: string | null;
    role: string;
    status: string;
    resume: string | null;
    profile_video: string | null;
    portfolio_social: string | null;
    portfolio_profile: {
        name: string;
        headline: string;
        country: string;
        city: string;
        lastName: string;
        email: string;
        phone: string;
        state: string;
        about_me: string;
    };
}


export interface SearchUserApiResponse {
    success: boolean;
    data: SearchUser[];
    error: string | null;
}


export interface SearchUserAssignment {
    content_id: number;
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    allow_multiple: number;
    is_graded: number;
    submission_mode: number;
    maximum_marks: number;
    content_type: string;
    language_id: number;
    module_id: number;
    duration_in_mins: number;
    program_name: string;
    module_name: string;
    skill_name: string;
    program: number;
    total_attempts: number;
    score: number;
    attempted_on: number;
    submission_file: string;
    file: string;
}

export interface SearchUserAssignmentApiResponse {
    success: boolean;
    data: SearchUserAssignment[];
    error: string | null;
}

// assessment
export interface SearchUserAssessment {
    content_id: number;
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    passing_marks: number;
    question_count: number;
    attempt_allowed: number;
    duration_in_minutes: number;
    module_id: number;
    attempt_count: number;
    difficulty_level: string;
    module: number;
    skill: number;
    program: number;
    program_name: string;
    module_name: string;
    skill_name: string;
    attempted_on: number;
    score: number;
}

export interface SearchUserAssessmentApiResponse {
    success: boolean;
    data: SearchUserAssessment[];
    error: string | null;
}


// user login history
export interface SearchUserLoginHistory {
    user_id: number;
    activity_time: number;
    activity_type: string;
}

export interface SearchUserLoginHistoryApiResponse {
    success: boolean;
    data: SearchUserLoginHistory[];
    error: string | null;
}