import ApiService from "../ApiService";
import { JobStatsApiResponse, JobStatsCounts, InstituteOverviewApiResponse, InstituteOverviewStats, InstituteLicensesPlanApiResponse, InstituteLicensesPlanStats, InstitutePlanDetailsApiResponse, InstitutePlanDetailsStats, InstituteDepartmentLicensesApiResponse, DepartmentLicense, InstituteAgendaStatsApiResponse, InstituteAgendaStats, InstituteMustAttendStatsApiResponse, InstituteMustAttendStats, InstituteJobsStatsApiResponse, InstituteJobsStats, InstituteDepartmentCourseStatsApiResponse, DepartmentCourseStats, DepartmentStudentActivity, DepartmentStudentActivityApiResponse, DepartmentCourseProgress, DepartmentCourseProgressApiResponse, InstituteDepartmentOverview, InstituteDepartmentOverviewApiResponse } from "@/@types/collaborate/jobs";

export async function fetchJobOpportunityDashboardStats(): Promise<JobStatsCounts> {
    try {
        const response = await ApiService.fetchDataWithAxios<JobStatsApiResponse>({
            url: '/job_management_stats',
            method: 'get',
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteOverview(filter: string): Promise<InstituteOverviewStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteOverviewApiResponse>({
            url: '/v1/dashboard/institute-overview',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? {} as InstituteOverviewStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteLicensesPlan(filter: string): Promise<InstituteLicensesPlanStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteLicensesPlanApiResponse>({
            url: '/v1/dashboard/institute-licenses-plan',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? {} as InstituteLicensesPlanStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCoursePerDepartment(filter: string): Promise<JobStatsCounts> {
    try {
        const response = await ApiService.fetchDataWithAxios<JobStatsApiResponse>({
            url: '/v1/dashboard/course-per-department',
            method: 'post',
            data: { type: filter }
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstitutePlanDetails(): Promise<InstitutePlanDetailsStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstitutePlanDetailsApiResponse>({
            url: '/v1/dashboard/institute-plan-details',
            method: 'post',
            data: { filter: 'yearly' }
        })
        return response?.data ?? {} as InstitutePlanDetailsStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteDepartmentLicenses(filter: string): Promise<DepartmentLicense[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteDepartmentLicensesApiResponse>({
            url: '/v1/dashboard/institute-department-licenses',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteAgendaStats(filter: string): Promise<InstituteAgendaStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteAgendaStatsApiResponse>({
            url: '/v1/dashboard/institute-agenda-stats',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? [] as InstituteAgendaStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteMustAttendStats(filter: string): Promise<InstituteMustAttendStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteMustAttendStatsApiResponse>({
            url: '/v1/dashboard/institute-must-attend-stats',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? [] as InstituteMustAttendStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteJobsStats(filter: string): Promise<InstituteJobsStats> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteJobsStatsApiResponse>({
            url: '/v1/dashboard/institute-jobs-stats',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? {} as InstituteJobsStats;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchDepartmentCourseStats(filter: string): Promise<DepartmentCourseStats[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteDepartmentCourseStatsApiResponse>({
            url: '/v1/dashboard/department-course-stats',
            method: 'post',
            data: { filter }
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchDepartmentStudentActivity(department_id: number, program_id: number | null = null): Promise<DepartmentStudentActivity[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<DepartmentStudentActivityApiResponse>({
            url: '/v1/dashboard/department-students-activity',
            method: 'post',
            data: { department_id, program_id }
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchDepartmentCourseProgress(department_id: number, program_id: number | null = null): Promise<DepartmentCourseProgress[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<DepartmentCourseProgressApiResponse>({
            // url: '/v1/dashboard/department-course-progress',
            url: '/v1/dashboard/department-programs-progress',
            method: 'post',
            data: { department_id, program_id }
        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteDepartmentOverview(department_id: number): Promise<InstituteDepartmentOverview> {
    try {
        const response = await ApiService.fetchDataWithAxios<InstituteDepartmentOverviewApiResponse>({
            url: '/v1/dashboard/institute-department-overview',
            method: 'post',
            data: { department_id }
        })
        return response?.data ?? {} as InstituteDepartmentOverview;
    } catch (error) {
        throw error as string;
    }
}
