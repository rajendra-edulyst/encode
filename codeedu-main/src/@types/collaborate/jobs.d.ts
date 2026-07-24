export interface Job {
    id: number;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    organization_id: number;
    is_job: number;
    is_internship: number | null;
    location: string;
    experience: string;
    venue: string;
    job_status: string;
    job_in_org_name: string;
    job_in_org_logo: string;
    job_type: string;
    domain_name: string;
    company_name: string;
    company_logo: string;
    created_at: string;
    job_status_numeric: number;
    skill_matching_percentage: number;
    skill_names?: string;
    program?: string | null;
    table_no?: string | null;
}

export interface JobApiResponse {
    status: number;
    data: Job[];
    error: string[];
}

export interface JobStatsCounts {
    tot_vacancies: number,
    tot_job_roles: number,
    in_pool: number,
    Verified: number,
    resume_matches: number
}

export type JobStatsApiResponse = {
    status: number;
    data: JobStatsCounts;
    error: string | null;
}

export interface InstituteOverviewStats {
    jobs_posted: number;
    applications_received: number;
    masterclasses: number;
    total_participants: number;
    mentor_slots_booked: number;
    opinion_polls_conducted: number;
}

export interface InstituteOverviewApiResponse {
    status: number;
    data: InstituteOverviewStats;
    error: string | null;
}

export interface InstituteLicensesPlanStats {
    explorer: number;
    builder: number;
    navigator: number;
}

export interface InstituteLicensesPlanApiResponse {
    status: number;
    data: InstituteLicensesPlanStats;
    error: string | null;
}

export interface PlanStats {
    total_courses: number;
    mentor_slots: number;
    on_the_agenda: number;
    peak_actions: number;
    licenses_used: number;
    total_licenses: number;
}

export interface InstitutePlanDetailsStats {
    explorer: PlanStats;
    builder: PlanStats;
    navigator: PlanStats;
}

export interface InstitutePlanDetailsApiResponse {
    status: number;
    data: InstitutePlanDetailsStats;
    error: string | null;
}

export interface DepartmentLicense {
    id: number;
    department_id?: number;
    department: string;
    hod: string;
    total_licenses: number;
    explorer: number;
    builder: number;
    navigator: number;
}

export interface InstituteDepartmentLicensesApiResponse {
    status: number;
    data: DepartmentLicense[];
    error: string | null;
}

export interface StatItem {
    value: number;
    percentage: number;
    increase_or_decrease: number; // 0 or 1
}

export interface AgendaStat {
    event_cat_id: number;
    name: string;
    count: number;
}

export type InstituteAgendaStats = AgendaStat[];

export interface InstituteAgendaStatsApiResponse {
    status: number;
    data: InstituteAgendaStats;
    error: string | null;
}

export type InstituteMustAttendStats = AgendaStat[];

export interface InstituteMustAttendStatsApiResponse {
    status: number;
    data: InstituteMustAttendStats;
    error: string | null;
}

export interface InstituteJobsStats {
    opportunities: number;
    num_of_vacancy: number;
    applied: number;
    under_process: number;
    under_review: number;
    placed: number;
    rejected: number;
    placement_per: number;
    published_jobs: number;
    unpublished_jobs: number;
    inactive_jobs: number;
    total_profiles: number;
}

export interface InstituteJobsStatsApiResponse {
    status: number;
    data: InstituteJobsStats;
    error: string | null;
}

export interface DepartmentCourseStats {
    id: number;
    department_id?: number;
    department: string;
    hod: string;
    total_courses: number;
    self_paced: number;
    live_online: number;
    in_class: number;
    certifications: number;
    total_users: number;
}

export interface CurrentCourse {
    course_id: number;
    course_name: string;
    learning_hours: string;
    completion_rate: number;
    last_active: string;
}

export interface DepartmentStudentActivity {
    user_id: number;
    student_name: string;
    student_email: string;
    profile_image: string | null;
    current_courses: CurrentCourse[];
}

export interface DepartmentStudentActivityApiResponse {
    status: number;
    data: DepartmentStudentActivity[];
    error: string | null;
}

export interface DepartmentCourseProgress {
    course_name: string;
    course_type: string;
    students: number;
    progress: number;
    grade_certificate: number;
    end_date: string;
}

export interface DepartmentCourseProgressApiResponse {
    status: number;
    data: DepartmentCourseProgress[];
    error: string | null;
}

export interface InstituteDepartmentOverview {
    department_name: string;
    hod_name: string;
    number_of_courses: number;
    number_of_user: number;
    total_licence: number;
    assigned_licnce: number;
}

export interface InstituteDepartmentOverviewApiResponse {
    status: number;
    data: InstituteDepartmentOverview;
    error: string | null;
}

export interface InstituteDepartmentCourseStatsApiResponse {
    status: number;
    data: DepartmentCourseStats[];
    error: string | null;
}