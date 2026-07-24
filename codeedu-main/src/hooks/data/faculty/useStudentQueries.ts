import { useQuery } from '@tanstack/react-query';
import { getStudentQueries, StudentQueriesResponse } from '@/services/faculty/StudentQueriesService';

export const useStudentQueries = () => {
    return useQuery<StudentQueriesResponse, Error>({
        queryKey: ['studentQueries'],
        queryFn: () => getStudentQueries(),
        refetchOnWindowFocus: false,
    });
};
