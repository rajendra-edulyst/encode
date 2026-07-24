/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import ApiService from '../ApiService';
import { PercentageCompletionResponse } from '@/@types/learner/moduleContentCompletion';

export async function fetchContentCompletion( bookmark:string ,content_id: string,completion:string): Promise<PercentageCompletionResponse> {
    try {
        const formData = new FormData();
        formData.append('bookmark', bookmark);
        formData.append('content_id', content_id);
        formData.append('completion', completion);
      

        const response = await ApiService.fetchDataWithAxios<PercentageCompletionResponse>({
            url: `program-content-attempt`,
            method: 'post',
            data: formData as any,
           
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
