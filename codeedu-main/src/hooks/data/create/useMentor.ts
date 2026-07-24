import { IndustryMentor, LMSMentor, Mentor, MentorMonthlyStats, MentorPerformance, MentorRankingItem, MentorSessionDetails, MentorSessionHistoryItem, MentorSessionHistoryStat, MentorStatsData, MentorUpcomingSession, RecentActivityItem, UpcomingSessionStats } from "@/@types/create/mentor";
import { fetchIndustryMentorsList, fetchMentorMonthlyStats, fetchMentorPerformance, fetchMentorRanking, fetchMentorSessionDetails, fetchMentorSessionHistory, fetchMentorSessionHistoryStat, fetchMentorsList, fetchMentorStats, fetchMentorUpcomingSessions, fetchMyMentorsList, fetchRecentActivity, fetchRecommendedMentorsList, fetchUpcomingSessionStats } from "@/services/create/MentorService";
import { useQuery } from "@tanstack/react-query";

export const useMentors = () => {
    return useQuery<Array<Mentor>>({
        queryKey: ['mentors'],
        queryFn: async () => {
            const res = await fetchMentorsList();
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePublicMentorListV2 = () => {
    return useQuery({
        queryKey: ['public-mentors-v2'],
        queryFn: async () => {
            const { fetchPublicMentorListV2 } = await import('@/services/create/MentorService');
            const res = await fetchPublicMentorListV2();
            return res.data;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useMyMentors = () => {
    return useQuery<Array<LMSMentor>>({
        queryKey: ['myMentors'],
        queryFn: async () => {
            const res = await fetchMyMentorsList();
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

export const useIndustriesMentors = (params?: URLSearchParams) => {
    return useQuery<Array<IndustryMentor>>({
        queryKey: ['industriesMentors', params?.toString()],
        queryFn: async () => {
            const res = await fetchIndustryMentorsList(params);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

// recommended mentors

export const useRecommendedMentors = () => {
    return useQuery<Array<LMSMentor>>({
        queryKey: ['recommendedMentors'],
        queryFn: async () => {
            const res = await fetchRecommendedMentorsList();
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

export const useMentorsStats = (type?: string) => {
    return useQuery<MentorStatsData>({
        queryKey: ['mentors-stats', type],
        queryFn: async () => {
            const res = await fetchMentorStats(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorsMonthlyStats = (type?: string) => {
    return useQuery<MentorMonthlyStats[]>({
        queryKey: ['mentors-monthly-stats', type],
        queryFn: async () => {
            const res = await fetchMentorMonthlyStats(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useMentorRanking = (type?: string) => {
    return useQuery<MentorRankingItem[]>({
        queryKey: ['mentor-ranking', type],
        queryFn: async () => {
            const res = await fetchMentorRanking(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useRecentActivity = (type?: string) => {
    return useQuery<RecentActivityItem[]>({
        queryKey: ['recent-activity', type],
        queryFn: async () => {
            const res = await fetchRecentActivity(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpcomingSessionStats = (type?: string) => {
    return useQuery<UpcomingSessionStats>({
        queryKey: ['upcoming-session-stats', type],
        queryFn: async () => {
            const res = await fetchUpcomingSessionStats(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorUpcomingSessions = (type?: string) => {
    return useQuery<MentorUpcomingSession[]>({
        queryKey: ['mentor-upcoming-sessions', type],
        queryFn: async () => {
            const res = await fetchMentorUpcomingSessions(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorSessionHistoryStat = (type?: string) => {
    return useQuery<MentorSessionHistoryStat>({
        queryKey: ['mentor-session-history-stat', type],
        queryFn: async () => {
            const res = await fetchMentorSessionHistoryStat(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorSessionHistory = (type?: string) => {
    return useQuery<MentorSessionHistoryItem[]>({
        queryKey: ['mentor-session-history', type],
        queryFn: async () => {
            const res = await fetchMentorSessionHistory(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorSessionDetails = (sessionId: number) => {
    return useQuery<MentorSessionDetails>({
        queryKey: ['mentor-session-details', sessionId],
        queryFn: async () => {
            const res = await fetchMentorSessionDetails(sessionId);
            return res ?? {};
        },
        enabled: !!sessionId,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorPerformance = (type?: string) => {
    return useQuery<MentorPerformance>({
        queryKey: ['mentor-performance', type],
        queryFn: async () => {
            const res = await fetchMentorPerformance(type);
            return res ?? {};
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useMentorshipStatus = () => {
    return useQuery({
        queryKey: ['mentorship-status'],
        queryFn: async () => {
            const { getMentorshipStatus } = await import('@/services/mentorship/mentorship');
            const res = await getMentorshipStatus();
            return res.data;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};







