import { ExploreJobsMatchingApiResponse, Resume, ResumeApiResponse, UploadResumeRequest } from "@industry/@types/resume";
import endpointConfig from "@/configs/endpoint.config";
import ApiService from "@/services/ApiService";
import { Job } from "../@types/jobs";

export async function fetchResumes(filters: URLSearchParams): Promise<Resume[]> {
    return ApiService.fetchDataWithAxios<ResumeApiResponse>({
        url: `${endpointConfig.resumeList}?${filters.toString()}`,
        method: 'post',
    }).then(response => response.data)
}

export async function apiUploadResume<T>(data: UploadResumeRequest) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.uploadResume,
        method: 'post',
        data,
    })
}

export async function fetchResumeDetails(resumeId: string) {
    return ApiService.fetchDataWithAxios<ResumeApiResponse>({
        url: endpointConfig.resumeList,
        method: 'post',
        data: {
            resume_parser_detail_id: resumeId,
        },
    }).then(response => response.data ? response.data[0] : null)
}

export async function exploreJobs(resumeId: string): Promise<Job[]> {
    const response = await ApiService.fetchDataWithAxios<ExploreJobsMatchingApiResponse>({
        url: `${endpointConfig.jobs}?resume_parser_detail_id=${resumeId}`,
        method: 'post',
    });
    return response.data?.data || [];
}

// send_matching_jobs_email
export async function sendMatchingJobsEmail(resume_parser_detail_id?: number) {
    return ApiService.fetchDataWithAxios<ExploreJobsMatchingApiResponse>({
        url: `${endpointConfig.send_matching_jobs_email}`,
        method: 'post',
        data: {
            resume_parser_detail_id: resume_parser_detail_id,
            organization_id: '156',
        }
    }).then(response => response.data)
}