import ApiService from '@/services/ApiService';
import { CreatePostResponse } from '@/@types/learner/createContent';

export async function fetchCreateContent(postData: any): Promise<CreatePostResponse> {
    try {
        const formData = new FormData();

        formData.append('category_id', postData.category_id);
        formData.append('title', postData.title);
        formData.append('description', postData.description);
        formData.append('content_type', String(postData.content_type));
        formData.append('post_type', postData.post_type);
        formData.append('status', String(postData.status));
        formData.append('tag', postData.tag);

        if (postData.aspect_ratio) {
            formData.append('aspect_ratio', postData.aspect_ratio);
        }

        formData.append('dimension', JSON.stringify(postData.dimension));
        if (postData.file) {
            formData.append('file', postData.file);
        }

        if (postData.thumbnail) {
            formData.append('thumbnail', postData.thumbnail);
        }

        const response = await ApiService.fetchDataWithAxios<CreatePostResponse>({
            url: '/create-post',
            method: 'post',
            data: formData as any,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        throw error as string;
    }
}
