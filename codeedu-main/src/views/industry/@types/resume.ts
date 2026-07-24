import { Job } from "./jobs"

export interface Resume {
    id: number
    user_id: string
    name: string
    email: string
    mobile: string
    path: string
    job_role: string
    company: string
    education: string
    experience: string
    skills: string
    status: string
    created_at: string
    updated_at: string
}

export type UploadResumeRequest = {
    resume_url: string
    gulfjob_id?: number | null
}

export type ResumeApiResponse = {
    message: string
    status: number
    data: Resume[]
}


export type ExploreJobsMatchingApiResponse = {
    message: string
    status: number
    data: {
        data: Job[]
    }
}