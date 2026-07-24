import ApiService from '@/services/ApiService'
import { CommunitiesPostsApiResponse, Post, PostComment, PostCommentsApiResponse } from '@community/types/community';

interface FetchPostsParams {
    is_pin?: number;
    tags?: string;
    my_post?: number;
    content_type?: number;
    org_id?: string;
    category_id?: string;
}

export async function fetchPosts(params?: FetchPostsParams): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunitiesPostsApiResponse>({
            url: '/get-post',
            method: 'post',
            params: params
        })
        return response?.data?.post ?? [];
    } catch (error) {
        throw error as string;
    }
}

export async function likePost(post: Post): Promise<void> {
    try {
        const user_liked = post?.repost_id ? post.is_user_repost_like : post.user_liked;
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: post?.repost_id ? 'repost' : 'contents',
                content_id: post?.repost_id || post.id,
                like: user_liked === 0 ? '1' : '0'
            }
        });
    } catch (error) {
        throw new Error(`Failed to like post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function toggleLike({
    content_id,
    type = 'contents',
    isLiked,
}: {
    content_id: number;
    type?: 'contents' | 'repost';
    isLiked: boolean;
}): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/user-view-tracking',
            method: 'post',
            data: {
                type,
                content_id,
                like: isLiked ? '0' : '1', // toggle the like
            },
        });
    } catch (error) {
        throw new Error(
            `Failed to toggle like: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}


export async function deleteCommunityPost(id: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: number;
            message: string;
            data: string;
        }>({
            url: `/joy/content/delete/${id}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function deleteRepost(id: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: number;
            message: string;
            data: string;
        }>({
            url: `/v1/delete-repost/${id}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPostComments(postId: number | string): Promise<PostComment[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostCommentsApiResponse>({
            url: `/get-comments-list/${postId}`,
            method: 'get',
        })
        return response?.data?.list ?? [];
    }
    catch (error) {
        throw new Error(`Failed to fetch comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function sendComment(postId: number, content: string, isRepost?: boolean): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/user-comment-tracking',
            method: 'post',
            data: {
                post_id: postId.toString(),
                content: content,
                type: isRepost ? 'repost' : ''
            }
        });
    } catch (error) {
        throw new Error(`Failed to send comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}