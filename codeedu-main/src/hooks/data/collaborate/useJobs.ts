import {
    fetchJobOpportunityDashboardStats,
    fetchInstituteOverview,
    fetchInstituteLicensesPlan,
    fetchCoursePerDepartment,
    fetchInstitutePlanDetails,
    fetchInstituteDepartmentLicenses,
    fetchInstituteAgendaStats,
    fetchInstituteMustAttendStats,
    fetchInstituteJobsStats,
    fetchDepartmentCourseStats,
    fetchDepartmentStudentActivity,
    fetchDepartmentCourseProgress,
    fetchInstituteDepartmentOverview
} from "@/services/collaborate/JobService";
import { useQuery } from "@tanstack/react-query";
import {
    JobStatsCounts,
    InstituteOverviewStats,
    InstituteLicensesPlanStats,
    InstitutePlanDetailsStats,
    DepartmentLicense,
    InstituteAgendaStats,
    InstituteMustAttendStats,
    InstituteJobsStats,
    DepartmentCourseStats,
    DepartmentStudentActivity,
    DepartmentCourseProgress,
    InstituteDepartmentOverview
} from "@/@types/collaborate/jobs";

export const useJobOpportunityDashboardStats = () => {
    return useQuery<JobStatsCounts>({
        queryKey: ['job-opportunity-dashboard-stats'],
        queryFn: async () => {
            const res = await fetchJobOpportunityDashboardStats();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteOverview = (filter: string) => {
    return useQuery<InstituteOverviewStats>({
        queryKey: ['institute-overview', filter],
        queryFn: async () => {
            const res = await fetchInstituteOverview(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteLicensesPlan = (filter: string) => {
    return useQuery<InstituteLicensesPlanStats>({
        queryKey: ['institute-licenses-plan', filter],
        queryFn: async () => {
            const res = await fetchInstituteLicensesPlan(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCoursePerDepartment = (filter: string) => {
    return useQuery<JobStatsCounts>({
        queryKey: ['course-per-department', filter],
        queryFn: async () => {
            const res = await fetchCoursePerDepartment(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstitutePlanDetails = () => {
    return useQuery<InstitutePlanDetailsStats>({
        queryKey: ['institute-plan-details'],
        queryFn: async () => {
            const res = await fetchInstitutePlanDetails();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteDepartmentLicenses = (filter: string) => {
    return useQuery<DepartmentLicense[]>({
        queryKey: ['institute-department-licenses', filter],
        queryFn: async () => {
            const res = await fetchInstituteDepartmentLicenses(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteAgendaStats = (filter: string) => {
    return useQuery<InstituteAgendaStats>({
        queryKey: ['institute-agenda-stats', filter],
        queryFn: async () => {
            const res = await fetchInstituteAgendaStats(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteMustAttendStats = (filter: string) => {
    return useQuery<InstituteMustAttendStats>({
        queryKey: ['institute-must-attend-stats', filter],
        queryFn: async () => {
            const res = await fetchInstituteMustAttendStats(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteJobsStats = (filter: string) => {
    return useQuery<InstituteJobsStats>({
        queryKey: ['institute-jobs-stats', filter],
        queryFn: async () => {
            const res = await fetchInstituteJobsStats(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useDepartmentCourseStats = (filter: string) => {
    return useQuery<DepartmentCourseStats[]>({
        queryKey: ['department-course-stats', filter],
        queryFn: async () => {
            const res = await fetchDepartmentCourseStats(filter);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useDepartmentStudentActivity = (department_id: number, program_id: number | null = null) => {
    return useQuery<DepartmentStudentActivity[]>({
        queryKey: ['department-student-activity', department_id, program_id],
        queryFn: async () => {
            const res = await fetchDepartmentStudentActivity(department_id, program_id);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useDepartmentCourseProgress = (department_id: number, program_id: number | null = null) => {
    return useQuery<DepartmentCourseProgress[]>({
        queryKey: ['department-course-progress', department_id, program_id],
        queryFn: async () => {
            const res = await fetchDepartmentCourseProgress(department_id, program_id);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstituteDepartmentOverview = (department_id: number) => {
    return useQuery<InstituteDepartmentOverview>({
        queryKey: ['institute-department-overview', department_id],
        queryFn: async () => {
            const res = await fetchInstituteDepartmentOverview(department_id);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
