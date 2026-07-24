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
    start_date: string;
    from_date: string;
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
    com_status: {
        program_status: string;
        program_time: string;
    };
    skill: string[] | null;
};

export type EventData = {
    status: number;
    data: Event[];
    error: string[];
};


export type Activity = {
    liveclass_action: string;
    image: string | null,
    id: number,
    author_id: number,
    reference_id: number,
    reference_author_id: number,
    module_id: number,
    title: string,
    content: string,
    description: string,
    created_at: string,
    content_type: string,
    page_count: number | null,
    expected_duration: string,
    end_date: string,
    start_date: string,
    completion_percentage: number | null,
    user_id: number | null,
    g_score: number | null,
    activity_status: number | null,
    content_type_label: string,
    difficulty_level: string,
    per_completion: number | null,
    language_id: number | null,
    parent_id: number | null
}

export type Instructions = {
    whats_in: string,
    instructions: string,
    faq: string,
}


export type EventDetails = {
    list: Activity[],
    competition_instructions: Instructions,
}

export type EventDetailsResponse = {
    status: number;
    data: EventDetails;
    error: string[];
};

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


export type ApiResponse = {
    status: number;
    data: Event[];
    error: string;
};


export type EventNewDetailsResponse = {
    status: number;
    data: EventDetailsData;
    error: string;
};

export type EventDetailsData = {
    competitions_details: {
        program: {
            name: string;
            description: string;
            image: string;
            start_date: string;
            end_date: string;
            status: string;
            competition_level: string;
            is_published: number;
            com_status: {
                program_status: string;
                program_time: string;
            }
            contents: [
                {
                    id: number;
                    title: string;
                    description: string;
                    start_date: string;
                    end_date: string;
                    status: string;
                    difficulty_level: string;
                    expected_duration: string;
                    content_type_label: string;
                }
            ]
        }
    },
    competition_instructions: {
        whats_in: string;
        instructions: string;
        faq: string;
        landing_page_url: string;
    }
};


// activity content store
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
