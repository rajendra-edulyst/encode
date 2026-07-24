export interface CoursesStatCount {
    [key: string]: {
        count: number;
        growth_percentage: number;
        growth_level: 'up' | 'down' | 'no_change';
    }
}

export interface CourseStatCountResponse {
    status: number;
    data: CoursesStatCount;
    error: string;
}

export interface CertificationsSummary {
    total_certifications: number;
    earned_certifications: number;
    pending_certifications: number;
}

export interface CertificationsSummaryResponse {
    status: number;
    data: CertificationsSummary;
    error: string;
}

export interface MentorSessionDay {
    month: string;
    count: number;
}

export interface MentorSessions {
    booked_sessions: MentorSessionDay[];
    completed_sessions: MentorSessionDay[];
    total_booked: number;
    total_completed: number;
}

export interface MentorSessionsResponse {
    status: number;
    data: MentorSessions;
    error: string;
}

export interface OpinionPolls {
    accessed_opinion_polls: number;
    available_opinion_polls: number;
    total_opinion_polls: number;
}

export interface OpinionPollsResponse {
    status: number;
    data: OpinionPolls;
    error: string;
}

export interface Milestone {
    title: string;
    description: string;
    date: string | null;
    status: 'Achieved' | 'In Progress' | 'Upcoming';
}

export interface MilestonesData {
    day_streak: number;
    milestones: Milestone[];
}

export interface MilestonesResponse {
    status: number;
    data: MilestonesData;
    error: string;
}

export interface CurrentCourse {
    course_id: number;
    course_name: string;
    course_type?: string;
    instructor_name?: string;
    progress_percentage: number;
    modules_completed: string;
    assessment_completed: string;
    image: string;
}

export interface CurrentCourseResponse {
    status: number;
    data: CurrentCourse;
    error: string;
}

export interface CertificateStatsData {
    certifications_earned: number;
    in_progress_certificates: number;
    pending_certificates: number;
}

export interface CertificateStatsResponse {
    status: number;
    data: CertificateStatsData;
    error: string;
}

export interface EarnedCertificate {
    certificate_name: string;
    issuing_organization: string;
    earned_date: string;
    grade: string;
    download_url: string;
}

export interface EarnedCertificatesResponse {
    status: number;
    data: EarnedCertificate[];
    error: string;
}

export interface SkillsBadgesSummaryData {
    total_badges: number;
    domains_progress: number;
    skills_earned_ratio: number;
}

export interface SkillsBadgesSummaryResponse {
    status: number;
    data: SkillsBadgesSummaryData;
    error: string;
}

// export interface LearningStageItem {
//     name: string;
//     progress: number;
// }

// export interface LearningStageData {
//     current_stage: string;
//     overall_progress: number;
//     stages: LearningStageItem[];
// }

// export interface LearningStageResponse {
//     status: number;
//     data: LearningStageData;
//     error: string;
// }
export interface ProgressLevel {
    level: string;
    percentage: number;
    completed: number;
    total: number;
}

export interface LearningStageItem {
    name: string;
    progress: number;
}

export interface LearningStageData {
    program: ProgressLevel;
    skill: ProgressLevel;
    domain: ProgressLevel;
    overall_progress: number;
    current_stage: string;
    stages: LearningStageItem[];
}

export interface LearningStageResponse {
    status: number;
    data: LearningStageData;
    error: string;
}


export interface SkillsProgressData {
    creative_thinking: number;
    visual_sense: number;
    problem_solving: number;
    logical_reasoning: number;
    design_awareness: number;
}

export interface SkillsProgressResponse {
    status: number;
    data: SkillsProgressData;
    error: string;
}

export interface DomainProgressItem {
    domain_name: string;
    completed_courses: number;
    total_courses: number;
    progress: number;
}

export interface DomainProgressResponse {
    status: number;
    data: DomainProgressItem[];
    error: string;
}

export interface BadgeItem {
    badge_name: string;
    badge_icon_url: string;
    badge_description: string;
    unlocked_date: string;
}

export interface BadgesResponse {
    status: number;
    data: BadgeItem[];
    error: string;
}

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

export type Organization = {
    id: number
    name: string
    logo: string
    organization_logo: string
}

export type Course = {
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
    category_id: number;
    created_by: number;
    category_name: string
    course_meta_data: {
        nature: string,
        duration: string,
        mode_of_delivery: string
    }
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
}

// Course Details Types
export type Faculty = {
    id: number
    name: string
    image: string
}

export type CourseDetails = {
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
    course_skills: string
    program_status: {
        program_status: string
        program_time: string
    }
    is_map_id: number | null
    subscription_type: string | null
    is_course_assigned: number
    course_meta: CourseMeta
}

export type CourseDetailsApiResponse = {
    status: number
    data: CourseDetails
    error: string[]
}


// assessment Types

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

export interface AssessmentAttemptDetails {
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
    question_sequence?: string;
}
export interface AssessmentAttempt {
    attempted_id: number;
    assessment_details: AssessmentAttemptDetails;
}


export interface AssessmentAttemptApiResponse {
    status: number;
    data: AssessmentAttempt;
    error: string[];
}

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
    question_solution?: string;
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
    module_id: string;
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
        studentLastViewed: number | null;
    }
    review_allowed: number
}

export interface AssessmentReviewResponse {
    status: number;
    data: {
        assessment_review: AssessmentReview;
    };
}



export interface AssessmentDetails {
    content_id: string;
    assessment_id: number;
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    passing_marks: number;
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
    attempted_id: number;
    question_count: number;
    program_name: string;
    module_name: string;
    latest_attempt_id: number;
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


// assessment result response

export interface AssessmentResult {
    content_id: string;
    question_count: number;
    marks: number;
    passing_marks: number;
    start_date: number;
    end_date: number;
    total_attempts: number;
    attempts_taken: number;
    overall_score: number;
    time_taken_seconds: number;
    overall_result: string;
    certificate_url: string;
    attempted_date: string;
}

export interface AssessmentResultResponse {
    status: number;
    data: {
        assessment_result: AssessmentResult;
    };
}

// {
//     "status": 1,
//     "data": {
//         "assessment_result": {
//             "content_id": "8496",
//             "question_count": 12,
//             "marks": 20,
//             "passing_marks": 12,
//             "start_date": 1759620660,
//             "end_date": 1783294200,
//             "total_attempts": 10,
//             "attempts_taken": 3,
//             "overall_score": 0,
//             "time_taken_seconds": 0,
//             "overall_result": "Fail",
//             "certificate_url": ""
//         }
//     },
//     "error": []
// }

// Courses Progress Types
export interface CourseProgressCategory {
    self_paced: number;
    in_class: number;
    live_online: number;
    certifications: number;
}

export interface CoursesProgress {
    assigned: CourseProgressCategory;
    pending: CourseProgressCategory;
    completed: CourseProgressCategory;
    in_progress: CourseProgressCategory;
}

export interface CoursesProgressResponse {
    status: number;
    data: CoursesProgress;
    error: string;
}

export interface CourseLearningHours {
    s_no: number;
    course_name: string;
    module: string;
    date: string;
    content_type: ContentType;
    start_time: string;
    end_time: string;
    duration: string;
}

export interface CourseLearningHoursResponse {
    status: number;
    data: CourseLearningHours[];
    error: string;
}
