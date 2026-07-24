import { BrowserRouter } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { Toaster } from 'sonner'
import 'animate.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import InternetSpeedMonitor from '@/components/shared/InternetSpeedMonitor'
import { showNotificationToast } from '@/components/notifications/NotificationToast'
import { AnalyticsInitializer } from '@/components/analytics/AnalyticsInitializer'
import SEO from '@/components/SEO/SEO'
import { useSessionUser, useToken } from '@/store/authStore'
import { fetchLatestNotifications, markNotificationsAsRead } from '@/services/NotificationService'
import { CCIProvider } from '@/context/CCIContext'

if (appConfig.enableMock) {
    import('./mock')
}
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 10 * 1, // 10 minutes
            staleTime: 1000 * 60 * 30 * 1, // 1 minute
        },
    },
});

// const persister = createAsyncStoragePersister({
//     storage: window.localStorage,
// })

function App() {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const userId = useSessionUser((state) => state.user?.id)
    const { token } = useToken()
    const [toastOffset, setToastOffset] = useState<{ top: number; right: number }>({
        top: 96,
        right: 24,
    })
    const authenticated = Boolean(token && signedIn)
    const prevAuthenticatedRef = useRef(authenticated)

    const updateToastOffsetFromAnchor = useMemo(() => {
        const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

        return () => {
            const anchor = document.querySelector<HTMLElement>('[data-notification-toast-anchor="true"]')
            if (!anchor) return

            const rect = anchor.getBoundingClientRect()
            if (!Number.isFinite(rect.right) || !Number.isFinite(rect.bottom)) return

            // Place toast just below the bell, aligned to its right edge.
            const top = clamp(Math.round(rect.bottom + 12), 8, Math.round(window.innerHeight - 160))
            const right = clamp(Math.round(window.innerWidth - rect.right), 8, 200)

            setToastOffset({ top, right })
        }
    }, [])

    useEffect(() => {
        updateToastOffsetFromAnchor()
        window.addEventListener('resize', updateToastOffsetFromAnchor)
        window.addEventListener('scroll', updateToastOffsetFromAnchor, { passive: true })
        return () => {
            window.removeEventListener('resize', updateToastOffsetFromAnchor)
            window.removeEventListener('scroll', updateToastOffsetFromAnchor)
        }
    }, [updateToastOffsetFromAnchor])

    useEffect(() => {
        // Show styled in-app toast when user clicks a background FCM notification.
        if (!('serviceWorker' in navigator)) return;

        const handler = (event: MessageEvent) => {
            const msg = event.data;
            if (!msg || msg.type !== 'FCM_NOTIFICATION_CLICK') return;

            const title = msg.payload?.title || 'New Message';
            const body = msg.payload?.body || '';
            const dateText = msg.payload?.date || msg.payload?.created_at || msg.payload?.time
            const redirectUrl = msg.payload?.redirect_url

            showNotificationToast(title, body, { duration: 8000, dateText, redirectUrl })
        };

        navigator.serviceWorker.addEventListener('message', handler);
        return () => navigator.serviceWorker.removeEventListener('message', handler);
    }, []);

    useEffect(() => {
        const wasAuthenticated = prevAuthenticatedRef.current
        const justLoggedIn = !wasAuthenticated && authenticated
        prevAuthenticatedRef.current = authenticated

        if (!justLoggedIn || !userId) {
            return
        }

        let isCancelled = false

        const showRecentNotifications = async () => {
            try {
                const latestNotifications = await fetchLatestNotifications(4)
                if (isCancelled || latestNotifications.length === 0) return

                const unreadFromLatest = latestNotifications.filter(
                    (notification) => Number(notification.is_read) !== 1
                )
                if (unreadFromLatest.length === 0) return

                // Show oldest first so newest appears last (best visibility).
                const notificationsToShow = [...unreadFromLatest].reverse()

                notificationsToShow.forEach((notification, index) => {
                    const title = notification.message_title || 'New Notification'
                    const body = notification.message || ''

                    window.setTimeout(() => {
                        if (isCancelled) return
                        showNotificationToast(title, body, {
                            duration: 8000,
                            dateText: notification.created_at,
                            redirectUrl: notification.redirect_url,
                            onClick: async () => {
                                try {
                                    await markNotificationsAsRead([notification.id])
                                } catch (error) {
                                    console.error('Failed to mark notification as read:', error)
                                }
                            },
                        })
                    }, index * 350)
                })
            } catch (error) {
                console.error('Failed to load login notifications:', error)
            }
        }

        showRecentNotifications()

        return () => {
            isCancelled = true
        }
    }, [authenticated, userId])

    return (
        <QueryClientProvider client={queryClient}>
            <Theme>
                <BrowserRouter>
                    <AuthProvider>
                        {/* 🚀 ~ Google Analytics: Initialize analytics tracking */}
                        <AnalyticsInitializer />
                        <Layout>
                            <CCIProvider>
                                <Views />
                            </CCIProvider>
                        </Layout>
                        {import.meta.env.VITE_APP_DEBUG === 'true' && (
                            <ReactQueryDevtools initialIsOpen={false} />
                        )}
                        <Toaster position="top-right" offset={toastOffset} />
                        <InternetSpeedMonitor />
                    </AuthProvider>
                </BrowserRouter>
            </Theme>
        </QueryClientProvider>
    )
}

export default App
