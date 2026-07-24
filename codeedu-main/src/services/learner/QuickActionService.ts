import ApiService from '@/services/ApiService'
import { QuickAction, QuickActionData } from '@/@types/learner/quick-action'

export async function fetchQuickAction(): Promise<QuickAction[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<QuickActionData>({
            url: '/quick-actions',
            method: 'get',
        })
        return response?.data?.quick_action
    } catch (error) {
        throw error as string;
    }
}