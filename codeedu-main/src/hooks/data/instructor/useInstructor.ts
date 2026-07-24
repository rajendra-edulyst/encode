import { CourseStatsOverview, DashboardData, InstructorActivityStatsData, InstructorBuilderStatsData, InstructorCourse, InstructorLearnerListData, InstructorRatingsData, InstructorTopCourse, StudentCourseDetailsData } from "@/@types/create/instructor";
import { fetchInstructorActivityStats, fetchInstructorBuilderStats, fetchInstructorLearnerCourseList, fetchInstructorLearnerDetails, fetchInstructorLearnerList, fetchInstructorLearnerStats, fetchInstructorOverviewStats, fetchInstructorRatings, fetchInstructorTopCourses } from "@/services/instructor/InstructorService";
import { useQuery } from "@tanstack/react-query";

export const useInstructorBuilderStats = (type: string) => {
    return useQuery<InstructorBuilderStatsData>({
        queryKey: ["instructor-builder-stats", type],
        queryFn: async () => {
            const res = await fetchInstructorBuilderStats(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstructorTopCourses = (type: string) => {
    return useQuery<InstructorTopCourse[]>({
        queryKey: ["instructor-top-courses", type],

        queryFn: async () => {
            const res = await fetchInstructorTopCourses(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};
export const useInstructorActivityStats = (type: string) => {
    return useQuery<InstructorActivityStatsData>({
        queryKey: ["instructor-activity-stats", type],
        queryFn: async () => {
            const res = await fetchInstructorActivityStats(type);
            return res;
        },

        staleTime: 1000 * 60 * 5,
    });
};
export const useInstructorRatings = (type: string) => {
    return useQuery<InstructorRatingsData>({
        queryKey: ["instructor-ratings", type],
        queryFn: async () => {
            const res = await fetchInstructorRatings(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstructorOverview = (type: string) => {
    return useQuery<CourseStatsOverview>({
        queryKey: ["instructor-overview", type],
        queryFn: async () => {
            const res = await fetchInstructorOverviewStats(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstructorLearnerStats = (type: string) => {
    return useQuery<DashboardData>({
        queryKey: ["instructor-learner-stats", type],
        queryFn: async () => {
            const res = await fetchInstructorLearnerStats(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstructorLearnerList = (program_id: string) => {
    return useQuery<InstructorLearnerListData>({
        queryKey: ["instructor-learner-list", program_id],
        queryFn: async () => {
            const res = await fetchInstructorLearnerList(program_id);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useInstructorLearnerCourseList = (type: string) => {
    return useQuery<InstructorCourse[]>({
        queryKey: ["instructor-learner-course-list", type],
        queryFn: async () => {
            const res = await fetchInstructorLearnerCourseList(type);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};
export const useInstructorLearnerDetails = (program_id: string, user_id: string) => {
    return useQuery<StudentCourseDetailsData>({
        queryKey: ["instructor-learner-details", program_id, user_id],
        queryFn: async () => {
            const res = await fetchInstructorLearnerDetails(program_id, user_id);
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
};



