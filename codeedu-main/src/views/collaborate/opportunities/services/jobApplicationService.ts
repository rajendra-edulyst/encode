import ApiService from '@/services/ApiService'
import PortfolioApiService from '@/views/common/profile-view/services/axios'

export type ProfileSectionData = {
    about?: Array<{ about_me?: string | null }>
    education?: Array<{
        field_of_study?: string | null
        Institution_name?: string | null
    }>
    experience?: Array<{ title?: string | null; company_name?: string | null }>
    skills?: Array<{ skill_name?: string | null }>
    basic_info?: Array<{ resume?: string | null }>
}

export type ProfileCompleteness = {
    profileComplete: boolean
    incompleteSections: Array<'about' | 'education' | 'skills'>
}

export const getProfileCompleteness = (
    profileSection: ProfileSectionData | undefined,
): ProfileCompleteness => {
    const incompleteSections: Array<
        'about' | 'education' | 'skills'
    > = []

    const aboutComplete = Boolean(
        profileSection?.about?.[0]?.about_me?.trim?.() || '',
    )
    if (!aboutComplete) incompleteSections.push('about')

    const educationComplete = Boolean(
        profileSection?.education?.some(
            (item) =>
                Boolean(item?.field_of_study?.trim?.()) &&
                Boolean(item?.Institution_name?.trim?.()),
        ),
    )
    if (!educationComplete) incompleteSections.push('education')



    const skillsComplete = Boolean(
        profileSection?.skills?.some((item) =>
            Boolean(item?.skill_name?.trim?.()),
        ),
    )
    if (!skillsComplete) incompleteSections.push('skills')

    return {
        profileComplete: incompleteSections.length === 0,
        incompleteSections,
    }
}

type ProfileApiResponse = {
    status: number
    data: {
        portfolio: {
            profileSection: ProfileSectionData
            completion_percentage?: number
        }
    }
}

type ResumeUploadResponse = {
    status: number
    message: string
    resumeUrl?: string
    data?: { resumeUrl?: string; url?: string }
}

export const fetchApplicationProfile = async () => {
    const response = await PortfolioApiService.get<ProfileApiResponse>(
        '/user/profile',
    )
    return response.data
}

export const uploadApplicationResume = async (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await PortfolioApiService.post<ResumeUploadResponse>(
        '/user/profile/upload-resume',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    const payload = response.data
    return payload.resumeUrl || payload.data?.resumeUrl || payload.data?.url || ''
}

export const submitJobApplication = async (
    jobId: string | number,
    resumeUrl: string,
) => {
    return ApiService.fetchDataWithAxios<{
        status?: number
        message?: string
        code?: string
    }>({
        url: '/jobs/apply',
        method: 'post',
        data: {
            jobId,
            resumeUrl,
        },
    })
}
