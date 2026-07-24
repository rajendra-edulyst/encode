import ApiService from '@/services/ApiService';

interface BrochureApiResponse {
    success: boolean;
    message: string;
    data: Record<string, unknown> | null;
}

export async function fetchBrochure(data: FormData): Promise<BrochureApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<BrochureApiResponse>({
            url: `save-brochure-log`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
