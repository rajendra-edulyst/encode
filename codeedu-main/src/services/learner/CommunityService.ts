import ApiService from '@/services/ApiService'
import { Post, CommunityData } from '@/@types/learner/community'

export async function fetchCommunity(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityData>({
            url: '/get-post',
            method: 'post',
        })
        return response.data.post;
    } catch (error) {
        throw error as string;
    }
}

export async function likeCommunity(postId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: postId.toString(),
                like: '1'
            }
        });
    } catch (error) {
        throw new Error(`Failed to like post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function unlikeCommunity(postId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: postId.toString(),
                like: '0'
            }
        });
    } catch (error) {
        throw new Error(`Failed to unlike post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getCommentsList(postId: number): Promise<Comment[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ data: { list: Comment[] } }>({
            url: `/get-comments-list/${postId}`,
            method: 'get'
        });
        return response.data.list;
    }
    catch (error) {
        throw new Error(`Failed to fetch comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function sendComment(postId: number, content: string, type?:string): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/user-comment-tracking',
            method: 'post',
            data: {
                post_id: postId,
                content: content,
                type
            }
        });
    } catch (error) {
        throw new Error(`Failed to send comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function tagSuggestion(category_id: string): Promise<string[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ data: string[] }>({
            url: `/tags/${category_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch tag suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}