import { Job, JobPagination, MatchingJob, JobActivityDetails } from '@industry/@types/jobs';
import { JobDetailsData, } from '@industry/@types/jobsDetails';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface JobState {
    jobs: Job[] | null;
    pagination: JobPagination | null;
    setJobs: (jobs: Job[]) => void;
    setPagination: (pagination: JobPagination) => void;
    clearJobs: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useJobStore = create<JobState>()(
    persist(
        (set) => ({
            jobs: [] as Job[] | null,
            pagination: {} as JobPagination | null,
            setJobs: (jobs) => set({ jobs }),
            setPagination: (pagination) => set({ pagination }),
            clearJobs: () => set({ jobs: null }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'jobStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

interface MachingJobState {
    matchingJobs: MatchingJob[] | null;
    setMatchingJobs: (jobs: MatchingJob[]) => void;
    clearMatchingJobs: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useMachingJobStore = create<MachingJobState>()(
    persist(
        (set) => ({
            matchingJobs: null,
            setMatchingJobs: (jobs) => set({ matchingJobs: jobs }),
            clearMatchingJobs: () => set({ matchingJobs: null }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'machingJobStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

type JobDetails = {
    jobDetails: JobDetailsData;
    setJobDetails: (jobDetails: JobDetailsData) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useJobDetailsStore = create<JobDetails>()(
    persist(
        (set) => ({
            jobDetails: {} as JobDetailsData,
            setJobDetails: (jobDetails: JobDetailsData) => set({ jobDetails }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'jobDetailsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);


// job activities store

interface JobActivitiesState {
    jobActivities: JobActivityDetails | null;
    setJobActivities: (jobActivities: JobActivityDetails) => void;
    clearJobActivities: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useJobActivitiesStore = create<JobActivitiesState>()(
    persist(
        (set) => ({
            jobActivities: null,
            setJobActivities: (jobActivities) => set({ jobActivities }),
            clearJobActivities: () => set({ jobActivities: null }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'jobActivitiesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);