import { Learners, SessionDetails, SessionDetailsForUsersListing } from "@/@types/faculty/session";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { updateSessionStatus, getSessionDetails, getSessionUsers, markAttendance } from '@services/faculty/SessionsService'
import { createExpiringStorage } from '@store/createExpiringStorage';
import { toast } from "sonner";

// type SessionState = {
//     sessions: Session[];
//     setSessions: (sessions: Session[]) => void;
//     loading: boolean;
//     setLoading: (loading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
//     fetchSessions: (parms?: URLSearchParams) => Promise<void>;
// };

// export const useSessionStore = create<SessionState>()(
//     persist(
//         (set) => ({
//             sessions: [],
//             setSessions: (sessions: Session[]) => set({ sessions }),
//             loading: false,
//             setLoading: (loading: boolean) => set({ loading }),
//             error: null,
//             setError: (error: string | null) => set({ error }),
//             fetchSessions: async (parms) => {
//                 set({ loading: true });
//                 set({ error: null });
//                 try {
//                     const response = await fetchSessions(parms);
//                     // start_date is   "start_date": "2023-10-21 14:00:00", so sort is correctly
//                     // sort the sessions by start_date in ascending order
//                     response.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

//                     // Set the sessions
//                     set({ sessions: response || [] });
//                 } catch (error) {
//                     set({ error: 'Something went wrong, Please try again later.' });
//                     console.error('Error fetching sessions:', error);
//                 }
//                 finally {
//                     set({ loading: false });
//                 }
//             },
//         }),
//         {
//             name: 'session-state',
//             version: 1,
//             storage: createExpiringStorage(localStorage),
//         }
//     )
// );

// sessions users
type SessionUsersState = {
    users: Learners[];
    session: SessionDetailsForUsersListing | null;
    setUsers: (users: Learners[]) => void;
    setSession: (session: SessionDetailsForUsersListing | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchSessionUsers: (sessionId: number) => Promise<void>;
    changeAttendanceStatus: (userId: number[], status: 'Invited' | 'attended' | 'absent') => void;
    bulkChangeAttendanceStatus: (status: 'Invited' | 'attended' | 'absent') => void;
}

export const useSessionUsersStore = create<SessionUsersState>()(
    persist(
        (set, get) => ({
            users: [],
            session: null,
            setUsers: (users: Learners[]) => set({ users }),
            setSession: (session: SessionDetailsForUsersListing | null) => set({ session }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchSessionUsers: async (sessionId: number) => {
                set({ loading: true });
                set({ error: null });
                try {
                    const response = await getSessionUsers(sessionId);
                    set({ users: response.class_users || [], session: response.content_details[0] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    console.error('Error fetching sessions:', error);
                }
                finally {
                    set({ loading: false });
                }
            },
            changeAttendanceStatus: async (userId: number[], status: 'Invited' | 'attended' | 'absent') => {
                try {
                    const session = get().session;
                    if (!session || !session.id) {
                        console.warn('Session is not set or missing ID:', session);
                        return;
                    }
                    await markAttendance(session.id, userId, status);
                    set((state) => ({
                        users: state.users.map((user) => {
                            if (userId.includes(user.user_id)) { return { ...user, status: status } }
                            return user;
                        }),
                    }));
                    toast.success(`Attendance ${status} marked successfully`);
                } catch (error) {
                    toast.error("Something went wrong, Please try again later.");
                    console.error('Error marking attendance:', error);
                }
            },
            bulkChangeAttendanceStatus: async (status: 'Invited' | 'attended' | 'absent') => {
                const usersToUpdate = get().users.filter(user => user.status !== status);
                try {
                    const session = get().session;
                    if (!session || !session.id) {
                        console.warn('Session is not set or missing ID:', session);
                        return;
                    }
                    await markAttendance(session.id, usersToUpdate.map(u => u.user_id), status);
                    set((state) => ({
                        users: state.users.map((user) => {
                            if (usersToUpdate.some(u => u.user_id === user.user_id)) {
                                return { ...user, status: status };
                            }
                            return user;
                        }),
                    }));

                    toast.success(`${status} marked successfully for all users`);

                } catch (error) {
                    console.error('Error marking attendance:', error);
                }
            }
        }),
        {
            name: 'session-users-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);

// session details
type SessionDetailsState = {
    session: SessionDetails | null;
    setSession: (session: SessionDetails | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    getSessionDetails: (sessionId: string) => Promise<void>;
    changeSessionStatus: (status: 'Published' | 'Draft') => Promise<void>;
}

export const useSessionDetailsStore = create<SessionDetailsState>()(
    persist(
        (set, get) => ({
            session: null,
            setSession: (session: SessionDetails | null) => set({ session }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            getSessionDetails: async (sessionId: string) => {
                set({ loading: true });
                set({ error: null });
                try {
                    const response = await getSessionDetails(sessionId);
                    set({ session: response || null });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    console.error('Error fetching sessions:', error);
                }
                finally {
                    set({ loading: false });
                }
            },
            changeSessionStatus: async (status: 'Published' | 'Draft') => {
                const session = get().session;
                if (!session || !session.id) {
                    console.warn('Session is not set or missing ID:', session);
                    return;
                }
                try {
                    await updateSessionStatus(session.id, status);
                    set((state) => ({
                        session: { ...state.session, status: status } as SessionDetails,
                    }));
                    toast.success(`Session ${status} successfully`);
                } catch (error) {
                    toast.error("Something went wrong, Please try again later.");
                    console.error('Error marking attendance:', error);
                }
            }
        }),
        {
            name: 'session-details-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);