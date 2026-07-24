import { CommonModuleContent, FreeProgram, ProgramDetailModule, ProgramDetails, ProgramCategory } from "@/@types/faculty/program";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createExpiringStorage } from '@store/createExpiringStorage';
import { fetchProgramDetails, fetchFreePrograms, fetchModulesContents, fetchProgramCategoryList } from "@/services/faculty/ProgramService";

// program category lists

type ProgramCategoryState = {
    programCategory: ProgramCategory[];
    setProgramCategory: (programCategory: ProgramCategory[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchProgramCategoryList: () => Promise<void>;
};

export const useProgramCategoryStore = create<ProgramCategoryState>()(
    persist(
        (set) => ({
            programCategory: [],
            setProgramCategory: (programCategory: ProgramCategory[]) => set({ programCategory }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchProgramCategoryList: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchProgramCategoryList();
                    set({ programCategory: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching program category list:', error.message);
                    } else {
                        console.error('Unknown error fetching program category list:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'program-category-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);


// assigned programs
// type AssignedProgramState = {
//     assignedPrograms: AssignedProgram[];
//     setAssignedPrograms: (programs: AssignedProgram[]) => void;
//     loading: boolean;
//     setLoading: (loading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
//     fetchAssignedPrograms: (params?: URLSearchParams) => Promise<void>;
// };

// export const useAssignedProgramStore = create<AssignedProgramState>()(
//     persist(
//         (set) => ({
//             assignedPrograms: [],
//             setAssignedPrograms: (programs: AssignedProgram[]) => set({ assignedPrograms: programs }),
//             loading: false,
//             setLoading: (loading: boolean) => set({ loading }),
//             error: null,
//             setError: (error: string | null) => set({ error }),
//             fetchAssignedPrograms: async (params?: URLSearchParams) => {
//                 set({ loading: true, error: null });
//                 try {
//                     const response = await fetchAssignedPrograms(params);
//                     set({ assignedPrograms: response || [] });
//                 } catch (error) {
//                     set({ error: 'Something went wrong, Please try again later.' });
//                     if (error instanceof Error) {
//                         console.error('Error fetching assigned programs:', error.message);
//                     } else {
//                         console.error('Unknown error fetching assigned programs:', error);
//                     }
//                 } finally {
//                     set({ loading: false });
//                 }
//             },
//         }),
//         {
//             name: 'assigned-programs-state',
//             version: 1,
//             storage: createExpiringStorage(localStorage),
//         }
//     )
// );

// program details
type ProgramDetailsState = {
    program: ProgramDetails | null;
    setProgram: (program: ProgramDetails | null) => void;
    selectedModule: ProgramDetailModule | null;
    setSelectedModule: (module: ProgramDetailModule | null) => void;
    moduleContents: CommonModuleContent[] | null;
    setModuleContents: (contents: CommonModuleContent[] | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    modulecontentLoading: boolean;
    setModuleContentLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchProgramDetails: (programId: string, autoModuleSelect?: boolean) => Promise<void>;
    fetchModuleContents: (moduleId?: string) => Promise<void>;
};

export const useProgramDetailsStore = create<ProgramDetailsState>()(
    persist(
        (set, get) => ({
            program: null,
            setProgram: (program: ProgramDetails | null) => set({ program }),
            selectedModule: null,
            setSelectedModule: (module: ProgramDetailModule | null) => set({ selectedModule: module }),
            moduleContents: null,
            setModuleContents: (contents: CommonModuleContent[] | null) => set({ moduleContents: contents }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            modulecontentLoading: false,
            setModuleContentLoading: (loading: boolean) => set({ modulecontentLoading: loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchProgramDetails: async (programId: string, autoModuleSelect = true) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchProgramDetails(programId);
                    set({ program: response || null });
                    set({ selectedModule: null, moduleContents: null });
                    if (response?.modules && response.modules.length > 0) {
                        if (autoModuleSelect) {
                            set({ selectedModule: response.modules[0] });
                        }
                    }
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching program details:', error.message);
                    } else {
                        console.error('Unknown error fetching program details:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
            fetchModuleContents: async (moduleId?: string) => {
                set({ modulecontentLoading: true, error: null });
                try {
                    const id = moduleId || get().selectedModule?.id;
                    if (!id) {
                        throw new Error('Module ID is not set');
                    }
                    const response = await fetchModulesContents(id);
                    set({ moduleContents: response || null });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching module contents:', error.message);
                    } else {
                        console.error('Unknown error fetching module contents:', error);
                    }
                } finally {
                    set({ modulecontentLoading: false });
                }
            },
        }),
        {
            name: 'program-details-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);


// free courses
type FreeProgramState = {
    freePrograms: FreeProgram[];
    setFreePrograms: (freePrograms: FreeProgram[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchFreePrograms: (type?: string) => Promise<void>;
};

export const useFreeProgramStore = create<FreeProgramState>()(
    persist(
        (set) => ({
            freePrograms: [],
            setFreePrograms: (freePrograms: FreeProgram[]) => set({ freePrograms: freePrograms }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            fetchFreePrograms: async (type?: string) => {
                set({ loading: true, error: null });
                try {
                    const response = await fetchFreePrograms(type);
                    set({ freePrograms: response || [] });
                } catch (error) {
                    set({ error: 'Something went wrong, Please try again later.' });
                    if (error instanceof Error) {
                        console.error('Error fetching free programs:', error.message);
                    } else {
                        console.error('Unknown error fetching free programs:', error);
                    }
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'free-programs-state',
            version: 1,
            storage: createExpiringStorage(localStorage),
        }
    )
);