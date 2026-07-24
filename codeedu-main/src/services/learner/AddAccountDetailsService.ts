import ApiService from '@/services/ApiService';

export interface AccountDetails {
    state_id?: number;
    country_id?: number;
    city?: number;
    address?: string;
    education?: string;
    passing_year?: string;
    college?: string;
    phone_number?: string;
    i_ma?: 'student' | 'corporate';
}

export async function addAccountDetailsService(formData: AccountDetails): Promise<boolean> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ success: boolean }, AccountDetails>({
            url: '/add-profile-details',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.success;
    } catch (error) {
        throw error as string;
    }
}
