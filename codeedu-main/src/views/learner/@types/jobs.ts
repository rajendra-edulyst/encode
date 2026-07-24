export type Job = {
    gulfjob_id: number
    designation: string
    sector_industry_Domain: string
    location: string
    description: string
    job_posted_date_time: string
    jobinfo: string
    resume_matches: number
    no_of_vacancies: string
    name: string
    id: number
    created_at: string
    updated_at: string
    job_in_org_logo: string
    domain_name: string
    image: string
    start_date: string | Date
    end_date: string | Date
    created_by: number
    status: number
    organization_id: number
    created_by_name: string
    job_in_org_name: string
}

export type JobPagination = {
    total: number
    per_page: number
    current_page: number
    last_page: number
    next_page_url: string
    prev_page_url: string
}

export type JobListApiResponse = {
    status: number
    message: string
    data: {
        data: Job[]
        pagination: JobPagination
    }
}

export interface MatchingJob {
    description: string
    designation: string
    gulfjob_id: number
    job_posted_date_time: string
    jobinfo: string
    location: string
    resume_matches: number
    sector_industry_Domain: string
}

export interface MatchingJobListApiResponse {
    message: string
    status: number
    data: MatchingJob[]
}


// maching job candidate

export type MatchingResumeApiRequest = {
    gulfjob_id: string
}

export type MatchingJobCandidate = {
    id: number
    name: string
    email: string
    mobile: string
    path: string
    job_role: string
    company: string
    education: string
    experience: string
    skills: string
    status: string
    created_at: string
    updated_at: string
    matching_per: number
}

export type MatchingJobCandidateApiResponse = {
    status: number
    message: string
    data: MatchingJobCandidate[]
}


export type ContryResponse = {
    data: Contry[]
}

// end maching job candidate


export type Domain = {
    name: string
    id: number
}

export type GetDomainsApiResponse = {
    status: number
    message: string
    data: Domain[]
}

export type JobRole = {
    jobrole_name: string
    jobrole_id: number
}

export type GetJobRoleApiResponse = {
    status: number
    message: string
    data: JobRole[]
}

export type Skill = {
    skill_name: string
    skill_id: number
}

export type GetSkillApiResponse = {
    status: number
    message: string
    data: Skill[]
}

export type Contry = {
    id: number,
    name: string
    currency_symbol: string
    currency_name: string
}

// create job 
export type CreateJobApiRequest = {
    is_mobile: number
    name: string
    description: string
    status: string
    image: string
    parent_id: string
    category: string
    department_id: string
    language_id: number
    organization: number
    created_by: number
    level: number
    start_date: string
    end_date: string
    short_code: string
    is_job: number
    is_published: number
    domain_id: string
    job_id: string
    skill_id: string
}

export type JobActivity = {
    image: string | null
    m_name: string
    id: number
    title: string
    content_type: string
    status: string
    content: string | null
    description: string
    start_date: string
    zoom_url: string | null
    zoom_passkey: string | null
    module_id: number
    created_at: string
    duration: number | null
    venue: string | null
    is_joined: boolean | null
    class_duration: number | null
    open_url: string | null
    record_available: boolean | null
    record_url: string | null
    content_type_label: string
    difficulty_level: string
    per_completion: number | null
    class_status: string
    activity_status: string | null
    g_score: number | null
    language_id: number
    parent_id: number | null
    order: number | null
    presenter: string
    liveclass_action: string
    liveclass_action_title: string
    session_starting_in: string
    presenter_name: string
    presenter_image: string
    base_file_url: string
}

export type JobActivityDetails = {
    list: JobActivity[],
    certificate: {
        status: number
        pdf_url: string
        html_url: string
    },
    competition_instructions: {
        whats_in: string | null,
        instructions: string | null,
        faq: string | null,
        landing_page_url: string | null,
        enable_content_lock: number,
    }
}

export type JobActivityApiResponse = {
    status: number
    message: string
    data: JobActivityDetails
}



// create skill

export type CreateSkillApiRequest = {
    name: string
    description: string
}

// create job_role

export type CreateJobRoleApiRequest = {
    name: string
    description: string
    is_mobile: number
}