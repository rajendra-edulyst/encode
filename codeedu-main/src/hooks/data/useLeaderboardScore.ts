import { useQuery } from '@tanstack/react-query';
import { LeaderboardUser } from '@/@types/learner/leaderboard';
import { fetchMyCompetitionLeaderboard } from '@/services/learner/ScoreboardService';

export const useMyLeaderboard = () => {
    return useQuery<LeaderboardUser>({
        queryKey: ['my-leaderboard'],
        queryFn: async () => {
            const res = await fetchMyCompetitionLeaderboard();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
