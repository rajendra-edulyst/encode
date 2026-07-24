import ApiService from "../ApiService";

export type JoyCategoryData = {
    id: number;
    title: string;
    image: string;
    status: string;
    section_type: number;
    description: string;
    created_by: number;
    created_on: string;
    updated_by: number;
    updated_on: string;
    created_at: string;
    updated_at: string;
    organization_id: number;
    language_id: number;
    parent_id: number;
    video: string;
    is_reserved: number;
    reserved: any;
    short_description: any;
    domain_id: any;
    type: any;
    location: any;
    cover_image: any;
    sub_domain_id: any;
    country_id: any;
    state_id: any;
    file: any;
    like_count: any;
};

export type JoyComment = {
    id: number;
    user_id: number;
    commentable_id: number;
    commentable_type: string;
    body: string;
    created_at: string;
    updated_at: string;
    email: string;
    name: string;
    profile_image: string;
};

export type JoyCategoryResponse = {
    status: number;
    data: JoyCategoryData;
    error: any[];
};

export type JoyCommentsResponse = {
    status: number;
    data: {
        list: JoyComment[];
        file?: string | null;
    };
    error: any[];
};

/**
 * Fetches the default joy category for CCI
 * Uses specific headers as requested by the user
 */
export async function fetchJoyCategoryIdCCI(): Promise<JoyCategoryResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<JoyCategoryResponse>({
            url: '/joy/category/cci',
            method: 'get'
            
        });
        return response;
    } catch (error) {
        console.error("Error fetching Joy Category CCI:", error);
        throw error;
    }
}

/**
 * Fetches comments for a specific joy category
 */
export async function fetchJoyCategoryComments(joyCategoryId: number): Promise<JoyCommentsResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<JoyCommentsResponse>({
            url: `/community/comment/${joyCategoryId}`,
            method: 'get'
            
        });
        return response;
    } catch (error) {
        console.error("Error fetching Joy Category Comments:", error);
        throw error;
    }
}

/**
 * Sends a new comment for a joy category
 */
export async function sendJoyCategoryComment(data: { body: string; post_id: string; commentable_type: string }): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('body', data.body);
        formData.append('post_id', data.post_id);
        formData.append('commentable_type', data.commentable_type);

        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/community/comment',
            method: 'post',
            
            data: formData
        });
        return response;
    } catch (error) {
        console.error("Error sending Joy Category Comment:", error);
        throw error;
    }
}
/**
 * Updates the joy category file
 */
export async function updateJoyCategoryFile(data: { file: string; id: string }): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('id', data.id);

        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/update-joy-category-file',
            method: 'post',
            data: formData
        });
        return response;
    } catch (error) {
        console.error("Error updating Joy Category File:", error);
        throw error;
    }
}
