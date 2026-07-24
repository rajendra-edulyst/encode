import endpointConfig from "@/configs/endpoint.config";
import { FunctionalDomainApiResponse, getDomainCountAPiResponse, getJobCountAPiResponse, getJobMatchesApiResponse, getRecentPlacementsApiResponse, getTalentPoolAPiResponse, getTopHiringLocationsApiResponse, IndustryDomainApiResponse, JobRoleApiResponse, MatcheResumeResponse, StatData, StatDataApiResponse } from "@industry/@types/dashboard";
import ApiService from "@/services/ApiService";


// stat data
export async function fetchStatData(): Promise<StatData> {
    const response = await ApiService.fetchDataWithAxios<StatDataApiResponse>({
        url: '/v1/job-opportunity-dashboard',
        method: 'get',
    });
    return response.data;
}

export async function fetchDashboardData() {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.dashboard,
        method: 'post',
    })
}

// get_talent_pool
export async function fetchTalentPool() {
    return ApiService.fetchDataWithAxios<getTalentPoolAPiResponse>({
        url: endpointConfig.get_talent_pool,
        method: 'get',
    }).then(response => response.data);
}

// get_domain_count
export async function fetchDomainCount() {
    return ApiService.fetchDataWithAxios<getDomainCountAPiResponse>({
        url: endpointConfig.get_domain_count,
        method: 'get',
    }).then(response => response.data ? response.data[0] : null);
}

// get_job_count
export async function fetchJobCount(orgId: number) {
    return ApiService.fetchDataWithAxios<getJobCountAPiResponse>({
        url: `${endpointConfig.get_job_count}/${orgId}`,
        method: 'get',
    }).then(response => response.data ? response.data[0] : null);
}


// get top hiring 
export async function fetchTopHiringLocations() {
    return ApiService.fetchDataWithAxios<getTopHiringLocationsApiResponse>({
        url: endpointConfig.get_top_hiring_locations,
        method: 'get',
    }).then(response => response.data);
}

// get recent placements
export async function fetchRecentPlacements() {
    return ApiService.fetchDataWithAxios<getRecentPlacementsApiResponse>({
        url: endpointConfig.get_recent_placements,
        method: 'get',
    }).then(response => response.data);
}

// get recent job matches
export async function fetchRecentJobMatches() {
    return ApiService.fetchDataWithAxios<getJobMatchesApiResponse>({
        url: endpointConfig.get_recent_job_matches,
        method: 'post',
    }).then(response => response.data);
}

// get industry domain
export async function fetchIndustryDomain(organization_id: number) {
    return ApiService.fetchDataWithAxios<IndustryDomainApiResponse>({
        url: endpointConfig.get_industry_domain,
        method: 'post',
        data: {
            organization_id: organization_id
        }
    }).then(response => response.data);
}

// get_functional_domain_list

export async function fetchFunctionalDomainList(organization_id: number) {
    return ApiService.fetchDataWithAxios<FunctionalDomainApiResponse>({
        url: endpointConfig.get_functional_domain_list,
        method: 'post',
        data: {
            organization_id: organization_id
        }
    }).then(response => response.data);
}

// get_job_role_list
export async function fetchJobRoleList(organization_id: number) {
    return ApiService.fetchDataWithAxios<JobRoleApiResponse>({
        url: endpointConfig.get_job_role_list,
        method: 'post',
        data: {
            organization_id: organization_id
        }
    }).then(response => response.data);
}

// job_matches

export async function fetchMatchingResumes(gulfjob_id: string, matching_per?: string) {
    return ApiService.fetchDataWithAxios<MatcheResumeResponse>({
        url: endpointConfig.resumeList,
        method: 'post',
        data: {
            gulfjob_id: gulfjob_id,
            matching_per: matching_per
        },
    }).then(response => response.data)
}


// {
//     "status": 1,
//     "data": {
//         "inactive_job": 0,
//         "published_job": 7,
//         "unpublished_job": 4,
//         "opportunities": 11,
//         "placed": 0,
//         "under_process": 6,
//         "under_review": 0,
//         "rejected": 0,
//         "applied": 6,
//         "placement_per": 0,
//         "num_of_vacancy": 68
//     },
//     "error": null
// }