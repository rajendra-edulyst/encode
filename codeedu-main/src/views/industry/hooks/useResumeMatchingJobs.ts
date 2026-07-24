import { useQuery } from '@tanstack/react-query';
import { exploreJobs } from '../services/ResumeService';
import { Job } from '../@types/jobs';

export const useResumeMatchingJobs = (resumeId: string) => {
    return useQuery<Job[]>({
        queryKey: ['resumes', resumeId],
        queryFn: async () => {
            const res = await exploreJobs(resumeId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
