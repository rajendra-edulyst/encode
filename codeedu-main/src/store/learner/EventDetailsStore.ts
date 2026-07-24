import { EventDetails } from '@/@types/collaborate/events'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type EventState = {
    eventDetails: EventDetails
    setEventDetails: (event: EventDetails) => void
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useEventDetailsStore = create<EventState>()(
    persist(
        (set) => ({
            eventDetails: {} as EventDetails,
            setEventDetails: (eventDetails: EventDetails) => set({ eventDetails }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
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