import { fetchCCIProgressReport, fetchInstructorActivityStats, fetchInstructorBuilderStats, fetchInstructorRatingsReviews, fetchInstructorStatsOverview, fetchInstructorTopCourses } from '@/services/create/InstructorService'
import { useQuery } from '@tanstack/react-query'

export const useInstructorStatsOverview = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['instructor-stats-overview', params?.toString()],
        queryFn: async () => {
            const res = await fetchInstructorStatsOverview(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}
export const useInstructorBuilderStats = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['instructor-builder-stats', params?.toString()],
        queryFn: async () => {
            const res = await fetchInstructorBuilderStats(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

export const useInstructorRatingsReviews = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['instructor-ratings-reviews', params?.toString()],
        queryFn: async () => {
            const res = await fetchInstructorRatingsReviews(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

export const useInstructorActivityStats = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['instructor-activity-stats', params?.toString()],
        queryFn: async () => {
            const res = await fetchInstructorActivityStats(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

export const useInstructorTopCourses = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['instructor-top-courses', params?.toString()],
        queryFn: async () => {
            const res = await fetchInstructorTopCourses(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

export const useCCIProgressReport = (params?: URLSearchParams) => {
    return useQuery({
        queryKey: ['cci-progress-report', params?.toString()],
        queryFn: async () => {
            const res = await fetchCCIProgressReport(params)
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}
