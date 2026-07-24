export type Job = {
    id: number;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    duration: number | null;
    created_by: number;
    status: string;
    created_at: string;
    location: string;
    experience: string;
};

export type Pagination = {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type JobApiResponse = {
    status: number;
    data: Job[];
    error: string[];
};


export type InternshipDetailsApiResponse = {
    status: number;
    data: Job;
    error: string[];
}


export interface ProgramResponse {
    status: number;
    data: Program[];
    error: string[];
}

export interface Program {
    id: number;
    parent_id: number | null;
    category_id: number | null;
    session_id: number | null;
    level: string;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    duration: string | null;
    created_by: number;
    status: string;
    created_at: string;
    updated_at: string;
    organization_id: number;
    is_global_program: number;
    registration_need_approval: number;
    assigned_rule_id: number | null;
    weightage: number | null;
    certificate_id: number;
    certificate_number_pattern: string;
    certificate_latest_number: number;
    type: string | null;
    short_code: string | null;
    g_score: number | null;
    subscription_type: string | null;
    is_structured: number | null;
    is_competition: number | null;
    termination_days: number | null;
    organized_by: string | null;
    competition_level: string | null;
    is_popular: number;
    is_published: number;
    is_job: number;
    is_recommended: number | null;
    step_no: number;
    is_internship: number | null;
    organized_by_id: number | null;
    sis_ref_module_id: number | null;
    department_id: number | null;
    order: number | null;
    wp_course_id: number;
    job_id: number | null;
    domain_id: number | null;
    domain_name: string | null;
    location: string;
    experience: string;
    skill_names: string | null;
    job_status: string | null;
    job_status_numeric: number | null;
    score: number;
    job_in_org_logo: string
    created_by_name: string
    job_in_org_name: string
    job_type: string;
    table_no?: string | null;
}