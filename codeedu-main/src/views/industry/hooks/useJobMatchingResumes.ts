/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { fetchMatchingResumes } from '../services/JobService';
import { MatchingJobCandidate } from '../@types/jobs';

export const useJobMatchingResumes = (jobId: number) => {
    return useQuery<MatchingJobCandidate[]>({
        queryKey: ['jobMatchingResumes', jobId],
        queryFn: async ({ queryKey }) => {
            const [_, jobId] = queryKey as [string, number];
            if (!jobId) {
                return [];
            }
            const res = await fetchMatchingResumes(jobId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};