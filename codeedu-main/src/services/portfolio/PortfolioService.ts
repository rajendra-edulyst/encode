import ApiService from '@/services/ApiService';
import { Portfolio, PortfolioApiResponse, FetchUsersCertificateResponse, FetchUsersSkills, FetchUserToolsSoftware } from '@/@types/portfolio';
import { setProfileEditKey } from '@/views/common/profile-view/config';

export async function fetchPortfolio(userId: string): Promise<Portfolio> {
    try {
        const response = await ApiService.fetchDataWithAxios<PortfolioApiResponse>({
            url: '/user-portfolio',
            method: 'get',
            params: {
                user_id_for_webview: userId
            },
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export interface getUsersPortfolioKeysResponse {
    status: number;
    data: {
        profile_svc_editkey: string;
        isProfileCreatedNow: boolean;
    };
    error: string
}

export async function getUsersPortfolioKeys(): Promise<getUsersPortfolioKeysResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<getUsersPortfolioKeysResponse>({
            url: '/get-user-portfolio-keys',
            method: 'get',
        });
        setProfileEditKey(response?.data?.profile_svc_editkey);
        return response;
    } catch (error) {
        throw error as string;
    }
}



export async function fetchUsersCertificate(user_id: string): Promise<FetchUsersCertificateResponse>{
    try {
        const response = await ApiService.fetchDataWithAxios<FetchUsersCertificateResponse>({
            url: `v1/user-certificate-list?user_id=${user_id}`,
            method: 'get',
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function fetchUsersSkills(user_id: string): Promise<FetchUsersSkills>{
    try {
        const response = await ApiService.fetchDataWithAxios<FetchUsersSkills>({
            url: `v1/user-skills?user_id=${user_id}`,
            method: 'get',
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function fetchUsersToolsSoftware(user_id: string): Promise<FetchUserToolsSoftware>{
    try {
        const response = await ApiService.fetchDataWithAxios<FetchUserToolsSoftware>({
            url: `v1/user-resources-list?user_id=${user_id}`,
            method: 'get',
        });
        return response
    } catch (error) {
        throw error as string;
    }
}