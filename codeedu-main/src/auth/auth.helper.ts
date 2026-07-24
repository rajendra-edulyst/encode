// src/hooks/useSetAuth.ts

import { ADMIN, FACULTY, INDUSTRY, LEARNER, PACKAGE_MANAGER, ACADEMMIC_DASHBOARD } from "@/constants/roles.constant";
import { User } from "@/@types/auth";
import { FORCE_HOME_AFTER_LOGOUT_KEY, REDIRECT_URL_KEY } from "@/constants/app.constant";
import appConfig from "@/configs/app.config";
import { useSessionUser, useToken } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { setProfileEditKey } from "@/views/common/profile-view/config";
import { useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";

export function useSetAuth() {
    const { setToken } = useToken();
    const queryClient = useQueryClient();
    const { setUser, setProfile } = useSessionUser((state) => state);
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn);
    const navigate = useNavigate();

    const setAuth = ({ token, user }: { token: string; user: User }) => {
        // Profile image fallback
        if (!user?.profile_image) {
            user.profile_image = "https://ui-avatars.com/api/?name=" + user?.name;
        }

        // Role-based authority
        if (user?.role?.toLowerCase() === "learner") {
            user.authority = [LEARNER];
            setProfile('creator');
        }

        if (user?.role?.toLowerCase() === "presenter") {
            user.authority = [FACULTY];
            if (user?.user_roles?.includes('PackageManager')) {
                user.authority.push(PACKAGE_MANAGER);
            }
            if (user?.user_roles?.includes('AcademicHead')) {
                user.authority.push(ACADEMMIC_DASHBOARD);
            }
            setProfile('presenter');
        }

        if (user?.role?.toLowerCase() === "admin") {
            user.authority = [ADMIN];
        }

        if (user?.user_org_type === "industry" || user?.user_org_type === "institute") {
            if (user?.role?.toLowerCase() === "admin") {
                user.authority = [INDUSTRY];
                setProfile('creator');
            }
        }

        // Clear cache and set session
        queryClient.clear();

        setToken(token);
        setSessionSignedIn(true);
        setUser(user);
        setProfileEditKey(user?.profile_svc_editkey ?? "");

        if (user?.mec_regd_id) {
            localStorage.setItem('mec_regd_id', user.mec_regd_id);
        } else {
            localStorage.removeItem('mec_regd_id');
        }
        // Role-based home (ignore ProtectedRoute redirectUrl after login)
        const getHomePath = (u: User) => {
            const role = (u?.role || '').toLowerCase();
            const org = (u?.user_org_type || '').toLowerCase();
            const isIndustryOrInstituteAdmin =
                role === 'admin' && (org === 'industry' || org === 'institute');
            return isIndustryOrInstituteAdmin ? "/collaborate" : "/create";
        };

        const isSafeInternalRedirect = (value: string | null) => {
            if (!value) return false
            let checkValue = value;
            if (value.startsWith('http')) {
                try {
                    const u = new URL(value);
                    if (u.origin !== window.location.origin) return false;
                    checkValue = u.pathname + u.search + u.hash;
                } catch {
                    return false;
                }
            }
            if (!checkValue.startsWith('/')) return false
            if (checkValue.startsWith('//')) return false
            return true
        }

        const getSafeRedirectUrl = (value: string | null) => {
            if (!value) return null;
            if (value.startsWith('http')) {
                try {
                    const u = new URL(value);
                    if (u.origin === window.location.origin) {
                        return u.pathname + u.search + u.hash;
                    }
                } catch { }
            }
            return value;
        };

        // Handle redirect / onboarding
        const search = window.location.search;
        const params = new URLSearchParams(search);
        let redirectUrl = params.get(REDIRECT_URL_KEY);
        const forceHomeAfterLogout = sessionStorage.getItem(FORCE_HOME_AFTER_LOGOUT_KEY) === '1';

        if (redirectUrl) {
            redirectUrl = decodeURIComponent(redirectUrl);
        }

        // Wrap in setTimeout to allow state propagation and avoid ProtectedRoute bounce to sign-in
        setTimeout(async () => {
            // First check dynamic creative stage status
            try {
                const res = await ApiService.fetchDataWithAxios<any>({
                    url: 'get-creative-stage-status',
                    method: 'GET'
                });

                const dataObj = res?.data || res;

                if (dataObj && typeof dataObj === 'object') {
                    const requiredFields = ['stage', 'skill', 'domain'];

                    const hasZero = requiredFields.some(
                        key => dataObj[key] === 0 || dataObj[key] === '0'
                    );

                    if (hasZero) {
                        if (user?.id && Number(user.id) < 14540) {
                            // bypass for existing users...nanda sir 
                        } else {
                            localStorage.removeItem(REDIRECT_URL_KEY);
                            navigate('/getting-started/preferences');
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch creative stage status:", error);
            }

            // Robust UTM Source detection
            const getParam = (urlStr: string | null, key: string) => {
                if (!urlStr) return null;
                try {
                    // Try parsing as absolute or relative URL
                    const url = new URL(urlStr, window.location.origin);
                    return url.searchParams.get(key) || url.searchParams.get('utm_source');
                } catch {
                    // Fallback for malformed or simple strings
                    const search = urlStr.split('?')[1] || '';
                    return new URLSearchParams(search).get(key);
                }
            };

            const searchParams = new URLSearchParams(window.location.search);
            const currentUtm = searchParams.get('utm') || searchParams.get('utm_source');
            const sessionUtm = sessionStorage.getItem('utm_source');
            const redirectUtmValue = getParam(redirectUrl, 'utm') || getParam(redirectUrl, 'utm_source');

            const utmSource = (currentUtm || sessionUtm || redirectUtmValue || '').toLowerCase();

            const bypassSources = ['facebook', 'instagram', 'whatsapp', 'behance', 'behanced', 'fb', 'ig'];
            const isUtmCampaign = bypassSources.some(source => utmSource.includes(source));

            // Persist UTM source if found, so subsequent page guards (CollapsibleSide) know about it
            if (utmSource && isUtmCampaign) {
                sessionStorage.setItem('utm_source', utmSource);
            }

            const isNewUser = !user || Number(user.is_interest_save) !== 1;

            if (isUtmCampaign && isNewUser) {
                navigate(`/become-mentor?utm=${utmSource || 'campaign'}`);
                return;
            }

            // Normal Sign-in Flow: if interests not saved, must go to preferences
            // Standardizing check: Number(user.is_interest_save) !== 1
            if (!user || Number(user.is_interest_save) !== 1) {
                // Check URL param first, then sessionStorage fallback (set before async signup API call)
                const pendingRedirect = redirectUrl || sessionStorage.getItem('signup_pending_redirect');
                const safeUrl = getSafeRedirectUrl(pendingRedirect);

                if (safeUrl && isSafeInternalRedirect(safeUrl)) {
                    sessionStorage.removeItem('signup_pending_redirect');
                    localStorage.removeItem(REDIRECT_URL_KEY);
                    if (safeUrl.includes('community/forum?joy_category_id=')) {
                        sessionStorage.setItem('bypassed_preferences', 'true');
                    }
                    const finalUrl = safeUrl.startsWith('/') ? safeUrl : '/' + safeUrl;
                    // console.log("[auth.helper] Navigating to finalUrl:", finalUrl);
                    navigate(finalUrl);
                    return;
                }
                /// bypass the for existing user 

                if (user?.id && user.id < 14540) {
                    navigate(getHomePath(user));
                    return;
                }

                navigate('/getting-started/preferences');
                return;
            }

            // 1. Highest Priority: Blog details redirection (so shared links always land)
            if (
                redirectUrl &&
                isSafeInternalRedirect(redirectUrl) &&
                (redirectUrl.includes('/blogs/') || redirectUrl.includes('/connect/blogs/'))
            ) {
                localStorage.removeItem(REDIRECT_URL_KEY);

                // Translate public route to authenticated route
                let finalUrl = redirectUrl;
                if (finalUrl.includes('/blogs/') && !finalUrl.includes('/connect/blogs/')) {
                    finalUrl = finalUrl.replace('/blogs/', '/connect/blogs/');
                }

                navigate(finalUrl);
                return;
            }

            // If user just logged out before this sign-in, ignore stale redirect target.
            if (forceHomeAfterLogout) {
                localStorage.removeItem(REDIRECT_URL_KEY);
                sessionStorage.removeItem(FORCE_HOME_AFTER_LOGOUT_KEY);
                navigate(getHomePath(user));
                return;
            }

            // Blog details redirection priority
            if (
                redirectUrl &&
                isSafeInternalRedirect(redirectUrl) &&
                (redirectUrl.includes('/blogs/') || redirectUrl.includes('/connect/blogs/'))
            ) {
                localStorage.removeItem(REDIRECT_URL_KEY);

                // Translate public route to authenticated route
                let finalUrl = redirectUrl;
                if (finalUrl.includes('/blogs/') && !finalUrl.includes('/connect/blogs/')) {
                    finalUrl = finalUrl.replace('/blogs/', '/connect/blogs/');
                }

                navigate(finalUrl);
                return;
            }

            // Normal Onboarded User
            if (redirectUrl && isSafeInternalRedirect(redirectUrl)) {
                localStorage.removeItem(REDIRECT_URL_KEY);
                navigate(redirectUrl);
                return;
            }

            localStorage.removeItem(REDIRECT_URL_KEY);
            navigate(getHomePath(user));
        }, 0);
    };

    return { setAuth };
}
