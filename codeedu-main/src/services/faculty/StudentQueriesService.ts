import ApiService from '@/services/ApiService';

export interface StudentJobLead {
    user_id: number;
    name: string;
    email: string;
    profile_image: string | null;
    id: number;
    is_latest: number;
    type: number;
    company_name: string | null;
    job_role: string | null;
    designation: string | null;
    salary_package: string | null;
    company_full_address: string | null;
    company_mobile: string | null;
    company_email: string | null;
    location: string | null;
    joining_date: string | null;
    duration: string | null;
    domain_name: string | null;
    project_details: string | null;
    problem_challenge: string | null;
    current_location: string | null;
    preferred_location: string | null;
    desired_job_domain: string | null;
    desired_joining_date: string | null;
    mentor_name: string | null;
    note: string | null;
    pdf_path: string | null;
    created_at: string;
    updated_at: string;
    college: string | null;
    course: string | null;
    passing_year: string | null;
}

export interface StudentQueriesResponse {
    status: number;
    data: StudentJobLead[];
    error: any[];
}

export async function getStudentQueries(): Promise<StudentQueriesResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<StudentQueriesResponse>({
            url: '/students-job-leads',
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error;
    }
}
