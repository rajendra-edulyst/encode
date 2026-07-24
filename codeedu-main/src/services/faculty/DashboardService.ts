import { DashboardApiResponse, StatCount, StatCountApiResponse } from '@/@types/faculty/dashboard';
import ApiService from '@/services/ApiService';

export async function fetchStatCount(): Promise<StatCount> {
    try {
        const response = await ApiService.fetchDataWithAxios<StatCountApiResponse>({
            url: '/v1/faculty-dashbaord',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchInstituteAdminDashboard(): Promise<DashboardApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<DashboardApiResponse>({
            url: '/institute_admin_dashboard',
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

