import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { SearchUser, SearchUserAssessment, SearchUserAssignment, SearchUserLoginHistory } from "@/@types/faculty/userSearch";
import { fetchUserAssessments, fetchUserAssignments, fetchUserLoginHistory, fetchUsers } from "@/services/faculty/userSearchService";

type SearchUserState = {
    users: SearchUser[];
    setUsers: (users: SearchUser[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchUsers: () => Promise<void>;
    query: string;
    setQuery: (query: string) => void;
    selectedUser: SearchUser | null;
    setSelectedUser: (user: SearchUser | null) => void;
};

export const useSearchUserStore = create<SearchUserState>()(
    persist(
        (set, get) => ({
            users: [],
            setUsers: (users: SearchUser[]) => set({ users }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            query: '',
            setQuery: (query: string) => set({ query }),
            selectedUser: null,
            setSelectedUser: (user: SearchUser | null) => set({ selectedUser: user }),
            fetchUsers: async () => {
                const { query } = get();
                if (!query) {
                    set({ users: [] });
                    return;
                }
                set({ loading: true, error: null });
                try {
                    const response = await fetchUsers(query);
                    set({ users: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching users:', error.message);
                    } else {
                        console.error('Unknown error fetching users:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'search-users-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// search user assignment
type SearchUserAssignmentState = {
    assignments: SearchUserAssignment[];
    setAssignments: (assignments: SearchUserAssignment[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssignments: (userId: number) => Promise<void>;
}

export const useSearchUserAssignmentStore = create<SearchUserAssignmentState>()(
    persist(
        (set) => ({
            assignments: [],
            setAssignments: (assignments: SearchUserAssignment[]) => set({ assignments }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssignments: async (userId: number) => {
                if (!userId) {
                    set({ assignments: [] });
                    return;
                }
                set({ loading: true, error: null });
                try {
                    const response = await fetchUserAssignments(userId);
                    set({ assignments: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching user assignments:', error.message);
                    } else {
                        console.error('Unknown error fetching user assignments:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'search-user-assignments-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// search user assessment
type SearchUserAssessmentState = {
    assessments: SearchUserAssessment[];
    setAssessments: (assessments: SearchUserAssessment[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchAssessments: (userId: number) => Promise<void>;
}

export const useSearchUserAssessmentStore = create<SearchUserAssessmentState>()(
    persist(
        (set) => ({
            assessments: [],
            setAssessments: (assessments: SearchUserAssessment[]) => set({ assessments }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchAssessments: async (userId: number) => {
                if (!userId) {
                    set({ assessments: [] });
                    return;
                }
                set({ loading: true, error: null });
                try {
                    const response = await fetchUserAssessments(userId);
                    set({ assessments: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching user assessments:', error.message);
                    } else {
                        console.error('Unknown error fetching user assessments:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'search-user-assessments-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// search user login history
type SearchUserLoginHistoryState = {
    loginHistory: SearchUserLoginHistory[];
    setLoginHistory: (loginHistory: SearchUserLoginHistory[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchLoginHistory: (userId: number) => Promise<void>;
}

export const useSearchUserLoginHistoryStore = create<SearchUserLoginHistoryState>()(
    persist(
        (set) => ({
            loginHistory: [],
            setLoginHistory: (loginHistory: SearchUserLoginHistory[]) => set({ loginHistory }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchLoginHistory: async (userId: number) => {
                if (!userId) {
                    set({ loginHistory: [] });
                    return;
                }
                set({ loading: true, error: null });
                try {
                    const response = await fetchUserLoginHistory(userId);
                    set({ loginHistory: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching user login history:', error.message);
                    } else {
                        console.error('Unknown error fetching user login history:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'search-user-login-history-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);