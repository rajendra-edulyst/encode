import ApiService from '@/services/ApiService';
import { UserPortfolio, UserPortfolioResponse, UpdatePortfolioInfoResponse, PortfolioSocialResponse, Activity, ActivitySaveResponse, ActivityDeleteResponse, SkillsResponseData, SkillsResponse, SkillsRequest, SkillAddResponse, SkillsSuggestionResponse, SkillsSuggestion } from '@/@types/learner/portfolio';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePortfolioInfo(data: any): Promise<string> {
    try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/add_portfolio_profile`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addResume(data: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/addResume`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addBanner(data: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/addBanner`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUpdateImage(uploadImage: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('image', uploadImage);
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/portfolio_image_upload`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
        const sessionUser = localStorage.getItem('sessionUser');
        if (sessionUser) {
            const user = JSON.parse(sessionUser);
            user.state.user.profile_image = response.data.profile_image;
            localStorage.setItem('sessionUser', JSON.stringify(user));
        }
        return response.data.profile_image;
    } catch (error) {

        if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unexpected error occurred';
        }
    }
}



export async function userPortfolio(): Promise<UserPortfolio> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserPortfolioResponse>({
            url: '/user-portfolio',
            method: 'get',
        })
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addSocialLinks(data: any): Promise<number> {
    try {
        const response = await ApiService.fetchDataWithAxios<PortfolioSocialResponse>({
            url: '/addPortfolioSocial',
            method: 'post',
            data: data
        })
        return response.status;
    } catch (error) {
        throw error as string;
    }
}

export async function addEducation(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addExperience(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addCertificate(data: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addPublication(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}



export async function addExtraActivity(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addProject(data: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function deleteActivity(activityId: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivityDeleteResponse>({
            url: `/deletePortfolio`,
            method: 'post',
            data: {
                portfolio_id: activityId
            }
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// user skills

export async function getSkillsSuggestions(): Promise<SkillsSuggestion[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillsSuggestionResponse>({
            url: '/skills-list',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function getUserSkills(): Promise<SkillsResponseData[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillsResponse>({
            url: '/skills-mapping-list',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// add user skill
export async function addUserSkill(data: SkillsRequest): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillAddResponse>({
            url: '/add-skill-mapping',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// delete user skill
export async function deleteUserSkill(skillId: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillAddResponse>({
            url: '/delete-skill-mapping',
            method: 'post',
            data: {
                id: skillId
            }
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function uploadVideoResume(data: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: '/upload-video-resume',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function listVideoResume(): Promise<UserPortfolio> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserPortfolioResponse>({
            url: '/user-portfolio?keys=resume,video_resume',
            method: 'get',
        })

        if (response.data && response.data.video_resume && Array.isArray(response.data.video_resume)) {
            const transformedVideos: any[] = []
            response.data.video_resume.forEach((item: any) => {
                Object.keys(item).forEach((key) => {
                    if (!isNaN(Number(key))) {
                        const videoItem = item[key]
                        // Only add if it has a valid URL
                        if (videoItem && (videoItem.url || videoItem.webm_url)) {
                            transformedVideos.push({
                                ...videoItem,
                                resume_index: Number(key)
                            })
                        }
                    }
                })
            })
            if (transformedVideos.length > 0) {
                response.data.video_resume = transformedVideos
            } else {
                response.data.video_resume = []
            }
        }
        
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function deleteVideoResume(videoId: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: '/video-resume-delete',
            method: 'post',
            data: {
                id: videoId
            }
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}
export async function deletePortfolioItem(data: { type: 'video_resume' | 'resume', resume_index?: number, id?: number }): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: '/delete-portfolio-item',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}
