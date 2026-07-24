export interface SubmittedAssignment {
    id: number;
    content_id: number;
    user_id: number;
    marks_obtained: number | null;
    is_passed: number;
    user_notes: string | null;
    teacher_notes: string | null;
    review_status: number;
    file: string;
    created_at: number;
    grade: string | null | "A++";
    updated_at: number;
    organization_id: number | null;
    teacher_file: string;
    start_date_ts: number | null;
    end_date_ts: number | null;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    file: string;
    allow_multiple: number;
    is_graded: number;
    maximum_marks: number;
    passing_marks: number;
    submission_mode: number;
    learner_name: string;
    certificate_url: string;
    submission_details: SubmittedAssignment[];
}

export interface AssignmentApiResponse {
    status: number;
    data: {
        assessment_details: Assignment[];
    };
    error: string[];
}



// submit assignment

export interface SubmissionApiResponse {
    status: number;
    message: string;
    error: string[];
}