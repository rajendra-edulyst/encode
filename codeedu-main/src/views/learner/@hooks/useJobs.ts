import { Program } from "@/@types/learner/Jobs";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs as myJobs } from "../@services/JobService";
import { fetchJobs as publishedJobs } from "@/services/learner/OpportunitieService";
import { Job } from "../@types/jobs";


export const usePublishedJobs = (params?: URLSearchParams) => {
    return useQuery<Array<Program>>({
        queryKey: ['publishedJobs', params?.toString()],
        queryFn: async () => {
            const res = await publishedJobs(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


// self_created=1
export const useMyJobs = (params?: URLSearchParams) => {
    return useQuery<Array<Job>>({
        queryKey: ['myJobs', params],
        queryFn: async () => {
            const res = await myJobs(params);
            return res?.data ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};