import { useState, useEffect } from "react";
import { NotificationData, Notification as TNotification, NotificationMeta } from "@/@types/notification";
import { fetchNotifications } from "@/services/NotificationService";
import { useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/learner/notificationStore";

export const useNotifications = (params?: URLSearchParams) => {
    return useQuery<NotificationData>({
        queryKey: ['notifications', params?.toString() || ''],
        queryFn: async () => {
            const res = await fetchNotifications(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useNotificationController = () => {
    const {
        notifications: rawNotifications,
        setNotifications: setRawNotifications,
        loading,
        setLoading,
        error,
        setError,
    } = useNotificationStore();

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        next_page_url: null as string | null,
        prev_page_url: null as string | null
    });

    const { data: response, isLoading: isQueryLoading, error: queryError, refetch } = useQuery({
        queryKey: ['notifications-list', pagination.current_page],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', pagination.current_page.toString());
            return await fetchNotifications(params);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // auto-refresh every 5 mins
    });

    useEffect(() => {
        if (response) {
            setRawNotifications(response?.data || []);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                per_page: response?.per_page || 10,
                total: response.total || 0,
                next_page_url: response?.next_page_url,
                prev_page_url: response?.prev_page_url
            });
        }
    }, [response, setRawNotifications]);

    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading, setLoading]);

    useEffect(() => {
        if (queryError) {
            setError('Failed to fetch notifications');
            console.error('Notification fetch error:', queryError);
        } else {
            setError('');
        }
    }, [queryError, setError]);

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const notifications = rawNotifications.map(notification => {
        if (typeof notification.meta === 'string') {
            try {
                return {
                    ...notification,
                    meta: JSON.parse(notification.meta) as NotificationMeta
                };
            } catch {
                return notification;
            }
        }
        return notification;
    }) as TNotification[];

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return {
        notifications,
        loading,
        error,
        setNotifications: setRawNotifications,
        pagination,
        handlePageChange,
        unreadCount,
        refresh: () => refetch()
    };
};
