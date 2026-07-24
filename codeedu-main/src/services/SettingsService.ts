import ApiService from '@/services/ApiService';
import { Settings, SettingsApiResponse } from '@/@types/settings';

export async function fetchSettings(): Promise<Settings> {
    try {
        const response = await ApiService.fetchDataWithAxios<SettingsApiResponse>({
            url: '/get-org-config',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}