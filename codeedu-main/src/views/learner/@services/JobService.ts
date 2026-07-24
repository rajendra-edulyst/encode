/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatchingJobListApiResponse, JobListApiResponse, GetDomainsApiResponse, GetSkillApiResponse, GetJobRoleApiResponse, MatchingJobCandidateApiResponse, ContryResponse, JobActivityApiResponse, CreateSkillApiRequest, CreateJobRoleApiRequest, MatchingJobCandidate } from "@learner/@types/jobs";
import endpointConfig from "@/configs/endpoint.config";
import ApiService from "@/services/ApiService";

export async function fetchJobs(parms?: URLSearchParams) {
    return ApiService.fetchDataWithAxios<JobListApiResponse>({
        url: `${endpointConfig.jobs}?per_page=50`,
        method: 'post',
        params: parms,
    }).then(response => response.data)
}

export async function fetchMatchingJobListData() {
    return ApiService.fetchDataWithAxios<MatchingJobListApiResponse>({
        url: endpointConfig.matchingJoblist,
        method: 'post',
    }).then(response => response.data)
}

export async function fetchMatchingResumes(jobId: number): Promise<MatchingJobCandidate[]> {
    const res = await ApiService.fetchDataWithAxios<MatchingJobCandidateApiResponse>({
        url: endpointConfig.jobmatchingResumes,
        method: 'post',
        data: { gulfjob_id: jobId },
    });
    return res.data;
}


// {{base_url}}/api/get_domain GET
export async function fetchDomain() {
    return ApiService.fetchDataWithAxios<GetDomainsApiResponse>({
        url: endpointConfig.getDomain,
        method: 'get',
    }).then(response => response.data);
}


// api/get_jobrole?domainid=17
export async function fetchJobRole(domainId: number) {
    return ApiService.fetchDataWithAxios<GetJobRoleApiResponse>({
        url: `${endpointConfig.getJobRole}?domainid=${domainId}`,
        method: 'get',
    }).then(response => response.data);
}

// {{base_url}}/api/get_skill?job_id=2
export async function fetchSkills() {
    return ApiService.fetchDataWithAxios<GetSkillApiResponse>({
        url: `${endpointConfig.getSkill}`,
        method: 'get',
    }).then(response => response.data);
}

export async function createJobLms(data: FormData) {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.createJobLms,
        method: 'post',
        data: data as any,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => response);
}

export async function createJobApi(data: FormData) {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.createJob,
        method: 'post',
        data: data as any,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => response);
}



export async function getContry() {
    return ApiService.fetchDataWithAxios<ContryResponse>({
        url: endpointConfig.getContry,
        method: 'get',
    }).then(response => response.data);

}

// export async function getStates() {
//     return ApiService.fetchDataWithAxios<string>({
//         url: endpointConfig.getStates,
//         method: 'get',
//     }).then(response => response.data);
// }



// activities
// learner-competition-detail/

export async function getJobActivities(id: string) {
    return ApiService.fetchDataWithAxios<JobActivityApiResponse>({
        url: `${endpointConfig.getJobActivities}/${id}`,
        method: 'get',
    }).then(response => response.data);
}


// create_skill
export async function createSkill({ name, description }: CreateSkillApiRequest) {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.create_skill,
        method: 'post',
        data: {
            is_mobile: 1,
            name,
            description,
        }
    }).then(response => response);
}

export async function delete_skill(id: number) {
    return ApiService.fetchDataWithAxios<string>({
        url: `${endpointConfig.delete_skill}`,
        method: 'post',
        data: {
            id,
        }
    }).then(response => response);
}

// create_job_role
export async function createJobRole({ name, description }: CreateJobRoleApiRequest) {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.create_job_role,
        method: 'post',
        data: {
            is_mobile: 1,
            name,
            description
        }
    }).then(response => response);
}

// jobrole_skill_mapping
export async function jobrole_skill_mapping({ job_role_id, skill_ids }: { job_role_id: number, skill_ids: number[] }) {
    return ApiService.fetchDataWithAxios<string>({
        url: endpointConfig.create_job_role,
        method: 'post',
        data: {
            job_role_id,
            skill_ids: skill_ids
        }
    }).then(response => response);
}



export async function updateJobApi(data: FormData) {
    return ApiService.fetchDataWithAxios<string>({
        url: 'job-update',
        method: 'post',
        data: data as any,
    }).then(response => response);
}
