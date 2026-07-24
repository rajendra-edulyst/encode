export type Event = {
    id: number;
    parent_id: number | null;
    category_id: number;
    session_id: number | null;
    level: string;
    name: string;
    org_logo: string;
    organization_name: string;
    description: string;
    image: string;
    content_type: string;
    vanue: string;
    start_date: string;
    from_date: string;
    end_date: string;
    duration: string | null;
    created_by: number;
    status: string;
    event_category_id: string;
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
    is_structured: boolean | null;
    is_competition: number;
    termination_days: number | null;
    organized_by: string | null;
    vanue: string | null;
    competition_level: string;
    is_popular: number;
    is_published: number;
    is_job: boolean | null;
    is_recommended: boolean | null;
    step_no: number;
    is_internship: boolean | null;
    organized_by_id: number | null;
    sis_ref_module_id: number | null;
    department_id: number | null;
    order: number | null;
    wp_course_id: number;
    job_id: number | null;
    pg_score: number | null;
    comp_type: string | null;
    landing_page_url: string;
    domain_id: number | null;
    domain_name: string | null;
    location: string | null;
    experience: string | null;
    skill_names: string | null;
    job_status: string | null;
    job_status_numeric: number | null;
    score: number;
    participants: number | null;
    event_group_name: string | null;
    event_category_name: string | null;
    approval_status: string | null;
    com_status: {
        program_status: string;
        program_time: string;
    };
    skill: string[] | null;
    event_datetime: string | null;
    file?: string | null;
    profiles?: any[];
    is_assigned?: number;
    event_details?: {
        venue: string | null;
        event_link: string | null;
        event_registration_link: string | null;
        functional_domain: string | null;
        domain_name: string | null;
        event_category_id: string | null;
        event_category_name: string | null;
        job_role: string | null;
        event_datetime: string | null;
        subscription_type: string | null;
        rating: string | null;
    };
    must_watch_out?: number | string | boolean;
};

export type EventApiResponse = {
    status: number;
    data: Event[];
    error: string;
};

export type EventDetails = {
    competitions_details: {
        program: {
            name: string;
            description: string;
            image: string;
            /** e.g. workshop, masterclass — drives agenda badge when category query is missing */
            content_type?: string;
            start_date: string;
            end_date: string;
            status: string;
            vanue: string;
            competition_level: string;
            is_published: number;
            organization_name: string;


            com_status: {
                program_status: string;
                program_time: string;
            }
            contents: ContentData[]
            event_details: {
                venue: string | null,
                event_link: string | null,
                event_registration_link: string | null,
                functional_domain: string | null,
                domain_name: string | null,
                event_category_id: string | null,
                event_category_name: string | null,
                job_role: string | null,
                event_expert_id: number | null,
                event_datetime: string | null,
                subscription_type: string | null
                rating: string | null
            },
            job_details: {
                min_experience: string | null;
                max_experience: string | null;
                work_mode: string | null;
                tags: string | null;
                min_ctc: string | null;
                max_ctc: number | null;
                payment_type: string | null;
                location: string | null;
                company_name: string | null;
            },
            certificate_url: string | null;
            user_registered_count: number;
        }
    },
    competition_instructions: {
        whats_in: string;
        instructions: string;
        faq: string;
        landing_page_url: string;
    },
    is_assigned: number;
    job_skill_details: {
        all_program_skills: string[];
        matched_skills: string[];
        matched_count: number;
        match_percentage: number;
        total_program_skills: number;
    },
    expert: {
        id: number;
        name: string;
        profile_image: string;
        org_logo: string;
        role: string;
        email: string;
        skills: string[];
    },
    organization: {
        id: number;
        name: string;
        logo: string;
    };
    skills: string[] | null;
    is_assigned: number;
};

export type EventDetailsResponse = {
    status: number;
    data: EventDetails;
    error: string;
};



export interface CompetitionInstructions {
    whats_in: string;
    instructions: string;
    faq: string;
    landing_page_url: string;
}

export interface EventActivity {
    image: string | null;
    id: number;
    author_id: number;
    reference_id: number;
    reference_author_id: number;
    module_id: number;
    title: string;
    content: string;
    description: string;
    created_at: string;
    content_type: string;
    page_count: number | null;
    expected_duration: number;
    end_date: string;
    start_date: string;
    completion_percentage: number | null;
    user_id: number | null;
    g_score: number | null;
    activity_status: string | null;
    content_type_label: string;
    difficulty_level: string;
    per_completion: number | null;
    language_id: number;
    parent_id: number | null;
    liveclass_action: string;
}

export interface EventActivityResponse {
    status: number;
    data: {
        list: EventActivity[];
        competition_instructions: CompetitionInstructions;
    };
    error: string[];
}


export type ContentData = {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status?: string;
    difficulty_level: string;
    expected_duration: string;
    content_type_label: string;
    content_type?: string;
    url?: string;
    total_coins?: number;
    content?: string;
    program_id?: number;
}

export type ContentDataResponse = {
    status: number;
    data: {
        list: ContentData;
    };
    error: string[];
};


export interface EventCategoryApiResponse {
    status: number;
    error: string[];
    data: EventCategory[];
}

export interface EventCategory {
    id: number;
    name: string;
    image: string;
    description: string;
    group_name: string;
}

export interface ParticipatingIndustry {
    id: number;
    name: string;
    thumbnail: string;
    description: string | null;
    site_url: string | null;
    organization_id: number;
    job_in_org_name: string;
    program?: string | null;
}

export interface ParticipatingIndustryResponse {
    status: number;
    data: ParticipatingIndustry[];
    error: string[];
}