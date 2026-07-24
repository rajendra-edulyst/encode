import { CCIStage1StatusResponse, FunctionalDomain, FunctionalDomainResponse, Preference, PreferenceResponse, UserProfile, UserProfileResponse } from "@/@types/getting-started";
import ApiService from "../ApiService";
import dayjs from "dayjs";

export interface Cities {
    id: number;
    name: string;
}

export async function fetchPreference(params?: URLSearchParams): Promise<Preference[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PreferenceResponse>({
            url: `v1/packages/list`,
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPackages(params?: URLSearchParams): Promise<Preference[]> {
    try {
        const response = await ApiService.fetchDataWithNode<PreferenceResponse>({
            url: `v1/packages/list`,
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPackagesById(id: any): Promise<Preference[]> {
    try {
        const response = await ApiService.fetchDataWithNode<PreferenceResponse>({
            url: `v1/packages/details/${id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// save-preference return void
export async function submitPreferences(preferenceId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/v1/packages/map-user-package`,
            method: 'post',
            data: {
                package_id: preferenceId,
            },
        });
    } catch (error) {
        throw error as string;
    }
}


// get-functional-domain

export async function fetchFunctionalDomains(): Promise<FunctionalDomain[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<FunctionalDomainResponse>({
            url: `/v1/get-functional-domain`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// v1/save-user-domain void
export async function submitUserDomains(domainIds: number[]): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/v1/save-user-domain`,
            method: 'post',
            data: {
                domain_id: domainIds,
                type: 'functional',
            },
        });
    } catch (error) {
        throw error as string;
    }
}

// v1/user-profile
export async function fetchUserProfile(): Promise<UserProfile> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserProfileResponse>({
            url: `/v1/user-profile`,
            method: 'get',
        });

        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// user-interete-saved
export interface UserInterestPayload {
    interest_value?: number;
    is_hire_me_enabled?: number;
    is_skill_up_enabled?: number;
    is_live_project_enabled?: number;
    is_co_create_enabled?: number;
    [key: string]: number | undefined;
}

export async function saveUserInterest(payload: UserInterestPayload): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/user-interete-saved`,
            method: 'post',
            data: payload,
        });
    } catch (error) {
        throw error as string;
    }
}

// v1/update_cci_start_date
export async function updateCCIStartDate(date: string): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('cci_start_date', date);
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/update_cci_start_date`,
            method: 'post',
            data: formData,
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

// cci-stage-1-status
export async function fetchCCIStage1Status(user_id?: number | string): Promise<CCIStage1StatusResponse> {
    try {
        const params = user_id ? { user_id } : undefined;
        const response = await ApiService.fetchDataWithAxios<CCIStage1StatusResponse>({
            url: `https://encodeapi.codeedu.co/api/cci-stage-1-status`,
            method: 'get',
            params
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

// get_cci_timeslots
export async function fetchCCITimeslots(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/get_cci_timeslots`,
            method: 'get',
        });
        return response.data || response;
    } catch (error) {
        throw error as string;
    }
}