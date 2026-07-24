import { fetchEvent, fetchEventParticipatingIndustries, fetchEventJobs } from "@/services/learner/EventService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, EventCategory, EventDetails, ParticipatingIndustry } from '@/@types/collaborate/events'
import { Job } from '@/@types/collaborate/jobs'
import { fetchEventById, fetchEventCategories, createEvent, CreateEventRequest, updateEvent, UpdateEventRequest, fetchInternshipApply, fetchEventApply, fetchLearnerCompetitionDetail } from "@/services/collaborate/EventService";

export const useEvents = (params?: URLSearchParams | null, enabled: boolean = true) => {
    const queryKey = ['events', params ? params.toString() : ''];
    return useQuery<Array<Event>>({
        queryKey: queryKey,
        queryFn: async () => {
            const searchParams = new URLSearchParams(params?.toString());
            searchParams.append('type', 'event');
            const res = await fetchEvent(searchParams);
            return res ?? [];
        },
        retry: 1,
        enabled,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useAssignedEvents = () => {
    return useQuery<Array<Event>>({
        queryKey: ['assigned-events'],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            searchParams.append('is_assigned', '1');
            searchParams.append('type', 'event');
            const res = await fetchEvent(searchParams);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};



export const useEventById = (id: string | undefined, eventType?: string) => {
    return useQuery<EventDetails>({
        queryKey: ['event', id, eventType],
        queryFn: async () => {
            const res = await fetchEventById(id, eventType);
            return res;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}
export const useEventApply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, eventType }: { eventId: string; eventType?: string }) => {
            if (!eventId) throw new Error('Event ID is required');
            return await fetchEventApply(eventId, eventType);
        },
        onSuccess: (_, variables) => {
            const eventId = variables.eventId;
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['assigned-events'] });
            queryClient.invalidateQueries({ queryKey: ['event-activity-details', eventId] });
            queryClient.invalidateQueries({ queryKey: ['learner-competition-detail', eventId] });
        },
        retry: 1,
    });
};

export const useEventParticipatingIndustries = (id: string | undefined) => {
    return useQuery<ParticipatingIndustry[]>({
        queryKey: ['event-participating-industries', id],
        queryFn: async () => {
            if (!id) return [];
            const res = await fetchEventParticipatingIndustries(id);
            return res;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

export const useEventJobs = (id: string | undefined) => {
    return useQuery<Job[]>({
        queryKey: ['event-jobs', id],
        queryFn: async () => {
            if (!id) return [];
            const res = await fetchEventJobs(id);
            return res;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}


export const useJoinEvent = (id: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!id) {
                throw new Error('Event ID is required');
            }
            const res = await fetchInternshipApply(id);
            return res;
        },
        onSuccess: (data) => {
            if (!id) return;
            queryClient.setQueryData(['event', id], data);
            queryClient.invalidateQueries({ queryKey: ['event', id] });
        },
    });
}

export const useLearnerCompetitionDetail = (id: string | undefined, enabled = true) => {
    return useQuery<any>({
        queryKey: ['learner-competition-detail', id],
        queryFn: async () => {
            if (!id) return null;
            const res = await fetchLearnerCompetitionDetail(id);
            return res;
        },
        enabled: !!id && enabled,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

export const useEventCategories = () => {
    return useQuery<EventCategory[]>({
        queryKey: ['event-categories'],
        queryFn: async () => {
            const res = await fetchEventCategories();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

export const useCreateEvent = () => {
    return useMutation({
        mutationFn: (data: CreateEventRequest) => createEvent(data),
    });
}

export const useUpdateEvent = () => {
    return useMutation({
        mutationFn: (data: UpdateEventRequest) => updateEvent(data),
    });
}
