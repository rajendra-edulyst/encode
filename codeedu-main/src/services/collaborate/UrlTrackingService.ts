/**
 * URL Tracking Service
 * Handles API calls for UTM URL access tracking
 */

import ApiService from '@/services/ApiService';
import type {
    LogUrlAccessRequest,
    LogUrlAccessResponse,
    UrlAnalyticsResponse,
    UrlAccessListResponse,
    UrlAccessListFilters,
} from '@/@types/collaborate/url-tracking';

/**
 * Log URL access when a user lands on an event/competition page
 * This is a "fire and forget" operation - errors are silently handled
 */
export async function logEventUrlAccess(
    data: LogUrlAccessRequest
): Promise<LogUrlAccessResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<LogUrlAccessResponse>({
            url: '/v1/log-event-url-access',
            method: 'post',
            data: {
                reference_id: data.reference_id,
                type: data.type,
                url: data.url,
                utm_source: data.utm_source,
            },
        });
        return response;
    } catch (error) {
        // Silently fail - URL tracking should never interrupt user experience
        console.error('Failed to log URL access:', error);
        return {
            success: false,
            message: 'Failed to log URL access',
        };
    }
}

/**
 * Get URL analytics/statistics for a specific event or program
 */
export async function getEventUrlAnalytics(
    referenceId: number
): Promise<UrlAnalyticsResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<UrlAnalyticsResponse>({
            url: `/v1/event-url-analytics/${referenceId}`,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

/**
 * Get paginated list of URL access records for a specific reference
 */
export async function getEventUrlAccessList(
    referenceId: number,
    filters?: UrlAccessListFilters
): Promise<UrlAccessListResponse> {
    try {
        const params = new URLSearchParams();
        
        if (filters?.perPage) {
            params.append('per_page', filters.perPage.toString());
        }
        if (filters?.type) {
            params.append('type', filters.type);
        }
        if (filters?.startDate) {
            params.append('start_date', filters.startDate);
        }
        if (filters?.endDate) {
            params.append('end_date', filters.endDate);
        }

        const queryString = params.toString();
        const url = `/v1/event-url-access-list/${referenceId}${queryString ? `?${queryString}` : ''}`;

        const response = await ApiService.fetchDataWithAxios<UrlAccessListResponse>({
            url,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

export async function decryptEventId(
    encryptedId: string
): Promise<string | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            success: boolean;
            data: { decrypted_id: string };
        }>({
            url: `/v1/decrypt-event-id?encrypted_id=${encodeURIComponent(encryptedId)}`,
            method: 'get',
        });
        return response.data?.decrypted_id || null;
    } catch (error) {
        console.error('Failed to decrypt event ID:', error);
        return null;
    }
}
