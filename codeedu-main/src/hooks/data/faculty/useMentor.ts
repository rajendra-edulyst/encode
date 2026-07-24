import { AllMentorList, LMSMentor } from '@/@types/create/mentor';
import { EventData, PendingInvites } from '@/views/create/old_calendar/@types/calendar';
import { fetchAllCalendarSessions, fetchMentorListV2, fetchPendingInvites } from '@/views/create/old_calendar/services/CalendarService';
import { useQuery } from '@tanstack/react-query';

export const useMentoringSessions = (enabled = true) => {
    return useQuery<EventData>({
        queryKey: ['mentoring-sessions'],
        queryFn: async () => {
            const res = await fetchAllCalendarSessions();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled,
    });
};

// pending invites mentoring sessions

export const usePendingInvites = () => {
    return useQuery<Array<PendingInvites>>({
        queryKey: ['pending-invites'],
        queryFn: async () => {
            const res = await fetchPendingInvites();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}



export const useMentorListV2 = () => {
    return useQuery<Array<AllMentorList>>({
        queryKey: ['mentor-list-v2'],
        queryFn: async () => {
            const res = await fetchMentorListV2();
            return res.data;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}