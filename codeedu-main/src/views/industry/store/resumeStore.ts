import { Resume } from '@/@types/employability/resume';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MachingJonState {
    resumes: Resume[] | null;
    setResumes: (resumes: Resume[]) => void;
    clearResumes: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useResumeStore = create<MachingJonState>()(
    persist(
        (set) => ({
            resumes: null,
            setResumes: (resumes) => set({ resumes }),
            clearResumes: () => set({ resumes: null }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'resumeStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);