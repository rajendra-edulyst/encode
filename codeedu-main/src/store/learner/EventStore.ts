import { ContentData } from '@/@types/collaborate/events'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type EventState = {
    events: Event[]
    setEvents: (event: Event[]) => void
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useEventStore = create<EventState>()(
    persist(
        (set) => ({
            events: [],
            setEvents: (events: Event[]) => set({ events }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
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


// event content store
type EventContentState = {
    content: ContentData
    setContent: (content: ContentData) => void
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useEventActivityContentStore = create<EventContentState>()(
    persist(
        (set) => ({
            content: {} as ContentData,
            setContent: (content: ContentData) => set({ content }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'eventActivityContentStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// calendar events store
type CalendarEventState = {
    events: Event[]
    setEvents: (events: Event[]) => void
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useCalendarEventStore = create<CalendarEventState>()(
    persist(
        (set) => ({
            events: [],
            setEvents: (events: Event[]) => set({ events }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
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