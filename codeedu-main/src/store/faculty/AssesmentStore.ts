import { AssessmentDetails, AssessmentLearner, Question } from "@/@types/faculty/assessment";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { fetchAssessment, fetchAssessmentAttemptsUsers } from "@/services/faculty/AssessmentService";

// type AssessmentState = {
//     assessments: Assessment[];
//     setAssessments: (assessments: Assessment[]) => void;
//     loading: boolean;
//     setLoading: (loading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
//     fetchAssessments: (params?: URLSearchParams) => Promise<void>;
// };

// export const useAssessmentStore = create<AssessmentState>()(
//     persist(
//         (set) => ({
//             assessments: [],
//             setAssessments: (assessments: Assessment[]) => set({ assessments }),
//             loading: false,
//             setLoading: (loading: boolean) => set({ loading }),
//             error: null,
//             setError: (error: string | null) => set({ error }),
//             fetchAssessments: async (params) => {
//                 set({ loading: true, error: null });
//                 try {
//                     const response = await fetchAssessments(params);
//                     set({ assessments: response || [] });
//                 } catch (error) {
//                     set({ error: 'Something went wrong, Please try again later.' });
//                     if (error instanceof Error) {
//                         console.error('Error fetching assessments:', error.message);
//                     } else {
//                         console.error('Unknown error fetching assessments:', error);
//                     }
//                 } finally {
//                     set({ loading: false });
//                 }
//             },
//         }),
//         {
//             name: 'assessments-state',
//             version: 1,
//             storage: createExpiringStorage(localStorage),
//         }
//     )
// );

// assessment details
type AssessmentDetailsState = {
    assessmentDetails: AssessmentDetails | null,
    assessmentInstructions: string[] | null,
    setAssessmentDetails: (assessmentDetails: AssessmentDetails | null) => void;
    setAssessmentInstructions: (assessmentInstructions: string[] | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssessmentDetails: (assessmentId: string) => Promise<void>;
};

export const useAssessmentDetailsStore = create<AssessmentDetailsState>()(
    persist(
        (set) => ({
            assessmentDetails: null,
            assessmentInstructions: null,
            setAssessmentDetails: (assessmentDetails: AssessmentDetails | null) => set({ assessmentDetails }),
            setAssessmentInstructions: (assessmentInstructions: string[] | null) => set({ assessmentInstructions }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssessmentDetails: async (assessmentId: string) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchAssessment(assessmentId);
                    console.log(response);
                    set({ assessmentDetails: response?.details || null });
                    set({ assessmentInstructions: response?.statement || null });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assessments:', error.message);
                    } else {
                        console.error('Unknown error fetching assessments:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'assessment-details-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// assessment attempts users
type AssessmentLearnerState = {
    assessmentLearners: AssessmentLearner[];
    setAssessmentLearners: (assessmentLearners: AssessmentLearner[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssessmentLearners: (assessmentId: number) => Promise<void>;
};

export const useAssessmentLearnerStore = create<AssessmentLearnerState>()(
    persist(
        (set) => ({
            assessmentLearners: [],
            setAssessmentLearners: (assessmentLearners: AssessmentLearner[]) => set({ assessmentLearners }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssessmentLearners: async (assessmentId: number) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchAssessmentAttemptsUsers(assessmentId);
                    set({ assessmentLearners: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assessments:', error.message);
                    } else {
                        console.error('Unknown error fetching assessments:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'assessment-learners-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);


// assessment questions
type AssessmentQuestionsState = {
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssessmentQuestionsStore = create<AssessmentQuestionsState>()(
    persist(
        (set) => ({
            questions: [],
            setQuestions: (questions: Question[]) => set({ questions }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assessment-questions-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);