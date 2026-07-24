// stat data 

export type StatData = {
    inactive_job: number
    published_job: number
    unpublished_job: number
    opportunities: number
    placed: number
    under_process: number
    under_review: number
    rejected: number
    applied: number
    placement_per: number
    num_of_vacancy: number
}

export type StatDataApiResponse = {
    status: number
    message: string
    data: StatData
}

// old



export type JobCount = {
    job_role_count: number
    closed_vacancy: number
    open_vacancy: number
}

export type getJobCountAPiResponse = {
    status: number
    message: string
    data: JobCount[]
}

export type DomainCount = {
    sector_industry_domain: number
    job_roles: number
    functional_domains: number
}

export type getDomainCountAPiResponse = {
    status: number
    message: string
    data: DomainCount[]
}

export type TalentPool = {
    tot_profiles: number
    tot_hired: number
    in_process: number
}

export type getTalentPoolAPiResponse = {
    status: number
    message: string
    data: TalentPool
}


// get top hiring
export type TopHiringLocation = {
    gulfjob_id: number
    location: string
    open_positions: number
    remote: string
}

export type getTopHiringLocationsApiResponse = {
    status: number
    message: string
    data: TopHiringLocation[]
}

export type RecentPlacements = {
    gulfjob_id: number
    designation: string
    max_updated_at: string
    company: string
    days: string
}

export type getRecentPlacementsApiResponse = {
    status: number
    message: string
    data: RecentPlacements[]
}

// get recent job matches
export type RecentJobMatches = {
    gulfjob_ids: number
    designation: string
    sector_industry_Domain: string
    location: string
    matching_per: number
    resume_matches: number
}

export type JobMatchesStats = {
    tot_candidates: number,
    candidates_this_month: number,
    tot_active_jobs: number,
    resume_processed: number,
    avg_match_score: number,
}

export type getJobMatchesApiResponse = {
    status: number
    message: string
    data: {
        dashboard: JobMatchesStats
        recent_job_matches: RecentJobMatches[]
    }
}


// jobStatsDomainWise

export type IndustryDomain = {
    sector_industry_Domain: string
    tot_vacancies: number
    tot_job_roles: number
    tot_companies: number
    icon: string
    country: string
    state: string
    flag: string
    tot_vacancies_up: number
    tot_companies_up: number
    tot_job_roles_up: number
}

export type IndustryDomainApiResponse = {
    status: number
    message: string
    data: {
        jobStatsDomainWise: IndustryDomain[]
        domains: string[]
    }
}



// get_functional_domain_list

export type FunctionalDomain = {
    functional_Domain: string
    tot_vacancies: number
    tot_job_roles: number
    tot_companies: number
    country: string
    state: string
    flag: string
}


export type FunctionalDomainApiResponse = {
    status: number
    message: string
    data: FunctionalDomain[]
}

// get_job_role_list
export type JobRole = {
    designation: string
    skills: number
    vacancies: number
    tot_company: number
    flag: string
    matching_prog_count: string
}

export type JobRoleApiResponse = {
    status: number
    message: string
    data: JobRole[]
}


// resume matches
export type MatcheResume = {
    id: number
    name: string
    email: string
    mobile: string
    path: string
    job_role: string
    company: string
    education: string
    experience: number
    skills: string
    status: string
    created_at: string
    updated_at: string
}

export type MatcheResumeResponse = {
    status: number
    message: string
    data: MatcheResume[]
}