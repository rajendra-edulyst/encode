import { SubmissionDetail } from '@/@types/learner/assignmentDetails';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AssignmentSubmissionState = {
    assignmentSubmissionList: SubmissionDetail[];
    setAssignmentSubmissionList: (assignmentSubmissionList: SubmissionDetail[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssignmentSubmissionStore = create<AssignmentSubmissionState>()(
    persist(
        (set) => ({
            assignmentSubmissionList: [],
            setAssignmentSubmissionList: (assignmentSubmissionList: SubmissionDetail[]) => set({ assignmentSubmissionList }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assignmentSubmissionListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
