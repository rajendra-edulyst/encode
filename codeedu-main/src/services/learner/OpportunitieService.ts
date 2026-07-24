import ApiService from '@/services/ApiService';
import { InternshipDetailsApiResponse, Job, Program, ProgramResponse } from '@/@types/learner/Jobs';

// Fetch all jobs
export async function fetchJobs(params?: URLSearchParams): Promise<Program[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramResponse>({
            url: '/job-list-wow',
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchRecommendedJobRoles(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/v1/user-recommended-job-roles-old',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchNoahRecommendedJobRoles(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/v1/user-recommended-job-roles',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchStageSkills(params?: URLSearchParams): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramResponse>({
            url: '/get_creative_stage_result',
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInternshipDetails(id: string): Promise<Job> {
    try {
        const response = await ApiService.fetchDataWithAxios<InternshipDetailsApiResponse>({
            url: `/v1/internships/${id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchSkillsList(params?: URLSearchParams): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/skills-list',
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchSkillsMappingListCreative(): Promise<any> {
    try {
        const params = new URLSearchParams();
        params.append('creative', '1');
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/skills-mapping-list',
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCciqReportStatistics(params?: URLSearchParams): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/cciq_report_statistics',
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}