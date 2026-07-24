import ApiService from '@/services/ApiService';

export interface CCIStage3StatusResponse {
    status: number;
    data: {
        video: number;
        graphics: number;
        Written: number;
        final: number;
        video_details?: {
            id?: number;
            file?: string;
            user_notes?: string;
            score?: string | number;
        };
        graphics_details?: {
            id?: number;
            file?: string;
            user_notes?: string;
            score?: string | number;
        };
        written_details?: {
            id?: number;
            file?: string;
            user_notes?: string;
            score?: string | number;
        };
    };
    error: any[];
}

export async function fetchCCIStage3Status(user_id?: number | string): Promise<CCIStage3StatusResponse> {
    try {
        const params: any = user_id ? { user_id } : {};
        params._t = Date.now();
        const response = await ApiService.fetchDataWithAxios<CCIStage3StatusResponse>({
            url: '/cci-stage-3-status',
            method: 'get',
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export interface CCIStage2StatusResponse {
    status: number;
    data: {
        course: number;
        community: number;
        buzz: number;
        final: number;
        community_details?: {
            id?: number;
            title?: string;
            file?: string;
            score?: string | number;
        };
        buzz_details?: {
            id?: number;
            title?: string;
            description?: string;
            resource_path_thumbnail?: string;
            video_url?: string;
            score?: string | number;
        };
    };
    error: any[];
}

export async function fetchCCIStage2Status(user_id?: number | string): Promise<CCIStage2StatusResponse> {
    try {
        const params: any = user_id ? { user_id } : {};
        params._t = Date.now();
        const response = await ApiService.fetchDataWithAxios<CCIStage2StatusResponse>({
            url: '/cci-stage-2-status',
            method: 'get',
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export interface CCIConsumptionLog {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    cci_stage: number;
    content_type: string;
    content_id: number;
    reference_id: number;
    score: string | number | null;
    completion_percentage: number;
    skill_ids: string | null;
    skill_names: string | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

export interface CCIConsumptionLogResponse {
    status: number;
    message: string;
    total: number;
    data: CCIConsumptionLog[];
}

export async function fetchCCIConsumptionLogDetails(params: {
    user_id: string | number;
    cci_stage?: string | number;
    content_type?: string;
}): Promise<CCIConsumptionLogResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CCIConsumptionLogResponse>({
            url: '/cci-consumption-log-details',
            method: 'get',
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function submitCCIStage4Report(): Promise<any> {
    const formData = new FormData();
    formData.append("cci_stage_4", "1");

    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/update_cci_stage_4',
            method: 'post',
            data: formData
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function assignCCICategoryMarks(items: any[]): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios({
            url: `/assign-cci-category-marks`,
            method: 'post',
            data: { items }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

import axios from 'axios';

export async function fetchUserPackageDetails(userId: string | number): Promise<any> {
    try {
        const response = await axios.get(`https://encodepm-api.edulyst.ai/api/v1/users/package/details/${userId}`, {
            headers: {
                'accept': '*/*'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchPackageContentParameters(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithNode({
            url: `https://encodepm-api.edulyst.ai/api/v1/package/content-masters/lists`,
            method: 'get'
        });
        return response;
    } catch (error) {
        throw error;
    }
}
