import { useQuery } from '@tanstack/react-query';
import { Resume } from '../@types/resume';
import { fetchResumes } from '../services/ResumeService';

export const useResumes = (filters: URLSearchParams) => {
    return useQuery<Resume[]>({
        queryKey: ['resumes', filters.toString()],
        queryFn: async () => {
            const res = await fetchResumes(filters);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
