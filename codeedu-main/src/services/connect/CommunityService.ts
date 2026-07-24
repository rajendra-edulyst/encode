import { CommunityCategory, CommunityCategoryDetailsApiResponse, CommunityMembersApiResponse, OrgCommunities, OrgCommunityApiResponse } from "@/@types/connect/community";
import ApiService from "../ApiService";

export type JoyCatActionApiResponse = {
    status: number;
    message?: string;
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validates community ID
 * @param id - Community ID to validate
 * @throws Error if ID is invalid
 */
function validateCommunityId(id: number): void {
    if (!id || id <= 0 || !Number.isInteger(id)) {
        throw new Error('Invalid community ID. ID must be a positive integer.');
    }
}

/**
 * Validates report reason
 * @param reason - Report reason to validate
 * @throws Error if reason is invalid
 */
function validateReportReason(reason: string): void {
    if (!reason || typeof reason !== 'string') {
        throw new Error('Report reason is required.');
    }

    const trimmedReason = reason.trim();
    if (trimmedReason.length === 0) {
        throw new Error('Report reason cannot be empty.');
    }

    if (trimmedReason.length > 1000) {
        throw new Error('Report reason cannot exceed 1000 characters.');
    }
}

/**
 * Centralized error handler for service calls
 * @param error - Error object
 * @param operation - Operation name for context
 * @throws Error with descriptive message
 */
function handleServiceError(error: unknown, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`[CommunityService] ${operation} failed:`, error);
    throw new Error(`${operation} failed: ${errorMessage}`);
}

// ==================== SERVICE FUNCTIONS ====================

/**
 * Fetches organization communities with optional filters
 * @param params - Optional URL search parameters for filtering
 * @returns Promise resolving to array of organization communities
 * @throws Error if fetch fails
 * 
 * @example
 * const params = new URLSearchParams();
 * params.append('self_joined', '1');
 * const communities = await fetchOrgCommunities(params);
 */
export async function fetchOrgCommunities(params?: URLSearchParams): Promise<OrgCommunities[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<OrgCommunityApiResponse>({
            url: `/v1/org-popular-community`,
            method: 'get',
            params: params
        });
        return response?.data ?? [];
    } catch (error) {
        handleServiceError(error, 'Fetch org communities');
    }
}

/**
 * Joins a community by ID
 * @param id - Community ID to join
 * @returns Promise resolving when join is successful
 * @throws Error if ID is invalid or join fails
 * 
 * @example
 * await joinCommunity(123);
 */
export async function joinCommunity(id: number): Promise<void> {
    validateCommunityId(id);

    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/courses/user-mapping?category_ids=${id}`,
            method: 'get',
        });
    } catch (error) {
        handleServiceError(error, 'Join community');
    }
}

/**
 * Leaves a community by ID
 * @param id - Community ID to leave
 * @returns Promise resolving when leave is successful
 * @throws Error if ID is invalid or leave fails
 * 
 * @example
 * await leaveCommunity(123);
 */
export async function leaveCommunity(id: number): Promise<void> {
    validateCommunityId(id);

    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/user-joy-category-unmap/${id}`,
            method: 'post',
        });
    } catch (error) {
        handleServiceError(error, 'Leave community');
    }
}

/**
 * Reports a community with a reason
 * @param communityId - Community ID to report
 * @param reason - Reason for reporting (max 1000 chars)
 * @returns Promise resolving when report is successful
 * @throws Error if validation fails or report fails
 * 
 * @example
 * await reportCommunity(123, 'Inappropriate content');
 */
export async function reportCommunity(communityId: number, reason: string): Promise<void> {
    validateCommunityId(communityId);
    validateReportReason(reason);

    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/user-community-report',
            method: 'post',
            data: {
                joy_category_id: communityId,
                comments: reason.trim(),
            }
        });
    } catch (error) {
        handleServiceError(error, 'Report community');
    }
}

/**
 * Mutes or unmutes a community
 * @param communityId - Community ID to mute/unmute
 * @returns Promise resolving when mute/unmute is successful
 * @throws Error if ID is invalid or operation fails
 * 
 * @example
 * await muteCommunity(123);
 */
export async function muteCommunity(communityId: number): Promise<void> {
    validateCommunityId(communityId);

    try {
        await ApiService.fetchDataWithAxios<void>({
            url: '/v1/user-community-mute',
            method: 'post',
            data: {
                joy_category_id: communityId,
            }
        });
    } catch (error) {
        handleServiceError(error, 'Mute community');
    }
}

/**
 * Deletes a community (admin only)
 * @param communityId - Community ID to delete
 * @returns Promise resolving when deletion is successful
 * @throws Error if ID is invalid or deletion fails
 * 
 * @example
 * await deleteCommunity(123);
 */
export async function deleteCommunity(communityId: number): Promise<void> {
    validateCommunityId(communityId);

    try {
        await ApiService.fetchDataWithAxios<void>({
            url: `/joy/category/delete/${communityId}`,
            method: 'get',
        });
    } catch (error) {
        handleServiceError(error, 'Delete community');
    }
}

/**
 * Maps all organization learners to a community (joy category).
 * POST /joy_cat/map_user — form field: category_id
 */
export async function mapCommunityUsers(categoryId: number): Promise<JoyCatActionApiResponse> {
    validateCommunityId(categoryId);

    const formData = new FormData();
    formData.append("category_id", String(categoryId));

    try {
        const response = await ApiService.fetchDataWithAxios<JoyCatActionApiResponse>({
            url: `/joy_cat/map_user`,
            method: "post",
            data: formData,
        });
        if (response?.status !== 1) {
            throw new Error(response?.message || "Failed to map organization users");
        }
        return response;
    } catch (error) {
        handleServiceError(error, "Map organization users to community");
    }
}

/**
 * Maps users from an uploaded CSV to a community.
 * POST /joy_cat/csv_map_user — form fields: category_id, csv_file
 */
export async function csvMapCommunityUsers(categoryId: number, csvFile: File): Promise<JoyCatActionApiResponse> {
    validateCommunityId(categoryId);

    if (!csvFile || !(csvFile instanceof File)) {
        throw new Error("Please upload a CSV file");
    }

    const formData = new FormData();
    formData.append("category_id", String(categoryId));
    formData.append("csv_file", csvFile);

    try {
        const response = await ApiService.fetchDataWithAxios<JoyCatActionApiResponse>({
            url: `/joy_cat/csv_map_user`,
            method: "post",
            data: formData,
        });
        if (response?.status !== 1) {
            throw new Error(response?.message || "Failed to upload CSV");
        }
        return response;
    } catch (error) {
        handleServiceError(error, "CSV map users to community");
    }
}

/** Fallback if `public/sample-map-users.csv` cannot be fetched (matches that file). */
const SAMPLE_MAP_USERS_CSV_FALLBACK = "email\ntest@example.com\n";

function triggerBlobDownload(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
}

/**
 * Download the sample CSV from `public/sample-map-users.csv` (served at app root, same-origin → direct download).
 */
export async function downloadSampleMapUsersCsv(): Promise<void> {
    const path = `${import.meta.env.BASE_URL}sample-map-users.csv`.replace(/\/{2,}/g, "/");

    try {
        const res = await fetch(path);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const blob = await res.blob();
        if (blob.size < 1) {
            throw new Error("Empty sample CSV");
        }
        triggerBlobDownload(blob, "sample-map-users.csv");
    } catch {
        const blob = new Blob([SAMPLE_MAP_USERS_CSV_FALLBACK], {
            type: "text/csv;charset=utf-8;",
        });
        triggerBlobDownload(blob, "sample-map-users.csv");
    }
}
export async function fetchCommunityDetails(params: URLSearchParams): Promise<CommunityCategory> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityCategoryDetailsApiResponse>({
            url: `/v1/org-popular-community-by-id`,
            method: 'get',
            params
        });
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityMembers(id: number): Promise<CommunityMembersApiResponse> {
    try {
        console.log('response', id);
        const response = await ApiService.fetchDataWithAxios<CommunityMembersApiResponse>({
            url: `/v1/community-peoples/${id}`,
            method: 'get',
        })
        return response;
    } catch (error) {
        throw error as string;
    }
}