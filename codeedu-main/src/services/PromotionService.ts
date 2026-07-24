import { Promotion, PromotionApiResponse } from "@/@types/promotions";
import ApiService from "./ApiService";


export async function fetchPromotions(type?: string): Promise<Promotion[]> {
    try {

        const params = new URLSearchParams();
        if (type) {
            params.append('type', type);
        }

        const response = await ApiService.fetchDataWithAxios<PromotionApiResponse>({
            url: `/v1/get-infocus-promotions`,
            method: 'get',
            params,

        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}