import { Program } from "@/@types/learner/Jobs";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type JobState = {
    jobs: Program[];
    setJobs: (jobs: Program[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useJobStore = create<JobState>()(
    persist(
        (set) => ({
            jobs: [],
            setJobs: (jobs: Program[]) => set({ jobs }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'jobStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);