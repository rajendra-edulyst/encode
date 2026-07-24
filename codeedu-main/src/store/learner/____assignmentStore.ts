// import { SubmittedAssignment } from '@/@types/learner/assignment';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// type AssignmentState = {
//     assignments: SubmittedAssignment[];
//     loading: boolean;
//     error: string;
//     setAssignments: (assignment: SubmittedAssignment[]) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string) => void;
// };

// export const useAssignmentStore = create<AssignmentState>()(
//     persist(
//         (set) => ({
//             assignments: [] as SubmittedAssignment[],
//             loading: false,
//             error: '',
//             setAssignments: (assignments: SubmittedAssignment[]) => set(() => ({ assignments })),
//             setLoading: (loading) => set(() => ({ loading })),
//             setError: (error) => set(() => ({ error })),
//         }),
//         {
//             name: 'assignmentStore',
//             storage: {
//                 getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//                 setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//                 removeItem: (key) => localStorage.removeItem(key),
//             },
//         }
//     )
// );
