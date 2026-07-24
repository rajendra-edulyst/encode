import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarEvent } from '../types/calendar';

type CalendarState = {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      setEvents: (events) => set({ events }),
      addEvent: (event) => set({ events: [...get().events, event] }),
      updateEvent: (event) => set({ events: get().events.map((e) => (e.id === event.id ? event : e)) }),
      removeEvent: (id) => set({ events: get().events.filter((e) => e.id !== id) }),
    }),
    {
      name: 'calendar-events-store',
      // use localStorage (default) but keep simple JSON
    }
  )
);

export default useCalendarStore;
