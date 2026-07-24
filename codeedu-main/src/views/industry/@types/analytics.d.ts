export interface JobRole {
    title: string;
    count: number;
}

export interface Domain {
    name: string;
    jobCount: number;
}

export interface Company {
    name: string;
    jobOpenings: number;
}

export interface Location {
    name: string;
    jobCount: number;
    countryId: string;
}

export interface Country {
    id: string;
    name: string;
    continent: string;
    jobCount: number;
    locations: Location[];
}

export interface Competency {
    name: string;
    demandScore: number;
}

export interface TimeRange {
    daily: WorkData;
    weekly: WorkData;
    monthly: WorkData;
    yearly: WorkData;
}

export interface TimePoint {
    date: Date;
    jobCount: number;
}

export interface TimeSeriesData {
    daily: TimePoint[];
    weekly: TimePoint[];
    monthly: TimePoint[];
    yearly: TimePoint[];
}

export interface WorkData {
    totalJobs: number;
    totalOpenings: number;
    roles: JobRole[];
    domains: Domain[];
    functionalDomains: Domain[];
    companies: Company[];
    countries: Country[];
    competencies: Competency[];
    timestamp?: Date;
    timeSeriesData: TimeSeriesData;
    locations: Location[];
}
