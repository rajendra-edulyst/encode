/**
 * UTM URL Access Tracking Types
 */

// Request payload for logging URL access
export interface LogUrlAccessRequest {
    reference_id?: number | string;
    type?: string;
    url?: string;
    utm_source?: string | null;
}

// Response from log URL access endpoint
export interface LogUrlAccessResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        user_id: number;
        reference_id: number;
        type: string;
        url: string;
        created_at: string;
        updated_at: string;
    };
}

// Analytics data for a specific event
export interface UrlAnalyticsData {
    total_visits: number;
    unique_visitors: number;
    visits_by_type: Array<{
        type: string;
        count: number;
    }>;
    daily_visits: Array<{
        date: string;
        count: number;
    }>;
    top_visitors: Array<{
        id: number;
        name: string;
        email: string;
        visit_count: number;
    }>;
}

export interface UrlAnalyticsResponse {
    success: boolean;
    data: UrlAnalyticsData;
}

// URL access record
export interface UrlAccessRecord {
    id: number;
    user_id: number;
    reference_id: number;
    type: string;
    url: string;
    created_at: string;
    updated_at: string;
    user_name: string;
    user_email: string;
}

// Paginated list of URL access records
export interface UrlAccessListResponse {
    success: boolean;
    data: {
        current_page: number;
        data: UrlAccessRecord[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

// Filter options for URL access list
export interface UrlAccessListFilters {
    perPage?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
}
