import { User } from '@/@types/learner/mentor';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchMentorList } from '@/services/learner/MentorListService';


type MentorsListState = {
    mentors?: User[],
    setMentors: (mentor: User[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchMentors: () => Promise<void>;
};

export const useMentorsStore = create<MentorsListState>()(
    persist(
        (set) => ({
            setMentors: (mentors: User[]) => set({ mentors }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchMentors: async () => {
                set({ loading: true, error: null });
                try {
                    const mentors = await fetchMentorList('Mentor');
                    set({ mentors });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching mentors:', error.message);
                    } else {
                        console.error('Unknown error fetching mentors:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'mentorsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
