import { Event, EventDetailsData } from '@/@types/public/event';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EventState = {
    events: Event[];
    setEvents: (events: Event[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useEventStore = create<EventState>()(
    persist(
        (set) => ({
            events: [],
            setEvents: (events: Event[]) => set({ events }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'eventStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


type EventDetailsState = {
    eventdetails: EventDetailsData;
    setEventDetails: (eventdetails: EventDetailsData) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useEventDetailsStore = create<EventDetailsState>()(
    persist(
        (set) => ({
            eventdetails: {} as EventDetailsData,
            setEventDetails: (eventdetails: EventDetailsData) => set({ eventdetails }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'eventDetailsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
