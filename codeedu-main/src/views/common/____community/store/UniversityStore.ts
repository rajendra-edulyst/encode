import { University } from '@/@types/elms/university'
import { Course } from '@/@types/elms/course'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the state types
type UniversitiesState = {
    universities: University[]
    setUniversities: (universities: University[]) => void
    error: string | null
    setError: (error: string) => void
    loading: boolean
    setLoading: (loading: boolean) => void
}

type UniversityDetailsState = {
    university: University | null
    setUniversity: (university: University | null) => void
    error: string | null
    setError: (error: string) => void
    loading: boolean
    setLoading: (loading: boolean) => void
}

type UniversityCoursesState = {
    courses: Course[]
    setCourses: (courses: Course[]) => void
    error: string | null
    setError: (error: string) => void
    loading: boolean
    setLoading: (loading: boolean) => void
}

const persistConfig = (name: string) => ({
    name,
    getStorage: () => localStorage,
})

export const useUniversitiesStore = create<UniversitiesState>()(
    persist(
        (set) => ({
            universities: [],
            setUniversities: (universities: University[]) => set({ universities }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        persistConfig('universitiesStore')
    )
)

export const useUniversityDetailsStore = create<UniversityDetailsState>()(
    persist(
        (set) => ({
            university: null,
            setUniversity: (university: University | null) => set({ university }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        persistConfig('universityDetailsStore')
    )
)

export const useUniversityCoursesStore = create<UniversityCoursesState>()(
    persist(
        (set) => ({
            courses: [],
            setCourses: (courses: Course[]) => set({ courses }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        persistConfig('universityCoursesStore')
    )
)