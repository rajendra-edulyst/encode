import { messaging } from "@/services/firebase/firebaseConfig"
import { getToken, onMessage, isSupported } from "firebase/messaging"
import ApiService from '@/services/ApiService';
import { toast } from "sonner";
import type { Notification, NotificationApiResponse, NotificationData } from '@/@types/notification';
import { showNotificationToast, showBlockedNotificationToast } from "@/components/notifications/NotificationToast";

export async function markNotificationsAsRead(notificationIds: number[]): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: '/notifications/mark-read',
            method: 'post',
            data: {
                notification_ids: notificationIds,
            },
        });
    } catch (error) {
        throw new Error(`Failed to mark notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const onMessageListener = () =>
    onMessage(messaging, (payload) => {
        console.log("🔔 Foreground Message Received:", payload);

        const title = payload.notification?.title || payload.data?.title || "New Notification";
        const body = payload.notification?.body || payload.data?.body || "Check your details";

        const dateText = payload.data?.date || payload.data?.created_at || payload.data?.time
        const redirectUrl = payload.data?.redirect_url
        showNotificationToast(title, body, { duration: 8000, dateText, redirectUrl })
    });


export const initOnMessage = () =>
    onMessage(messaging, (payload) => {
        console.log("🔔 Foreground Message:", payload);

        const title =
            payload.notification?.title ||
            payload.data?.title ||
            "New Notification";

        const body =
            payload.notification?.body ||
            payload.data?.body ||
            "Check details";

        const dateText =
            payload.data?.date ||
            payload.data?.created_at ||
            payload.data?.time;
        const redirectUrl = payload.data?.redirect_url

        showNotificationToast(title, body, {
            duration: 8000,
            dateText,
            redirectUrl,
        });
    });
export async function saveDeviceToken(
    deviceId: string,
    deviceType: string,
    token: string
): Promise<{
    status: number;
    data: { id: number; message: string; }[];
    error: string[];
}> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            status: number;
            data: { id: number; message: string; }[];
            error: string[];
        }>({
            url: `/saveDeviceToken`,
            method: 'post',
            data: {
                device_id: deviceId,
                device_type: deviceType,
                device_token: token
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchNotifications(params?: URLSearchParams): Promise<NotificationData> {
    try {
        const response = await ApiService.fetchDataWithAxios<NotificationApiResponse>({
            url: `/notifications`,
            method: 'get',
            params
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchLatestNotifications(limit: number = 4): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('per_page', String(limit));

    const data = await fetchNotifications(params);

    const sorted = [...(data?.data || [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sorted.slice(0, limit);
}

type DeleteNotificationParams =
    | { notification_id: number[] }
    | { isClearAll: boolean };

export async function deleteNotification(params: DeleteNotificationParams): Promise<void> {
    try {
        let queryParams: Record<string, unknown>;

        if ("notification_id" in params) {
            queryParams = {
                notification_id: params.notification_id.join(","),
            };
        } else {
            queryParams = {
                is_clear_all: params.isClearAll ? 1 : 0,
            };
        }

        await ApiService.fetchDataWithAxios({
            url: "/clear-notification",
            method: "get",
            params: queryParams,
        });
    } catch (error) {
        throw new Error(
            `Failed to delete notifications: ${error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}


// let isRegistering = false;
// let hasBlockedToastShown = false;

// export async function requestFCMToken(userGesture: boolean = false): Promise<void> {
//     if (isRegistering) {
//         console.info("ℹ️ Token registration or permission request already in progress.");
//         return;
//     }

//     try {
//         const supported = await isSupported();
//         if (!supported) {
//             console.warn("❌ FCM is not supported in this browser.");
//             return;
//         }

//         // Lock registration early to prevent multiple prompts or race conditions
//         isRegistering = true;

//         if (!('Notification' in window)) {
//             console.warn("❌ Notification API not available.");
//             return;
//         }

//         let permission = window.Notification.permission;
//         console.log(`ℹ️ Initial notification permission status: ${permission}`);

//         // Try to request permission if it's currently 'default'.
//         if (permission === 'default') {
//             try {
//                 console.log("ℹ️ Attempting automatic notification permission request...");
//                 permission = await window.Notification.requestPermission();
//                 console.log(`ℹ️ After-request notification permission status: ${permission}`);

//                 // If still default (blocked by browser due to lack of user gesture), show prompt
//                 if (permission === 'default' && !userGesture) {
//                     toast("🔔 Notifications Blocked", {
//                         description: "Web browser notifications is blocked. Click Enable to get real-time updates.",
//                         duration: 10000,
//                         action: {
//                             label: "Enable Now",
//                             onClick: () => {
//                                 requestFCMToken(true);
//                             }
//                         },
//                     });
//                     isRegistering = false;
//                     return;
//                 }
//             } catch (err) {
//                 console.warn("⚠️ Notification permission request threw error:", err);
//             }
//         }

//         if (permission === 'granted') {
//             console.log("✅ Notification permission is 'granted'. Proceeding with FCM registration...");
//             let swRegistration: ServiceWorkerRegistration | undefined;
//             if ('serviceWorker' in navigator) {
//                 try {
//                     console.log(`🌐 Environment: ${window.location.protocol} // ${window.location.origin}`);

//                     // Use a more robust path for the service worker
//                     const swPath = '/firebase-messaging-sw.js';
//                     swRegistration = await navigator.serviceWorker.register(swPath);

//                     // Wait for it to be ready
//                     await navigator.serviceWorker.ready;
//                     console.log("✅ Service Worker registered and ready at:", swRegistration.scope);
//                 } catch (swError) {
//                     console.error("❌ Service Worker registration failed:", swError);
//                 }
//             }

//             try {
//                 console.log("🌐 Attempting to get FCM token...");
//                 const swRegistration = await navigator.serviceWorker.ready;
//                 const currentToken = await getToken(messaging, {
//                     vapidKey: "BDjHUt1fxiQfUezv-gxuTK5wO_nXnqAWdwBgnSmUP3AWKl1HnT0Mb0QOaxH4SDAct7AIGrUnJZ0GIi-4JaT7kk8",
//                     serviceWorkerRegistration: swRegistration
//                 });

//                 if (currentToken) {
//                     console.log("✅ FCM Token retrieved successfully.");

//                     // Use localStorage to check if this token was already saved successfully
//                     const savedToken = localStorage.getItem('fcm_token_saved');

//                     // Avoid duplicate calls if the token is the same as the last one saved successfully
//                     if (currentToken === savedToken) {
//                         console.info("ℹ️ Device token already saved successfully.");
//                         return;
//                     }

//                     const deviceType = "3"; // Web
//                     const deviceId = navigator.userAgent;
//                     console.log(`🌐 Calling saveDeviceToken for DeviceID: ${deviceId.substring(0, 30)}...`);
//                     const response = await saveDeviceToken(deviceId, deviceType, currentToken);
//                     if (response.status === 1) {
//                         localStorage.setItem('fcm_token_saved', currentToken);
//                         console.log("✅ Device token saved successfully:", response.data);
//                     } else {
//                         console.error("❌ Failed to save device token (Status 0):", response.error);
//                     }
//                 } else {
//                     console.warn("⚠️ No registration token available.");
//                 }
//             } catch (tokenError) {
//                 console.error("❌ Failed to retrieve FCM token:", tokenError);
//             }
//         } else if (permission === 'denied') {
//             console.warn("⚠️ Notification permission denied by user.");
//             // Show the specific blocked toast with unblock instructions only once per session
//             if (!hasBlockedToastShown) {
//                 showBlockedNotificationToast();
//                 hasBlockedToastShown = true;
//             }
//         }
//     } catch (err) {
//         console.error("❌ An unexpected error occurred in requestFCMToken:", err);
//     } finally {
//         isRegistering = false;
//     }
// }

let isRegistering = false;
let hasBlockedToastShown = false;

export async function requestFCMToken(userGesture: boolean = false): Promise<void> {
    if (isRegistering) {
        console.info("ℹ️ Already processing FCM...");
        return;
    }

    isRegistering = true;

    try {
        // ✅ Check support
        const supported = await isSupported();
        if (!supported) {
            console.warn("❌ FCM not supported");
            return;
        }

        if (!("Notification" in window)) {
            console.warn("❌ Notification API not available");
            return;
        }

        // ✅ Permission handling
        let permission = Notification.permission;
        console.log("ℹ️ Permission:", permission);

        if (permission === "default") {
            permission = await Notification.requestPermission();
            console.log("ℹ️ After request:", permission);

            if (permission === "default" && !userGesture) {
                toast("🔔 Notifications Blocked", {
                    description: "Click Enable to allow notifications.",
                    duration: 10000,
                    action: {
                        label: "Enable Now",
                        onClick: () => requestFCMToken(true),
                    },
                });
                return;
            }
        }

        if (permission === "denied") {
            if (!hasBlockedToastShown) {
                showBlockedNotificationToast();
                hasBlockedToastShown = true;
            }
            return;
        }

        // ✅ IMPORTANT FIX: DO NOT REGISTER SW HERE
        if (!("serviceWorker" in navigator)) {
            console.warn("❌ Service Worker not supported");
            return;
        }

        // ✅ ALWAYS use READY (this fixes your bug)
        const swRegistration = await navigator.serviceWorker.ready;

        console.log("✅ Using SW:", swRegistration.scope);

        // ✅ Get token
        console.log("🌐 Getting FCM token...");

        const currentToken = await getToken(messaging, {
            vapidKey: "BDjHUt1fxiQfUezv-gxuTK5wO_nXnqAWdwBgnSmUP3AWKl1HnT0Mb0QOaxH4SDAct7AIGrUnJZ0GIi-4JaT7kk8",
            serviceWorkerRegistration: swRegistration,
        });

        if (!currentToken) {
            console.warn("⚠️ No token received");
            return;
        }

        console.log("✅ FCM Token:", currentToken);

        // ✅ Prevent duplicate API calls
        const savedToken = localStorage.getItem("fcm_token_saved");

        if (currentToken === savedToken) {
            console.info("ℹ️ Token already saved");
            return;
        }

        const deviceType = "3";
        const deviceId = navigator.userAgent;

        console.log("🌐 Saving device token...");

        const response = await saveDeviceToken(deviceId, deviceType, currentToken);

        if (response.status === 1) {
            localStorage.setItem("fcm_token_saved", currentToken);
            console.log("✅ Token saved successfully");
        } else {
            console.error("❌ Save token failed:", response.error);
        }

    } catch (error) {
        console.error("❌ FCM ERROR:", error);
    } finally {
        isRegistering = false;
    }
}
