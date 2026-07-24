import appConfig from "@/configs/app.config";

export const STORAGE_EXPIRY_KEY = "storage_expiry_time";
export const APP_VERSION_KEY = "app_version";
export const APP_VERSION = appConfig.appVersion;

/**
 * Clears localStorage and cookies if 24 hours have passed.
 */
export const clearStorageIfExpired = () => {
    const expiryTime = localStorage.getItem(STORAGE_EXPIRY_KEY);
    const savedAppVersion = localStorage.getItem(APP_VERSION_KEY);
    const isExpired = !expiryTime || Date.now() > Number(expiryTime);
    const isVersionChanged = savedAppVersion !== APP_VERSION;

    if (isExpired || isVersionChanged) {
        localStorage.clear();
        clearCookies();
        // notificationStore form localStorage
        localStorage.setItem(STORAGE_EXPIRY_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString());
        localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
        window.location.reload(); // or redirect to login if needed
    }
};


/**
 * Clears all cookies.
 */
export const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
};
