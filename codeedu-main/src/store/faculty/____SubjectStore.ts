// import { Subject } from "@/@types/faculty/subject";
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { createExpiringStorage } from '@store/createExpiringStorage';
// import { fetchAssignedProgramsforFilter } from "@/services/faculty/ProgramService";

// type SubjectState = {
//     subjects: Subject[];
//     setSubjects: (subjects: Subject[]) => void;
//     loading: boolean;
//     setLoading: (loading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
//     fetchSubjects: () => Promise<void>;
// };

// export const useSubjectStore = create<SubjectState>()(
//     persist(
//         (set) => ({
//             subjects: [],
//             setSubjects: (subjects: Subject[]) => set({ subjects }),
//             loading: false,
//             setLoading: (loading: boolean) => set({ loading }),
//             error: null,
//             setError: (error: string | null) => set({ error }),
//             fetchSubjects: async () => {
//                 set({ loading: true, error: null });
//                 try {
//                     const response = await fetchAssignedProgramsforFilter();
//                     set({ subjects: response || [] });
//                 } catch (error) {
//                     set({ error: 'Something went wrong, Please try again later.' });
//                     if (error instanceof Error) {
//                         console.error('Error fetching subjects:', error.message);
//                     } else {
//                         console.error('Unknown error fetching subjects:', error);
//                     }
//                 } finally {
//                     set({ loading: false });
//                 }
//             },
//         }),
//         {
//             name: 'subjects-state',
//             version: 1,
//             storage: createExpiringStorage(localStorage),
//         }
//     )
// );