import { Event } from '@calendar/@types/calendar';
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
            name: 'calendarEventStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
