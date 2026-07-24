export type Organization = {
    id: number
    name: string
    logo: string
    organization_logo: string
}

export type CourseMeta = {
    course_heading: string
    about_course: string
    degree: string
    eligibility: string
    field_of_study: string
    duration: string
    school_department: string
    tuition_fee: string
    number_of_credits: string
    language: string
    scholarship: string
    how_to_apply: string
    course_structure: string
    learning_outcome: string
    partners: string
    collaboration: string
    career_opportunities: string
    course_usp: string
    what_you_will_get: string
    nature: string;
    keywords: string;
    class_slots: string;
    maximum_seats: string;
    pre_requisite: string;
    available_seats: string;
    mode_of_delivery: string;
    pre_requisite_course_id: string;
    rating: string;
    num_people_rated: string;
    industry_relevance: IndustryRelevance
}

export type IndustryRelevance = {
    industry: string[]
}

export type Course = {
    short_description: string
    id: number
    name: string
    description: string
    image: string
    start_date: string
    end_date: string
    short_code: string | null
    duration: number
    organization: Organization,
    subscription_type: string
    category_id: number
    created_by: number
    learner_count: number
    category_name: string
    course_leader_name: string;
    is_assigned: number;
    is_course_assigned?: number;
    is_mapped_id: number | null;
    completion?: number;
    program_completions: number;
    course_meta_data: CourseMeta,
    course_meta: CourseMeta,
    skill_job_role: {
        skills: string[];
        job_role: string[];
    },
    skills: string[],
}

export type Pagination = {
    current_page: number
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string | null
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
    program_counts: {
        free: number,
        paid: number,
        total: number
    }
}

export type CoursesApiResponse = {
    status: number
    data: Course[]
    pagination: Pagination
    error: string[]
}

export interface ModeOfDeliveryResponse {
    status: number;
    data: ModeOfDelivery;
    error: string[];
}

// Keys returned by API
export interface ModeOfDelivery {
    online_interactive: string;
    self_peased: string;
    hybrid: string;
}


// Course Details Types
export type Faculty = {
    id: number
    name: string
    profile_image: string
    role: string
    email: string
    is_external?: string | number | boolean
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

export type ProgramStatus = {
    program_status: string
    program_time: string
}


export type CourseDetails = {
    learning_outcomes: any
    learners_count: string
    rating: string
    level: string
    duration: string
    short_description: string
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    image: string
    student_enrolled: number
    program_faculty: Faculty[],
    organization: Organization,
    modules: Module[]
    user_certificate: string;
    program_completion: ProgramCompletion;
    course_skills: string
    program_status: ProgramStatus
    is_map_id: number | null
    subscription_type: string | null
    is_course_assigned: number
    course_meta: CourseMeta
    category_id: number;
    JobRoleSkill: {
        skills: string[];
        job_role: string[];
    }
    course_leader_name: string;
    course_leader_email: string;
    course_leader_id: number;
    course_leader_profile_image: string;
    job_role_skill: {
        skills: string[];
        job_role: string[];
        industry_domains: string[];
    },
    category_name: string;
}

export type CourseDetailsApiResponse = {
    status: number
    data: CourseDetails
    error: string[]
}

export type CourseDetailsV2 = {
    short_description: string
    id: number
    name: string
    description: string
    image: string
    created_at: string
    start_date: string
    end_date: string
    organization_id: number,
    category_id: number,
    category_name: string,
    organization_name: string,
    organization_logo: string,
    is_assigned: number,
    program_status: ProgramStatus,
    skills: string[],
    subscription_type: string | null,
    is_map_id: number | null,
    certificate_id: number
    program_completion: ProgramCompletion,
    course_meta: {
        mode_of_delivery: string,
        nature: string,
        duration: string,
        rating: string,
        num_people_rated: string
        learning_outcome: string
        tuition_fee: string,
        number_of_credits: string,
    }
}

export type CourseDeatilsV2ApiResponse = {
    status: number
    data: CourseDetailsV2
    error: string[]
}

export interface ProgramCompletion {
    [programId: string]: number;
}

export type ModuleContentSession = {
    program_content_id: number
    title: string
    content_type: 'notes' | 'assesment' | 'assignment' | 'video'
    start_date: string
    end_date: string
    duration: number
    description: string
}

export type ModuleLearningShot = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    due_date: string
    completion: number
    content_type: 'notes' | 'assesment' | 'assignment' | 'video'
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
}

export type ModuleContentAssigment = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    due_date: string
    completion: number
    content_type: 'notes' | 'assesment' | 'assignment' | 'video'
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
}

export type ModuleContentAssessment = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    due_date: string
    completion: number
    content_type: 'notes' | 'assesment' | 'assignment' | 'video'
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
}

export type ModuleContent = {
    content_counts: {
        videos: number
        notes: number
        sessions: number
    }
    sessions: ModuleContentSession[]
    learning_shots: ModuleLearningShot[]
    assessments: ModuleContentAssessment[]
    assignments: ModuleContentAssigment[]
}

export type CommonModuleContent = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    file: string
    due_date: string
    completion: number | string
    content_type: 'notes' | 'assessment' | 'assignment' | 'video' | 'zoomclass' | 'video_yts' | 'survey' | 'offlineclass'
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
    assignment_file: string
    content: string
    start_date: number
    end_date: number
    attempts_remaining: number
    attempt_count: number
    attempt_date: string | number | null
    score: number
    is_completed: number
    questions_attempted: number
    program_id: number
    overall_score: number
    overall_result: string
    maximum_marks: number
    negative_marks: number
    stream_file_id: string | null
    is_locked: number // 1 = locked, 0 = not locked
    attempt_allowed: number
    que_count: number

    allow_multiple: number
    /** Set when learner has submitted (e.g. event activity merge from competitins-details) */
    attempt_id?: number | null
    completion_percentage?: number
    certificate_url?: string
    zoom_url?: string
    liveclass_url?: string
    open_url?: string | null
    record_url?: string | null
    record_available?: number
    liveclass_action?: string
    liveclass_status?: string
    liveclass_sub_heading?: string
    status?: string
    submisson_mode?: string
    quiz_type?: 'industry'
    is_attempt?: number
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
    previous_module: Module | null,
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

export type CourseInstructorAndCourseLeader = {
    instructor: Faculty[],
    course_leader: Faculty[]
}

export type CourseInstructorAndCourseLeaderApiResponse = {
    status: number
    data: CourseInstructorAndCourseLeader
    error: string[]
}


export type CourseSkilsAndJobRoles = {
    skills: string[];
    job_role: string[];
}

export type CourseSkilsAndJobRolesApiResponse = {
    status: number
    data: CourseSkilsAndJobRoles
    error: string[]
}

export type CourseModuleV2 = {
    name: string;
    id: number;
    description: string;
    order: number;
}


export type CourseModuleApiResponseV2 = {
    status: number
    data: CourseModuleV2[]
    error: string[]
}


// pre assign


export interface PreAssignCourse {
    id: number;
    short_code: string | null;
    certificate_id: number;
    g_score: number | null;
    is_global_program: number;
    registration_need_approval: number;
    name: string;
    level: string;
    description: string;
    image: string;
    learner_count: number;
    start_date: number;
    end_date: number;
    category_id: number;
    created_by: number;
    regular_price: number | null;
    is_structured: number | null;
    is_competition: number | null;
    termination_days: number | null;
    sale_price: number | null;
    sis_ref_module_id: number | null;
    completion: number;
    score: string;
    subscription_type: string;
    module_completion_count: number;
    total_module_count: number;
    module_completion_summary: string;
    organization: {
        id: number
        name: string
        organization_logo: string
    }
    skill_job_role: {
        skills: string[];
        job_role: string[];
    }
    course_meta_data: {
        nature: string;
        rating: string;
        duration: string;
        mode_of_delivery: string;
        num_people_rated: string;
        number_of_credits: string;
    }

}


export interface SkillJobRole {
    skills: string[];
    job_role: string[];
}

export interface ProgramApiResponse {
    status: number;
    data: {
        list: PreAssignCourse[];
    };
    error: string[];
}



export interface ProgramAndContentCertificate {
    program_certificate: {
        certificate_number: string;
        pdf_file_path: string;
        course_name: string;
        program_id: number;
    },
    content_certificate: Array<{
        certificate_number: string;
        pdf_file_path: string;
        content_name: string;
        content_type: string;
        content_id: number;
    }>
}

export interface ProgramAndContentCertificateApiResponse {
    status: number;
    data: ProgramAndContentCertificate
    error: string[];
}

// bellow code unused






export type Review = {
    id: number
    name: string
    image: string
    rating: number
    review: string
    date: string
}

export type Testimonial = {
    id: number
    name: string
    image: string
    testimonial: string
    date: string
}

export type Instructor = {
    id: number
    name: string
    image: string
    bio: string
    ratings: number
}


export type Provider = {
    id: number
    name: string
    logo: string
}

// export type Module = {
//     id: number
//     title: string
//     description: string
//     duration: string
//     content: Content[],
//     whats_included?: WhatsIncluded[]
// }

export type WhatsIncluded = {
    title: string
    type: 'video' | 'reading' | 'assignment'
}

// export type Content = {
//     id: number
//     title: string
//     description: string
//     type: 'video' | 'reading' | 'assignment'
//     content: SubContent[]
// }

export type SubContent = {
    title: string
    duration: string
    video_transcript?: string
    video_url?: string
}

export type getCourseByIdResponse = {
    message: string,
    data: Course,
    status: number,
    error: string[]
}

export type getModuleResponse = {
    message: string,
    data: {
        courseDetails: Course,
        moduleDetails: Module
    },
    status: number,
    error: string[]
}

export type getContinueReadingCoursesResponse = {
    message: string,
    data: {
        courses: Course[]
    },
    status: number,
    error: string[]
}


// course completion
export type ConetentCompletionApiResponse = {
    status: number
    message: string
}

// statistics
export type CourseStatistics = {
    assigned: number,
    completed: number,
    progress: number,
    pending: number,
}

export type CourseStatisticsApiResponse = {
    status: number
    data: CourseStatistics
    error: string[]
}


// attendance statistics
export type AttendanceStatistics = {
    present: number
    absent: number
}

export type AttendanceStatisticsApiResponse = {
    status: number
    data: AttendanceStatistics
    error: string[]
}

// event statistics
export type EventStatistics = {
    total_events: number
    joined_events: number
}

export type EventStatisticsApiResponse = {
    status: number
    data: EventStatistics
    error: string[]
}

// active hours statistics
export type ActiveHoursStatistics = {
    day: string
    hours: number
}


export type ActiveHoursStatisticsApiResponse = {
    status: number
    data: ActiveHoursStatistics[]
    error: string[]
}

export type Resource = {
    id: number
    name: string
    type: string
    category: string;
    sub_type: string;
    skill_level: string;
    course_type: string;
    logo_url: string
    description: string
    purpose: string
    pricing: string;
    official_url: string | null;
    saved: number;
    paid_status: string;
}

export type ResourcesApiResponse = {
    status: number
    data: Resource[]
    error: string[]

}


export type CourseCategoryDomain = {
    id: number;
    name: string;
    description: string;
    industry_category: string;
    keywords: string | null;
    addedby: number | null;
    added_on: string | null;
    updatedby: number | null;
    lastupdated: string | null;
    status: string | null;
    parent_id: number | null;
    created_at: string | null;
    number_of_jobs: number | null;
    growth: number | null;
    growth_type: string | null;
    organization_id: number;
    icon_url: string | null;
    updated_at: string | null;
}

export type CourseCategoryDomainApiResponse = {
    status: number;
    data: CourseCategoryDomain[];
    error: string[];
}

// continue previous content
export type ContinuePreviousContent = {
    assessment_status: number;
    completion_percentage: string;
    content_type: string;
    id: number;
    module_id: number;
    module_name: string;
    title: string;
    jump_to: {
        assessment_status: number;
        completion_percentage: string;
        content_type: string;
        id: number;
        module_id: number;
        module_name: string;
        title: string;
    }
}

export type ContinuePreviousContentApiResponse = {
    status: number;
    data: ContinuePreviousContent;
    error: string[];
}

export type EnrolledCourse = {
    s_no: number
    id: number
    course_name: string
    delivery_mode: string
    completion_percentage: number
    assigned_date: string
}

export type EnrolledCoursesApiResponse = {
    status: number
    data: EnrolledCourse[]
    error: string
}