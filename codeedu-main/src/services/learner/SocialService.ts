import ApiService from '@/services/ApiService'
import { Post, PostDetailApiResponse, PostApiResponse } from '@/@types/learner/Social';

export async function fetchPosts(type?: string): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostApiResponse>({
            url: '/get-post?post_type=' + (type ?? 'blog'),
            method: 'post',
        })
        return response.data.post;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPostDetail(id: string): Promise<Post> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostDetailApiResponse>({
            url: `/joy/contents/${id}`,
            method: 'get',
        })
        return response?.data?.list[0] || null;
    } catch (error) {
        throw error as string;
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

export async function sendComment(postId: number, content: string): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/user-comment-tracking',
            method: 'post',
            data: {
                post_id: postId.toString(),
                content: content
            }
        });
    } catch (error) {
        throw new Error(`Failed to send comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function fetchPublicBlogs(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostApiResponse>({
            url: '/get-post?post_type=blog&content_type=21',
            method: 'post',
        })
        return response.data.post;
    } catch (error) {
        throw error as string;
    }
}