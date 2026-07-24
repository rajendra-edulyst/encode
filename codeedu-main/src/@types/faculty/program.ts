export interface ProgramCategory {
    id: number;
    name: string;
    image: string;
    is_mapped: number;
    organization_id: number;
}

export interface ProgramCategoryResponse {
    status: number;
    data: ProgramCategory[];
    error: string;
}

export interface AssignedProgram {
    id: number;
    name: string;
    image: string;
    description: string;
    batch_names: string | null;
    tot_learners: number;
    semester_name: string | null;
    course_name: string | null;
    start_date: string;
    end_date: string;
}

export interface AssignedProgramResponse {
    status: number;
    data: AssignedProgram[];
    message: string;
}

export interface AssignedProgramForFilter {
    id: number;
    name: string;
}

export interface AssignedProgramForFilterApiResponse {
    status: number;
    data: AssignedProgramForFilter[];
    message: string;
}

export interface ProgramDetailModule {
    id: number;
    name: string;
    description: string;
    permission: {
        is_edit_allowed: number,
        is_delete_allowed: number
    }
}

export interface ProgramDetails {
    id: number;
    name: string;
    description: string;
    image: string;
    created_at: string;
    start_date: string;
    end_date: string;
    subscription_type: string;
    difficulty_level: string | null;
    student_enrolled: number;
    program_faculty: {
        id: number;
        name: string;
        profile_image: string;
    }[];
    skill_id: string;
    is_map_id: number;
    is_course_assigned: string | null;
    program_status: {
        program_status: string;
        program_time: string;
    };
    course_meta: string[];
    organization: {
        id: number;
        organization_logo: string;
        name: string;
    };
    course_skills: string;
    modules: ProgramDetailModule[];
}

export interface ProgramDetailsResponse {
    status: number;
    data: ProgramDetails;
    error: string[];
}


// free programs

export interface FreeProgram {
    id: number;
    name: string;
    image: string;
    description: string;
    start_date: string;
    end_date: string;
    short_code: string | null;
    country_name: string | null;
    country_id: number | null;
    subscription_type: string;
    category_name: string;
    category_id: number;
    course_meta_data: {
        unknown_key: string | null;
    };
    is_mapped_id: number;
    organization: {
        id: number;
        organization_logo: string;
        name: string;
    };
    duration: number;
}

export interface FreeProgramApiResponse {
    status: number;
    data: FreeProgram[];
    message: string;
}


// new program module content


export type CommonModuleContent = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    due_date: string
    completion: number
    content_type: 'notes' | 'assessment' | 'assignment' | 'video' | 'zoomclass' | 'video_yts' | 'audio' | 'quiz' | 'survey' | 'scorm' | 'interactive' | 'text' | 'external_link'
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
    assignment_file: string
    start_date: number
    end_date: number
    attempts_remaining: number
    attempt_date: string
    score: number
    is_completed: number
    questions_attempted: number
    program_id: number
    overall_score: number
    overall_result: string
    maximum_marks: number
    negative_marks: number
    stream_file_id: string | null
    allow_multiple: number
    permission: {
        is_delete_allowed: number
        is_edit_allowed: number
    }
    is_attempt?: number
}

export type Module = {
    id: number
    name: string
    description: string
    contents: {
        course_details: {
            id: number
            name: string
            description: string
        },
        module_details: {
            id: number
            name: string
            description: string
        },
        contents: CommonModuleContent[],
    }
}


export type ModuleCourseDetails = {
    id: number
    name: string
    description: string
    is_assigned?: number
}


export type CourseModule = {
    course_details: ModuleCourseDetails,
    module_details: Module,
    contents: CommonModuleContent[],
    next_module: Module | null,
    content_count: {
        videos: number
        notes: number
        sessions: number
    }
}

export type CourseModuleApiResponse = {
    status: number
    data: CourseModule
    error: string[]
}


// program batch and module

export type ProgramBatch = {
    id: number
    title: string
}

export type ProgramModule = {
    id: number
    name: string
}

export type ProgramBatchAndModule = {
    batch: ProgramBatch[]
    module: ProgramModule[]
}

export type ProgramBatchAndModuleApiResponse = {
    status: number
    data: {
        original: ProgramBatchAndModule
    }
    error: string[]
}


// content type
export type ContentType = | 'notes' | 'audio' | 'video' | 'assignment' | 'quiz' | 'liveClass' | 'scorm' | 'survey' | 'interactive' | 'text' | 'external_link';

// 
export type CreateProgramData = {
    name: string;
    description: string;
    status: string;
    image: string | null;
    parent_id: number | null;
    category_id: string;
    organization_id: number;
    is_global_program: number;
    registration_need_approval: number;
    created_by: number;
    level: string;
    start_date: string | null;
    end_date: string | null;
    session_id: number | null;
    weightage: number | null;
    certificate_id: number;
    certificate_number_pattern: string;
    certificate_latest_number: number;
    short_code: string | null;
    g_score: string;
    is_structured: number | null;
    is_competition: number | null;
    is_job: number | null;
    is_popular: number;
    organized_by_id: number | null;
    competition_level: string | null;
    termination_days: number | null;
    is_published: number;
    subscription_type: string | null;
    wp_course_id: string;
    updated_at: string;
    created_at: string;
    id: number;
    step_no: number;
};

export type CreateProgramResponse = {
    status: number;
    data: CreateProgramData;
    error?: string[];
}


export type ContentOrderItem = {
    id: number;
    position: number;
}

export type SaveContentOrderPayload = {
    contentOrder: ContentOrderItem[];
}

export type SaveContentResponse = {
    status: number;
    data: string;
    message: string;
}