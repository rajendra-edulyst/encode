import ApiService from '@/services/ApiService'
import { InterestAreaData } from '@/@types/learner/interest'

export async function changeStatusofUserInterestArea(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<InterestAreaData>({
            url: '/user-interete-saved',
            method: 'post',
            data: {
                interest_value: "1"
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
