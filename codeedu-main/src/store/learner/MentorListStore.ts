import { User } from '@/@types/learner/mentor';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type MentorListState = {
    mentors?: User[],
    setMentors: (mentor: User[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useMentorStore = create<MentorListState>()(
    persist(
        (set) => ({
            setMentors: (mentors: User[]) => set({ mentors }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'MentorsFacultyStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
