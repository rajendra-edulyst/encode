import { Assignment, AssignmentLearner, AssignmentSubmission } from "@/@types/faculty/assignment";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { fetchAssignment, fetchAssignments, fetchAssignmentSubmissionUsers, fetchUserAssignmentSubmission } from "@/services/faculty/AssignmentService";

type AssignmentState = {
    assignments: Assignment[];
    setAssignments: (assignments: Assignment[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssignments: (parms?: URLSearchParams) => Promise<void>;
};

export const _____useAssignmentStore = create<AssignmentState>()(
    persist(
        (set) => ({
            assignments: [],
            assignment: null,
            setAssignments: (assignments: Assignment[]) => set({ assignments }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssignments: async (parms) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchAssignments(parms);
                    set({ assignments: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assignments:', error.message);
                    } else {
                        console.error('Unknown error fetching assignments:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            }
        }),
        {
            name: 'assignments-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// Fetch assignment details
type AssignmentDetailsState = {
    assignment: Assignment | null;
    setAssignment: (assignment: Assignment | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssignment: (assignmentId: string) => Promise<void>;
};

// This store is used to fetch and manage the details of a specific assignment

export const useAssignmentDetailsStore = create<AssignmentDetailsState>()(
    persist(
        (set) => ({
            assignment: null,
            setAssignment: (assignment: Assignment | null) => set({ assignment }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssignment: async (assignmentId) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchAssignment(assignmentId);
                    set({ assignment: response || null });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assignment details:', error.message);
                    } else {
                        console.error('Unknown error fetching assignment details:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'assignment-details-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);


type AssignmentSubmissionUsersState = {
    assignmentSubmissionUsers: AssignmentLearner[];
    setAssignmentSubmissionUsers: (assignmentSubmissionUsers: AssignmentLearner[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssignmentSubmissionUsers: (assignmentId: string) => Promise<void>;
};

export const useAssignmentSubmissionUsersStore = create<AssignmentSubmissionUsersState>()(
    persist(
        (set) => ({
            assignmentSubmissionUsers: [],
            setAssignmentSubmissionUsers: (assignmentSubmissionUsers: AssignmentLearner[]) => set({ assignmentSubmissionUsers }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssignmentSubmissionUsers: async (assignmentId) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchAssignmentSubmissionUsers(assignmentId);
                    set({ assignmentSubmissionUsers: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assignment submission users:', error.message);
                    } else {
                        console.error('Unknown error fetching assignment submission users:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'assignment-submission-users-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// fetch User Assignment Submissions list

type AssignmentSubmissionState = {
    assignmentSubmission: AssignmentSubmission[];
    setAssignmentSubmission: (assignmentSubmission: AssignmentSubmission[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchUserAssignmentSubmission: (assignmentId: number, userId: number) => Promise<void>;
};

export const useAssignmentSubmissionStore = create<AssignmentSubmissionState>()(
    persist(
        (set) => ({
            assignmentSubmission: [],
            setAssignmentSubmission: (assignmentSubmission: AssignmentSubmission[]) => set({ assignmentSubmission }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchUserAssignmentSubmission: async (assignmentId, userId) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchUserAssignmentSubmission(assignmentId, userId);
                    set({ assignmentSubmission: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching assignment submission:', error.message);
                    } else {
                        console.error('Unknown error fetching assignment submission:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'assignment-submission-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);