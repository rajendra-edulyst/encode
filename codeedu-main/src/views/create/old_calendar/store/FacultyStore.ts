import { User } from '../@types/calendar';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchMentorList } from '../services/CalendarService';

type FacultyListState = {
    faculty?: User[],
    setFaculty: (faculty: User[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchFaculty: () => Promise<void>;
};

export const useFacultyStore = create<FacultyListState>()(
    persist(
        (set) => ({
            setFaculty: (faculty: User[]) => set({ faculty }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchFaculty: async () => {
                set({ loading: true, error: null });
                try {
                    const faculty = await fetchMentorList('Faculty');
                    set({ faculty });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching faculty:', error.message);
                    } else {
                        console.error('Unknown error fetching faculty:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'facultyStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
