import { AssessmentAttempt , AssessmentReview} from '@/@types/learner/assessment';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type AssessmentState = {
    assesment: AssessmentAttempt;
    setAssesment: (assesment: AssessmentAttempt) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssesmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            assesment: {} as AssessmentAttempt,
            setAssesment: (assesment: AssessmentAttempt) => set({ assesment }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assesmentStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


type AssessmentReviewState = {
    assessmentReview?: AssessmentReview;
    setAssessmentReview: (assessmentReview: AssessmentReview) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssessmentReviewStore = create<AssessmentReviewState>()(
    persist(
        (set) => ({
            assessmentReview: undefined,
            setAssessmentReview: (assessmentReview: AssessmentReview) => set({assessmentReview }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assessmentReviewStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
