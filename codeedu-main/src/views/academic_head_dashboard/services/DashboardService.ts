import ApiService from '@/services/ApiService';

export interface ApiGrowthTrend {
    month_date: string;
    'SUM(total_students)': string;
}

export interface ApiProgressSegment {
    status: string;
    'SUM(total)': string;
}

export interface ApiTopInstitution {
    organization_name: string;
    students_enrolled: number;
    internal_faculty: number;
    completion_percentage: string;
}

export interface ApiDashboardData {
    total_institutes: number;
    total_institutes_change?: string;
    total_students: number;
    total_students_change?: string;
    total_encode_instructors: number;
    total_encode_instructors_change?: string;
    total_internal_faculty: number;
    growth_trends: ApiGrowthTrend[];
    students_progress_distribution: ApiProgressSegment[];
    top_performing_institutions: ApiTopInstitution[];
}

export interface ApiDashboardResponse {
    status: number;
    message: string;
    data: ApiDashboardData;
}

export async function fetchDashboardStatistics(filter?: string): Promise<ApiDashboardResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiDashboardResponse>({
            url: '/dashboard_statistics',
            method: 'get',
            params: filter ? { filter } : undefined
        });
        return response;
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        return null;
    }
}

export interface ApiCourseDistribution {
    organization_id: number;
    institution_name: string;
    course_available: number;
    course_assigned: number;
    courses_running: number;
    most_active_course: string | null;
    least_active_course: string | null;
}

export interface ApiCourseDashboardData {
    total_courses: number;
    total_courses_change?: string;
    assigned_courses: number;
    assigned_courses_change?: string;
    running_courses: number;
    running_courses_change?: string;
    average_completion: string;
    course_distribution_by_institutions: ApiCourseDistribution[];
}

export interface ApiCourseDashboardResponse {
    status: number;
    message: string;
    data: ApiCourseDashboardData;
}

export async function fetchCourseDashboardStatistics(filter?: string): Promise<ApiCourseDashboardResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiCourseDashboardResponse>({
            url: '/course_dashboard_statistics',
            method: 'get',
            params: filter ? { filter } : undefined
        });
        return response;
    } catch (error) {
        console.error('Error fetching course dashboard statistics:', error);
        return null;
    }
}

export interface ApiInstitutionCourse {
    course_name: string;
    domain: string;
    module: string;
    duration: string;
    status: 'Running' | 'Completed' | 'Not Assigned';
    instructor: string;
    enrolled: number;
    completion: string;
}

export interface ApiInstitutionDashboardData {
    organization: {
        id: number;
        name: string;
    };
    running_courses: number;
    total_enrollments: number;
    average_completion: string;
    assigned_courses: number;
    total_courses: number;
    courses: ApiInstitutionCourse[];
}

export interface ApiInstitutionDashboardResponse {
    status: number;
    message: string;
    data: ApiInstitutionDashboardData;
}

export async function fetchInstitutionDashboardStatistics(organizationId: string | number): Promise<ApiInstitutionDashboardResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiInstitutionDashboardResponse>({
            url: '/institution_dashboard_statistics',
            method: 'get',
            params: { organization_id: organizationId }
        });
        return response;
    } catch (error) {
        console.error('Error fetching institution dashboard statistics:', error);
        return null;
    }
}

export interface ApiAcademicHeadInstitution {
    organization_id: number;
    organization_name: string;
    total_students: number;
    faculty: number;
    completed: number;
    in_progress: number;
    not_started: number;
}

export interface ApiAcademicHeadDashboardData {
    total_students: number;
    total_students_change?: string;
    total_assigned_students: number;
    not_assigned_students: number;
    completed: number;
    completed_change?: string;
    in_progress: number;
    in_progress_change?: string;
    not_started: number;
    not_started_change?: string;
    institutions: ApiAcademicHeadInstitution[];
}

export interface ApiAcademicHeadDashboardResponse {
    status: number;
    message: string;
    data: ApiAcademicHeadDashboardData;
}

export async function fetchAcademicHeadDashboardStatistics(filter?: string): Promise<ApiAcademicHeadDashboardResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiAcademicHeadDashboardResponse>({
            url: '/academic_head_dashboard_statistics',
            method: 'get',
            params: filter ? { filter } : undefined
        });
        return response;
    } catch (error) {
        console.error('Error fetching academic head dashboard statistics:', error);
        return null;
    }
}

export interface ApiAcademicHeadDepartment {
    department_id: number;
    department: string;
    hod: string;
    courses_aligned: number;
    students_enrolled: number;
    faculty: number;
    avg_completion: string;
}

export interface ApiAcademicHeadDepartmentData {
    total_departments: number;
    total_departments_change?: string;
    total_courses: number;
    total_courses_change?: string;
    total_students: number;
    total_students_change?: string;
    total_faculty: number;
    total_faculty_change?: string;
    departments: ApiAcademicHeadDepartment[];
}

export interface ApiAcademicHeadDepartmentResponse {
    status: number;
    message: string;
    data: ApiAcademicHeadDepartmentData;
}

export async function fetchAcademicHeadDepartmentStatistics(organizationId: string | number, filter?: string): Promise<ApiAcademicHeadDepartmentResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiAcademicHeadDepartmentResponse>({
            url: '/academic_head_department_statistics',
            method: 'get',
            params: {
                organization_id: organizationId,
                ...(filter ? { filter } : {})
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching academic head department statistics:', error);
        return null;
    }
}

export interface ApiAcademicHeadCourse {
    course_id: number;
    course_name: string;
    module: string;
    instructor: string;
    students_enrolled: number;
    duration: string;
    completion_rate: string;
}

export interface ApiAcademicHeadCourseData {
    total_courses: number;
    total_courses_change?: string;
    total_students: number;
    total_students_change?: string;
    avg_completion: string;
    avg_completion_change?: string;
    courses: ApiAcademicHeadCourse[];
}

export interface ApiAcademicHeadCourseResponse {
    status: number;
    message: string;
    data: ApiAcademicHeadCourseData;
}

export async function fetchAcademicHeadCourseStatistics(departmentId: string | number, filter?: string): Promise<ApiAcademicHeadCourseResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiAcademicHeadCourseResponse>({
            url: '/academic_head_course_statistics',
            method: 'get',
            params: {
                department_id: departmentId,
                ...(filter ? { filter } : {})
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching academic head course statistics:', error);
        return null;
    }
}

export interface ApiAcademicHeadStudent {
    user_id: number;
    student_name: string;
    student_email: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
    assignments: string;
    progress: string;
    grade: string;
    last_active: string;
}

export interface ApiAcademicHeadStudentData {
    total_students: number;
    total_students_change?: string;
    completed: number;
    completed_change?: string;
    in_progress: number;
    in_progress_change?: string;
    not_started: number;
    not_started_change?: string;
    students: ApiAcademicHeadStudent[];
}

export interface ApiAcademicHeadStudentResponse {
    status: number;
    message: string;
    data: ApiAcademicHeadStudentData;
}

export async function fetchAcademicHeadStudentStatistics(courseId: string | number, departmentId?: string | number): Promise<ApiAcademicHeadStudentResponse | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiAcademicHeadStudentResponse>({
            url: '/academic_head_student_statistics',
            method: 'get',
            params: {
                course_id: courseId,
                ...(departmentId ? { department_id: departmentId } : {})
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching academic head student statistics:', error);
        return null;
    }
}
