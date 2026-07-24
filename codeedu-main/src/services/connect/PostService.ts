import { PollResult, PollResultApiResponse, Post, PostApiResponse, PostComment, PostCommentsApiResponse, PostDetailApiResponse, Suggestion, SavePollResponseData, SavePollResponseResult, LikedUser } from "@/@types/connect/posts";
import ApiService from "../ApiService";
import { Advertisement, AdvertisementResponse } from "@/@types/connect/advertisement";
import { stripHtmlTags } from "@/utils/stripHtmlTags";

export interface RepostData {
    joy_content_id: number;
    description: string;
    category_id: string;
}

export interface RepostResponse {
    status: number;
    data: {
        message: string;
        repost_id?: number;
    };
    error?: string;
}

export interface LikePostData {
    type: 'repost' | 'contents';
    content_id: number;
    like: '0' | '1';
}

export interface CommentData {
    post_id: string;
    content: string;
    type?: 'repost' | '';
}

export interface CreatePostResponse {
    status: number;
    data: {
        message: string;
        post_id?: number;
    };
    error?: string;
    message?: string;
}

export interface UpdatePostResponse {
    status: number;
    data: {
        message: string;
    };
    error?: string;
    message?: string;
}

/** Many Joy endpoints return HTTP 200 with `status: 1` for success and a non-1 value on failure. */
function assertCreateOrUpdatePostSuccess(
    response: CreatePostResponse | UpdatePostResponse | null | undefined,
    fallbackMessage: string
): void {
    if (response == null) {
        throw new Error(fallbackMessage);
    }
    if (response.status === undefined || response.status === null) {
        return;
    }
    const code = Number(response.status);
    if (code === 1 || code === 200) {
        return;
    }
    const msg =
        response.data?.message ||
        response.message ||
        response.error ||
        fallbackMessage;
    throw new Error(typeof msg === 'string' ? msg : fallbackMessage);
}

const validatePostId = (postId: number | string): void => {
    if (!postId || (typeof postId === 'string' && postId.trim() === '')) {
        throw new Error('Post ID is required');
    }
    if (typeof postId === 'number' && postId <= 0) {
        throw new Error('Post ID must be a positive number');
    }
};

/**
 * Validates comment content
 */
const validateCommentContent = (content: string): void => {
    if (!content || content.trim() === '') {
        throw new Error('Comment content is required');
    }
    if (content.length > 1000) {
        throw new Error('Comment content must not exceed 1000 characters');
    }
};

/**
 * Validates repost data
 */
const validateRepostData = (data: RepostData): void => {
    if (!data.joy_content_id || data.joy_content_id <= 0) {
        throw new Error('Valid content ID is required for repost');
    }

    if (data.description && data.description.length >= 500) {
        throw new Error('Repost description must not exceed 500 characters');
    }
};

/**
 * Validates FormData for post creation/update
 */
const validatePostFormData = (data: FormData, isUpdate: boolean = false): void => {
    const title = data.get('title');
    const description = data.get('description');

    if (!isUpdate && (!title || (title as string).trim() === '')) {
        throw new Error('Post title is required');
    }

    if (title && (title as string).length > 200) {
        throw new Error('Post title must not exceed 200 characters');
    }

    // Count visible text only — raw HTML includes <p>, <em>, etc., so it can exceed 5000 while plain text does not.
    if (description) {
        const plain = stripHtmlTags(description as string);
        if (plain.length > 5000) {
            throw new Error('Post description must not exceed 5000 characters');
        }
    }
};

// ERROR HANDLING HELPER

/**
 * Standardized error handler for all service functions
 */
const handleServiceError = (error: unknown, operation: string): never => {
    if (error instanceof Error) {
        throw new Error(`${operation}: ${error.message}`);
    }

    if (typeof error === 'object' && error !== null) {
        const err = error as {
            message?: string;
            response?: {
                data?: {
                    error?: string;
                    message?: string;
                }
            }
        };

        // First check for message in response data (for 409 and other status codes)
        if (err.response?.data?.message) {
            throw new Error(err.response.data.message);
        }

        // Then check for error in response data
        if (err.response?.data?.error) {
            throw new Error(`${operation}: ${err.response.data.error}`);
        }

        // Finally check for error message
        if (err.message) {
            throw new Error(`${operation}: ${err.message}`);
        }
    }

    throw new Error(`${operation}: An unexpected error occurred`);
};

// POST FETCHING

/**
 * Fetches posts from the server with optional filtering parameters
 * @param params - URLSearchParams for filtering posts
 * @returns Promise<Post[]> - Array of posts
 * @throws Error if the request fails
 */
export async function fetchPosts(params?: URLSearchParams): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostApiResponse>({
            url: '/get-post',
            method: 'post',
            params: params
        });
        const rows = response?.data?.post ?? [];
        return rows.map((p) => normalizePostDetailPayload(p) ?? p);
    } catch (error) {
        return handleServiceError(error, 'Failed to fetch posts');
    }
}

/** Fetches detailed information for a specific post
 * @param id - The ID of the post to fetch
 * @returns Promise<Post> - The post details
 * @throws Error if the request fails
 */

/** Candidate API keys that may carry HTML body text (order matters for non-blog: first non-empty wins). */
const DESCRIPTION_KEYS_BLOG_LONGEST = [
    'description',
    'content_description',
    'joy_description',
    'body',
    'content',
    'html_description',
    'detail_description',
    'long_description',
    'full_description',
    'short_description',
    'summary',
    'excerpt',
] as const;

function pickLongestString(r: Record<string, unknown>, keys: readonly string[]): string {
    let best = '';
    for (const key of keys) {
        const v = r[key];
        if (typeof v === 'string' && v.length > best.length) best = v;
    }
    return best;
}

/** Map detail API payloads where description HTML may use alternate keys */
function normalizePostDetailPayload(raw: Post | null | undefined): Post | null {
    if (raw == null) return null;
    const r = raw as unknown as Record<string, unknown>;
    const pickString = (...keys: string[]): string => {
        for (const key of keys) {
            const v = r[key];
            if (typeof v === 'string' && v.length > 0) return v;
        }
        return typeof r.description === 'string' ? r.description : '';
    };
    const ctFromType =
        r.content_type != null && r.content_type !== '' ? String(r.content_type) : '';
    const ctFromId = r.content_type_id != null ? String(r.content_type_id) : '';
    // Strict rule: only content_type=21 is Blog Buzz.
    const isBlog = ctFromType === '21';
    const content_type = ctFromType || ctFromId || String((raw as Post).content_type ?? '');
    const description = isBlog
        ? pickLongestString(r, DESCRIPTION_KEYS_BLOG_LONGEST)
        : pickString(
            'description',
            'content_description',
            'joy_description',
            'body',
            'content',
            'html_description',
            'short_description',
            'summary',
            'excerpt'
        );

    return {
        ...raw,
        description,
        content_type,
    };
}

export async function fetchPostDetails(id: string | undefined): Promise<Post | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostDetailApiResponse>({
            url: `/joy/contents/${id}`,
            method: 'get',
        })
        const row = response?.data?.list[0] || null;
        return normalizePostDetailPayload(row);
    } catch (error) {
        throw error as string;
    }
}


// POST LIKE/UNLIKE

/**
 * Likes or unlikes a post
 * @param post - The post to like/unlike
 * @returns Promise<void>
 * @throws Error if the request fails or validation fails
 */
export async function likePost(post: Post): Promise<void> {
    try {
        validatePostId(post.id);

        const isRepost = post?.repost_id != null;
        const user_liked = isRepost
            ? (post.is_user_repost_like === true || (post.is_user_repost_like as any) === 1 || String(post.is_user_repost_like) === '1' || String(post.is_user_repost_like) === 'true')
            : (post.user_liked === 1 || (post.user_liked as any) === true || String(post.user_liked) === '1' || String(post.user_liked) === 'true');
        const content_id = isRepost ? post.repost_id : post.id;

        const likeData: LikePostData = {
            type: isRepost ? 'repost' : 'contents',
            content_id: content_id!,
            like: user_liked ? '0' : '1'
        };

        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: likeData
        });
    } catch (error) {
        return handleServiceError(error, 'Failed to like post');
    }
}

// repost - v1/joy-content-repost
export async function repostPost(data: { joy_content_id: number; description: string; category_id: string; }): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/v1/joy-content-repost',
            method: 'post',
            data: data,
        })

    } catch (error) {
        throw error as string;
    }
}

// pin post - guessed endpoint based on repost
export async function pinPost(data: { joy_content_id: number; is_pin: number }): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/v1/joy-content-pin',
            method: 'post',
            data: data,
        })
    } catch (error) {
        throw error as string;
    }
}

/** Normalize one liked-user row from alternate API field names. */
function normalizeLikedUserEntry(raw: unknown): LikedUser | null {
    if (raw == null || typeof raw !== 'object') return null;
    const o = raw as Record<string, unknown>;

    // Extract ID (supports id, user_id, userId, student_id, faculty_id)
    const idRaw = o.id ?? o.user_id ?? o.userId ?? o.student_id ?? o.faculty_id;
    const id = typeof idRaw === 'number' ? idRaw : typeof idRaw === 'string' ? Number(idRaw) : NaN;
    if (!Number.isFinite(id)) return null;

    // Extract email
    const email = typeof o.email === 'string' ? o.email.trim() : '';

    // Extract name from a wide list of potential database key variants
    let name = '';
    if (typeof o.name === 'string' && o.name.trim()) {
        name = o.name.trim();
    } else if (typeof o.user_name === 'string' && o.user_name.trim()) {
        name = o.user_name.trim();
    } else if (typeof o.username === 'string' && o.username.trim()) {
        name = o.username.trim();
    } else if (typeof o.first_name === 'string' && o.first_name.trim()) {
        const first = o.first_name.trim();
        const last = typeof o.last_name === 'string' ? o.last_name.trim() : '';
        name = last ? `${first} ${last}` : first;
    } else if (typeof o.fullname === 'string' && o.fullname.trim()) {
        name = o.fullname.trim();
    } else if (typeof o.full_name === 'string' && o.full_name.trim()) {
        name = o.full_name.trim();
    } else if (typeof o.student_name === 'string' && o.student_name.trim()) {
        name = o.student_name.trim();
    } else if (typeof o.trainer_name === 'string' && o.trainer_name.trim()) {
        name = o.trainer_name.trim();
    } else if (typeof o.mentor_name === 'string' && o.mentor_name.trim()) {
        name = o.mentor_name.trim();
    } else if (typeof o.display_name === 'string' && o.display_name.trim()) {
        name = o.display_name.trim();
    } else if (typeof o.created_by_name === 'string' && o.created_by_name.trim()) {
        name = o.created_by_name.trim();
    }

    const username = typeof o.username === 'string' && o.username.trim()
        ? o.username.trim()
        : name || email || `User_${id}`;

    // Graceful fallback to guarantee no user who liked is dropped from the list
    const finalName = name || username || email || `User #${id}`;

    // Extract profile image (supports profile_image, user_profile_image)
    const profile_image =
        o.profile_image != null && typeof o.profile_image === 'string'
            ? o.profile_image
            : typeof o.user_profile_image === 'string'
                ? o.user_profile_image
                : null;

    const mobile_no = o.mobile_no != null && typeof o.mobile_no === 'string' ? o.mobile_no : null;

    let organization_id = 0;
    if (typeof o.organization_id === 'number') organization_id = o.organization_id;
    else if (typeof o.organization_id === 'string') organization_id = parseInt(o.organization_id, 10) || 0;

    return {
        id,
        name: finalName,
        email,
        profile_image,
        mobile_no,
        username: username || finalName,
        organization_id,
    };
}

/** Collect user arrays from common API envelope shapes (`fetchDataWithAxios` already unwraps axios `data`). */
function collectLikedUserArrayCandidates(payload: unknown): unknown[][] {
    const out: unknown[][] = [];
    const push = (v: unknown) => {
        if (Array.isArray(v)) out.push(v);
    };
    push(payload);
    if (payload != null && typeof payload === 'object') {
        const p = payload as Record<string, unknown>;
        push(p.data);
        push(p.list);
        push(p.rows);
        push(p.result);
        push(p.items);
        push(p.records);
        const inner = p.data;
        if (inner != null && typeof inner === 'object') {
            const d = inner as Record<string, unknown>;
            push(d.data);
            push(d.list);
            push(d.rows);
            push(d.records);
        }
    }
    return out;
}

function extractLikedUsersFromResponse(payload: unknown): LikedUser[] {
    const seen = new Set<number>();
    const merged: LikedUser[] = [];
    const take = (u: LikedUser | null) => {
        if (u && !seen.has(u.id)) {
            seen.add(u.id);
            merged.push(u);
        }
    };
    for (const arr of collectLikedUserArrayCandidates(payload)) {
        for (const item of arr) {
            take(normalizeLikedUserEntry(item));
        }
    }
    if (merged.length > 0) return merged;

    /** Some APIs return `{ data: { data: { "1": {...}, "2": {...} } } }` instead of an array. */
    const tryMap = (node: unknown) => {
        if (node == null || typeof node !== 'object' || Array.isArray(node)) return;
        for (const v of Object.values(node as Record<string, unknown>)) {
            take(normalizeLikedUserEntry(v));
        }
    };
    if (payload != null && typeof payload === 'object') {
        const p = payload as Record<string, unknown>;
        tryMap(p.data);
        if (p.data != null && typeof p.data === 'object') {
            tryMap((p.data as Record<string, unknown>).data);
        }
    }
    return merged;
}

export async function fetchLikedUsers(post: { id: number; repost_id?: number | null }): Promise<LikedUser[]> {
    try {
        const isRepost = post?.repost_id != null;
        const contentId = isRepost ? post.repost_id : post.id;
        if (!contentId) return [];

        const payload = await ApiService.fetchDataWithAxios<unknown>({
            url: `/get-liked-users`,
            method: 'get',
            params: {
                content_id: contentId,
                type: isRepost ? 'repost' : 'contents',
            }
        });

        return extractLikedUsersFromResponse(payload);
    } catch (error) {
        return handleServiceError(error, 'Failed to fetch liked users');
    }
}

// COMMENTS

/**
 * Fetches comments for a specific post
 * @param postId - The ID of the post
 * @returns Promise<PostComment[]> - Array of comments
 * @throws Error if the request fails or validation fails
 */
export async function fetchPostComments(postId: number | string): Promise<PostComment[]> {
    try {
        validatePostId(postId);

        const response = await ApiService.fetchDataWithAxios<PostCommentsApiResponse>({
            url: `/get-comments-list/${postId}`,
            method: 'get',
        });

        return response?.data?.list ?? [];
    } catch (error) {
        return handleServiceError(error, 'Failed to fetch comments');
    }
}

/**
 * Sends a comment on a post
 * @param post - The post to comment on
 * @param content - The comment content
 * @returns Promise<void>
 * @throws Error if the request fails or validation fails
 */
export async function sendComment(post: Post, content: string): Promise<void> {
    try {
        validatePostId(post.id);
        validateCommentContent(content);

        const isRepost = post.repost_id != null;
        const postId = isRepost ? post.repost_id! : post.id;

        const commentData: CommentData = {
            post_id: postId.toString(),
            content: content.trim(),
            type: isRepost ? 'repost' : ''
        };

        await ApiService.fetchDataWithAxios({
            url: '/user-comment-tracking',
            method: 'post',
            data: commentData
        });
    } catch (error) {
        return handleServiceError(error, 'Failed to send comment');
    }
}

// SEARCH SUGGESTIONS

/**
 * Fetches search suggestions based on query
 * @param query - The search query string
 * @returns Promise<Suggestion[]> - Array of suggestions
 * @throws Error if the request fails
 */
export async function fetchSuggestions(query: string): Promise<Suggestion[]> {
    try {
        if (!query || query.trim() === '') {
            return [];
        }

        const sanitizedQuery = encodeURIComponent(query.trim());
        const response = await fetch(
            `https://elastic.edulystventures.com/search?org_key=1345643162&query=${sanitizedQuery}`
        );

        const data = await response.json();
        return data?.suggestions ?? [];
    } catch (error) {
        return handleServiceError(error, 'Failed to fetch suggestions');
    }
}

// ============================================
// REPOST
// ============================================

/**
 * Creates a repost (re-Buzz) of an existing post
 * @param data - Repost data including content ID, description, and category
 * @returns Promise<RepostResponse> - Response with repost ID
 * @throws Error if the request fails or validation fails
 */
export async function createRepost(data: RepostData): Promise<RepostResponse> {
    try {
        validateRepostData(data);

        const response = await ApiService.fetchDataWithAxios<RepostResponse>({
            url: '/v1/joy-content-repost',
            method: 'post',
            data: {
                joy_content_id: data.joy_content_id,
                description: data.description.trim(),
                category_id: data.category_id
            }
        });
        return response;
    } catch (error: unknown) {
        // Extract message from axios error response
        if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                throw new Error(axiosError.response.data.message);
            }
        }
        return handleServiceError(error, 'Failed to create repost');
    }
}

/**
 * Creates a repost (re-Buzz) of an existing post
 * @param data - Repost data including content ID, description, and category
 * @returns Promise<RepostResponse> - Response with repost ID
 * @throws Error if the request fails or validation fails
 */
export async function updateRepost(data: RepostData, id: number): Promise<RepostResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<RepostResponse>({
            url: '/v1/repost-update/' + id,
            method: 'post',
            data: {
                description: data.description.trim(),
            }
        });
        return response;
    } catch (error: unknown) {
        // Extract message from axios error response
        if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                throw new Error(axiosError.response.data.message);
            }
        }
        return handleServiceError(error, 'Failed to create repost');
    }
}

// ============================================
// POST CREATION & UPDATE
// ============================================

/**
 * Creates a new community post
 * @param data - FormData containing post information
 * @returns Promise<CreatePostResponse> - Response with post ID
 * @throws Error if the request fails or validation fails
 */
export async function addCommunityPost(data: FormData): Promise<CreatePostResponse> {
    try {
        validatePostFormData(data, false);

        const response = await ApiService.fetchDataWithAxios<CreatePostResponse>({
            url: `/create-post`,
            method: 'post',
            data: data as unknown as Record<string, unknown>
        });

        assertCreateOrUpdatePostSuccess(response, 'Failed to create post');
        return response;
    } catch (error) {
        return handleServiceError(error, 'Failed to create post');
    }
}

/**
 * Updates an existing community post
 * @param postId - The ID of the post to update
 * @param data - FormData containing updated post information
 * @returns Promise<UpdatePostResponse> - Response with success message
 * @throws Error if the request fails or validation fails
 */
export async function updateCommunityPost(postId: string, data: FormData): Promise<UpdatePostResponse> {
    try {
        validatePostId(postId);
        validatePostFormData(data, true);

        const response = await ApiService.fetchDataWithAxios<UpdatePostResponse>({
            url: `/update-post/${postId}`,
            method: 'post',
            data: data as unknown as Record<string, unknown>,
        });

        assertCreateOrUpdatePostSuccess(response, 'Failed to update post');
        return response;
    } catch (error) {
        return handleServiceError(error, 'Failed to update post');
    }
}


export async function getPollResults(pollId: number): Promise<PollResult> {
    try {
        const response = await ApiService.fetchDataWithAxios<PollResultApiResponse>({
            url: `/survey-result/${pollId}`,
            method: 'get',
        });
        return response?.data?.survey_result;
    } catch (error) {
        throw error as string;
    }
}

/**
 * Saves a poll response
 * @param data - Poll response data
 * @returns Promise<SavePollResponseResult>
 */
export async function savePollResponse(data: SavePollResponseData): Promise<SavePollResponseResult> {
    try {
        const formData = new FormData();
        formData.append('content_id', data.content_id.toString());
        formData.append('question_id', data.question_id.toString());

        // Handle option_id array
        if (data.option_id && data.option_id.length > 0) {
            data.option_id.forEach((optionId: string) => {
                formData.append('option_id[]', optionId);
            });
        }

        formData.append('mark_review', '0');
        formData.append('durationSec', '0');

        const response = await ApiService.fetchDataWithAxios<SavePollResponseResult>({
            url: '/assessment-submit',
            method: 'post',
            data: formData as unknown as Record<string, unknown>,
        });

        return response;
    } catch (error: unknown) {
        // Extract message from axios error response
        if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                throw new Error(axiosError.response.data.message);
            }
        }
        return handleServiceError(error, 'Failed to save poll response');
    }
}


export async function fetchAdvertisements(): Promise<Advertisement[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AdvertisementResponse>({
            url: '/v1/get-infocus-promotions?type=advertisement',
            method: 'get',

        })
        return response?.data ?? [];
    } catch (error) {
        throw error as string;
    }
}


export async function deletePost(id: number): Promise<string> {
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
            url: `/v1/repost-delete/${id}`,
            method: 'post',
        })
        return response.message
    } catch (error) {
        throw error as string;
    }
}