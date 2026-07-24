import { InFocus, InFocusApiResponse } from "@/@types/collaborate";
import ApiService from "../ApiService";


export async function fetchInFocus(): Promise<InFocus[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<InFocusApiResponse>({
            url: '/v1/get-infocus-promotions',
            method: 'get',
        });
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}