import { DomainCount, FunctionalDomain, IndustryDomain, JobCount, JobMatchesStats, JobRole, MatcheResume, RecentJobMatches, RecentPlacements, TalentPool, TopHiringLocation } from '@/@types/employability/dashboard';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DashboardStaticState {
    jobsCount: JobCount | null;
    setJobsCount: (jobsCount: JobCount | null) => void;
    domainCount: DomainCount | null;
    setDomainCount: (domainCount: DomainCount | null) => void;
    talentPool: TalentPool | null;
    setTalentPool: (talentPool: TalentPool | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useDashboardStateStore = create<DashboardStaticState>()(
    persist(
        (set) => ({
            jobsCount: null,
            setJobsCount: (jobsCount) => set({ jobsCount }),
            domainCount: null,
            setDomainCount: (domainCount) => set({ domainCount }),
            talentPool: null,
            setTalentPool: (talentPool) => set({ talentPool }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'dashboard-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// Recent Placements store
interface RecentPlacementsState {
    recentPlacements: RecentPlacements[];
    setRecentPlacements: (recentPlacements: RecentPlacements[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useRecentPlacementsStore = create<RecentPlacementsState>()(
    persist(
        (set) => ({
            recentPlacements: [],
            setRecentPlacements: (recentPlacements) => set({ recentPlacements }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'recent-placements-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

// Top Hiring Locations store
interface TopHiringLocationsState {
    topHiringLocations: TopHiringLocation[];
    setTopHiringLocations: (topHiringLocations: TopHiringLocation[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useTopHiringLocationsStore = create<TopHiringLocationsState>()(
    persist(
        (set) => ({
            topHiringLocations: [],
            setTopHiringLocations: (topHiringLocations) => set({ topHiringLocations }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'top-hiring-locations-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// Recent Job Matches store
interface RecentJobMatchesState {
    jobMatchesStats: JobMatchesStats | null;
    setJobMatchesStats: (jobMatchesStats: JobMatchesStats | null) => void;
    recentJobMatches: RecentJobMatches[];
    setRecentJobMatches: (recentJobMatches: RecentJobMatches[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}
export const useJobMatchesStore = create<RecentJobMatchesState>()(
    persist(
        (set) => ({
            jobMatchesStats: null,
            recentJobMatches: [],
            loading: false,
            error: null,
            setRecentJobMatches: (recentJobMatches) => set({ recentJobMatches }),
            setJobMatchesStats: (jobMatchesStats) => set({ jobMatchesStats }),
            setError: (error: string | null) => set({ error }),
            setLoading: (loading) => set({ loading }),
        }),
        {
            name: 'recent-job-matches-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// get industry domain
interface IndustryDomainState {
    industryDomains: IndustryDomain[];
    setIndustryDomains: (industryDomain: IndustryDomain[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useIndustryDomainStore = create<IndustryDomainState>()(
    persist(
        (set) => ({
            industryDomains: [],
            setIndustryDomains: (industryDomains) => set({ industryDomains }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'industry-domain-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
)

// get_functional_domain_list

interface FunctionalDomainState {
    functionalDomains: FunctionalDomain[];
    setFunctionalDomains: (functionalDomain: FunctionalDomain[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useFunctionalDomainStore = create<FunctionalDomainState>()(
    persist(
        (set) => ({
            functionalDomains: [],
            setFunctionalDomains: (functionalDomains) => set({ functionalDomains }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'functional-domain-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
)


// get_job_role_list
interface JobRoleState {
    jobRoles: JobRole[];
    setJobRoles: (jobRoles: JobRole[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useJobRoleStore = create<JobRoleState>()(
    persist(
        (set) => ({
            jobRoles: [],
            setJobRoles: (jobRoles) => set({ jobRoles }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'job-role-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
)


// resume matches
interface MatcheResumeState {
    matchedResumes: MatcheResume[];
    setMatchedResumes: (matchedResumes: MatcheResume[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useMatchedResumesStore = create<MatcheResumeState>()(
    persist(
        (set) => ({
            matchedResumes: [],
            setMatchedResumes: (matchedResumes) => set({ matchedResumes }),
            loading: false,
            setLoading: (loading) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'matched-resumes-state',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
)
