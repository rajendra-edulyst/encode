import { Course, CourseDetails, Pagination } from "@/@types/learner/Courses";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CourseState = {
    courses: Course[];
    pagination: Pagination;
    setCourses: (courses: Course[]) => void;
    setPagination: (pagination: Pagination) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            courses: [],
            setCourses: (courses: Course[]) => set({ courses }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            setPagination: (pagination: Pagination) => set({ pagination }),
            pagination: {} as Pagination,
        }),
        {
            name: 'courseStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Continue Reading
type ContinueReadingState = {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useContinueReadingStore = create<ContinueReadingState>()(
    persist(
        (set) => ({
            courses: [],
            setCourses: (courses: Course[]) => set({ courses: courses }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'continueReadingStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Single Course
type SingleCourseState = {
    course: CourseDetails | null;
    setCourse: (course: CourseDetails) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useSingleCourseStore = create<SingleCourseState>()(
    persist(
        (set) => ({
            course: null,
            setCourse: (course: CourseDetails) => set({ course }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'singleCourseStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Modules (specific course modules)
// type ModuleState = {
//     module: Module;
//     course: ModuleCourseDetails;
//     content: CommonModuleContent[] | null;
//     setCourse: (course: ModuleCourseDetails) => void;
//     setModule: (module: Module) => void;
//     setContent: (content: CommonModuleContent[]) => void;
//     loading: boolean;
//     setLoading: (isLoading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
// };

// export const useModuleStore = create<ModuleState>()(
//     persist(
//         (set) => ({
//             module: {} as Module,
//             course: {} as ModuleCourseDetails,
//             // content: {} as ModuleContent | null,
//             content: [] as CommonModuleContent[],
//             setCourse: (course: ModuleCourseDetails) => set({ course }),
//             setModule: (module: Module) => set({ module }),
//             setContent: (content: CommonModuleContent[]) => set({ content }),
//             loading: false,
//             setLoading: (isLoading: boolean) => set({ loading: isLoading }),
//             error: null,
//             setError: (error: string | null) => set({ error: error }),
//         }),
//         {
//             name: 'moduleStore',
//             storage: {
//                 getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//                 setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//                 removeItem: (key) => localStorage.removeItem(key),
//             }
//         }
//     )
// );


// store pre-assigned courses

// type PreAssignedCourseState = {
//     courses: PreAssignCourse[];
//     setCourses: (courses: PreAssignCourse[]) => void;
//     loading: boolean;
//     setLoading: (isLoading: boolean) => void;
//     error: string | null;
//     setError: (error: string | null) => void;
// };

// export const usePreAssignedCourseStore = create<PreAssignedCourseState>()(
//     persist(
//         (set) => ({
//             courses: [],
//             setCourses: (courses: PreAssignCourse[]) => set({ courses }),
//             loading: false,
//             setLoading: (isLoading: boolean) => set({ loading: isLoading }),
//             error: null,
//             setError: (error: string | null) => set({ error: error }),
//         }),
//         {
//             name: 'preAssignedCourseStore',
//             storage: {
//                 getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
//                 setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//                 removeItem: (key) => localStorage.removeItem(key),
//             }
//         }
//     )
// );

// Recommended Courses store
type RecommendedCourseState = {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useRecommendedCourseStore = create<RecommendedCourseState>()(
    persist(
        (set) => ({
            courses: [],
            setCourses: (courses: Course[]) => set({ courses }),
            loading: false,
            setLoading: (isLoading: boolean) => set({ loading: isLoading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'recommendedCourseStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

