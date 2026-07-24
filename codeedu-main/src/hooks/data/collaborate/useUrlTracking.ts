/**
 * URL Tracking Hook
 * Custom React hook for UTM URL access tracking
 */

import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/auth';
import {
    logEventUrlAccess,
    getEventUrlAnalytics,
    getEventUrlAccessList,
} from '@/services/collaborate/UrlTrackingService';
import type {
    LogUrlAccessRequest,
    UrlAccessListFilters,
} from '@/@types/collaborate/url-tracking';

/**
 * Hook to log URL access - fires once on mount for authenticated users
 * Uses "fire and forget" pattern - errors are silently handled
 */
export const useLogUrlAccess = (
    referenceId: number | string | undefined,
    type: string,
    options?: {
        enabled?: boolean;
        url?: string;
    }
) => {
    const { authenticated, user } = useAuth();
    const hasLoggedRef = useRef(false);

    useEffect(() => {
        // Only log once per mount, when authenticated and enabled
        if (
            !hasLoggedRef.current &&
            authenticated &&
            user &&
            referenceId &&
            options?.enabled !== false
        ) {
            hasLoggedRef.current = true;

            const currentUrl = options?.url || (typeof window !== 'undefined' ? window.location.href : '');
            
            // Fire and forget - don't await, don't block
            logEventUrlAccess({
                reference_id: (typeof referenceId === 'string' && /^\d+$/.test(referenceId)) ? parseInt(referenceId, 10) : referenceId,
                type,
                url: currentUrl,
            }).catch(() => {
                // Silently fail
            });
        }
    }, [authenticated, user, referenceId, type, options?.enabled, options?.url]);
};

/**
 * Mutation hook for manually logging URL access
 */
export const useLogUrlAccessMutation = () => {
    const { authenticated } = useAuth();

    return useMutation({
        mutationFn: async (data: LogUrlAccessRequest) => {
            if (!authenticated) {
                return { success: false, message: 'User not authenticated' };
            }
            return logEventUrlAccess(data);
        },
        onError: () => {
            // Silently fail - don't interrupt user experience
        },
    });
};

/**
 * Hook to get URL analytics for a specific event
 */
export const useEventUrlAnalytics = (referenceId: number | undefined) => {
    return useQuery({
        queryKey: ['event-url-analytics', referenceId],
        queryFn: async () => {
            if (!referenceId) throw new Error('Reference ID is required');
            return getEventUrlAnalytics(referenceId);
        },
        enabled: !!referenceId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to get URL access list for a specific event
 */
export const useEventUrlAccessList = (
    referenceId: number | undefined,
    filters?: UrlAccessListFilters
) => {
    return useQuery({
        queryKey: ['event-url-access-list', referenceId, filters],
        queryFn: async () => {
            if (!referenceId) throw new Error('Reference ID is required');
            return getEventUrlAccessList(referenceId, filters);
        },
        enabled: !!referenceId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
