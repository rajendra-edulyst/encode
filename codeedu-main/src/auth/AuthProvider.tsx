import { useRef, useImperativeHandle, useEffect, forwardRef } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import { FORCE_HOME_AFTER_LOGOUT_KEY, REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import { ADMIN, FACULTY, INDUSTRY, LEARNER, ACADEMMIC_DASHBOARD } from '@/constants/roles.constant'
import { verifyOtpMobileLogin } from '@/services/auth/AccountService'
import { setProfileEditKey } from '@/views/common/profile-view/config'
// 🚀 ~ Google Analytics: Import Google Analytics service
import { googleAnalytics } from '@/services/google-analytics/GoogleAnalyticsService'
import { requestFCMToken } from '@/services/NotificationService'
import { useQueryClient } from '@tanstack/react-query'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef, {}>((_, ref) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])

    return <></>
})

IsolatedNavigator.displayName = 'IsolatedNavigator'

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const resetAuthState = useSessionUser((state) => state.resetAuthState)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()
    const queryClient = useQueryClient()

    const authenticated = Boolean(token && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirect = (newUser?: User) => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)
        const forceHomeAfterLogout = sessionStorage.getItem(FORCE_HOME_AFTER_LOGOUT_KEY) === '1'

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
        }

        const getHomePath = (u?: User) => {
            const role = (u?.role || '').toLowerCase()
            const org = (u?.user_org_type || '').toLowerCase()
            const isIndustryOrInstituteAdmin =
                role === 'admin' && (org === 'industry' || org === 'institute')
            return isIndustryOrInstituteAdmin ? '/collaborate' : '/create'
        }

        // Avoid stale state by using passed user or store's current state
        const targetUser = newUser || useSessionUser.getState().user;

        // Robust UTM Source detection
        const getParam = (urlStr: string | null, key: string) => {
            if (!urlStr) return null;
            try {
                const url = new URL(urlStr, window.location.origin);
                return url.searchParams.get(key) || url.searchParams.get('utm_source');
            } catch {
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

        // Persist UTM so guards know about it
        if (utmSource && isUtmCampaign) {
            sessionStorage.setItem('utm_source', utmSource);
        }

        const isNewUser = !targetUser || Number(targetUser.is_interest_save) !== 1;

        // Micro-delay to ensure AuthProvider's context updates before ProtectedRoutes evaluate
        setTimeout(() => {
            if (isUtmCampaign && isNewUser) {
                navigatorRef.current?.navigate(`/become-mentor?utm=${utmSource || 'campaign'}`);
                return;
            }

            // Standard Flow: if not preferences save then go to preferences getting started page
            // Checking targetUser.is_interest_save !== 1 for safety
            if (!targetUser || Number(targetUser.is_interest_save) !== 1) {
                // Check URL param first, then sessionStorage fallback (set by personal-info form before async call)
                const pendingRedirect = redirectUrl || sessionStorage.getItem('signup_pending_redirect');
                const safeUrl = getSafeRedirectUrl(pendingRedirect);
                console.log("[AuthProvider] New User Redirect Check:", { pendingRedirect, safeUrl, isSafe: isSafeInternalRedirect(safeUrl) });

                if (safeUrl && isSafeInternalRedirect(safeUrl)) {
                    sessionStorage.removeItem('signup_pending_redirect');
                    localStorage.removeItem(REDIRECT_URL_KEY);
                    if (safeUrl.includes('community/forum?joy_category_id=')) {
                        sessionStorage.setItem('bypassed_preferences', 'true');
                    }
                    const finalUrl = safeUrl.startsWith('/') ? safeUrl : '/' + safeUrl;
                    console.log("[AuthProvider] Navigating to finalUrl:", finalUrl);
                    navigatorRef.current?.navigate(finalUrl);
                    return;
                }

                navigatorRef.current?.navigate('/getting-started/preferences');
                return;
            }

            if (forceHomeAfterLogout) {
                localStorage.removeItem(REDIRECT_URL_KEY)
                sessionStorage.removeItem(FORCE_HOME_AFTER_LOGOUT_KEY)
                navigatorRef.current?.navigate(getHomePath(targetUser))
                return
            }

            if (redirectUrl && isSafeInternalRedirect(redirectUrl)) {
                const dummyBase = window.location.origin
                const url = new URL(redirectUrl, dummyBase)

                params.delete(REDIRECT_URL_KEY)
                params.forEach((value, key) => {
                    url.searchParams.set(key, value)
                })

                // If redir is just root or common landing, go to default app entry
                if (url.pathname === '/' || url.pathname === '') {
                    navigatorRef.current?.navigate(getHomePath(targetUser));
                } else {
                    navigatorRef.current?.navigate(url.pathname + url.search)
                }
            } else {
                navigatorRef.current?.navigate(getHomePath(targetUser))
            }
        }, 0);
    }

    useEffect(() => {
        // Global UTM capture: Save to sessionStorage if present in URL
        const params = new URLSearchParams(window.location.search);
        const utm = params.get('utm') || params.get('utm_source');
        if (utm) {
            sessionStorage.setItem('utm_source', utm);
        }
    }, []);

    // 🚀 ~ Google Analytics: Initialize analytics when user is already logged in
    useEffect(() => {
        const timer = setTimeout(() => {
            const storeUser = useSessionUser.getState().user;
            const signedIn = useSessionUser.getState().session.signedIn;

            if (signedIn && storeUser?.id) {
                googleAnalytics.setUser(storeUser);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    const handleSignIn = (tokens: Token, user?: User) => {
        if (user) {
            if (!user?.profile_image) {
                user.profile_image = 'https://ui-avatars.com/api/?name=' + user?.name
            }

            if (user?.role?.toLowerCase() === 'learner') {
                user.authority = [LEARNER]
            }

            if (user?.role?.toLowerCase() === 'presenter') {
                user.authority = [FACULTY];
                if (user?.user_roles?.includes('AcademicHead')) {
                    user.authority.push(ACADEMMIC_DASHBOARD);
                }
            }

            if (user?.role?.toLowerCase() === 'admin') {
                user.authority = [ADMIN];
            }

            if (user?.user_org_type === 'industry' || user?.user_org_type === 'institute') {
                if (user?.role?.toLowerCase() === 'admin') {
                    user.authority = [INDUSTRY];
                }
            }
            setProfileEditKey(user?.profile_svc_editkey ?? '')
            if (user?.mec_regd_id) {
                localStorage.setItem('mec_regd_id', user.mec_regd_id)
            } else {
                localStorage.removeItem('mec_regd_id')
            }
            setToken(tokens.accessToken)
            setSessionSignedIn(true)
            setUser(user)

            // 🚀 ~ Google Analytics: Set user when they log in
            googleAnalytics.setUser(user)
        }
    }

    const clearUserScopedStorage = () => {
        const keys = [
            'sessionUser',
            'themeStore',
            'dashboard-state',
            'recent-placements-state',
            'top-hiring-locations-state',
            'recent-job-matches-state',
            'industry-domain-state',
            'functional-domain-state',
            'job-role-state',
            'matched-resumes-state',
            'jobStore',
            'machingJobStore',
            'matchingJobStore',
            'jobDetailsStore',
            'jobActivitiesStore',
            'resumeStore',
            REDIRECT_URL_KEY,
            'utm_source',
            'mec_regd_id',
        ]

        keys.forEach((key) => localStorage.removeItem(key))
        sessionStorage.removeItem('utm_source');
    }

    const handleSignOut = () => {
        setToken('')
        resetAuthState()
        clearUserScopedStorage()
        sessionStorage.setItem(FORCE_HOME_AFTER_LOGOUT_KEY, '1')
        sessionStorage.removeItem('bypassed_preferences')
        queryClient.clear()

        // 🚀 ~ Google Analytics: Clear user when they log out
        googleAnalytics.clearUser()
        mixpanelService.track('User Logged Out')
    }

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const resp = await apiSignIn(values)
            if (resp) {

                if (resp?.status == 0) {
                    return {
                        status: 0,
                        message: 'Invalid credentials',
                        error: resp.error,
                    }
                }

                if (!(resp?.data?.token && resp?.data?.user)) {
                    return {
                        status: 0,
                        message: 'Invalid credentials',
                        error: resp.error,
                    }
                }

                // handleSignIn({ accessToken: resp?.data?.token }, resp?.data?.user)
                // redirect()
                return {
                    status: 1,
                    message: '',
                    response: {
                        user: resp.data.user,
                        token: resp.data.token,
                    },
                    error: ''
                }
            }
            return {
                status: 0,
                message: 'Unable to sign in',
                error: ''
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 0,
                message: errors?.response?.data?.message || errors.toString(),
                error: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential, skipRedirect?: boolean): AuthResult => {
        try {
            const resp = await apiSignUp(values)
            if (resp) {

                if (resp?.status == 0) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }

                if (!(resp?.data?.token && resp?.data?.user)) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }


                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                if (!skipRedirect) {
                    redirect(resp.data.user)
                }
                return {
                    status: 1,
                    message: '',
                    error: ''
                }
            }
            return {
                status: 0,
                message: 'Unable to sign up',
                error: ''
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 0,
                message: errors?.response?.data?.message || errors.toString(),
                error: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath)
        }
    }
    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    const loginViaPhone = async (phone: string, otp: string): AuthResult => {
        try {
            const payload = {
                mobile_no: phone,
                otp_key: otp,
            }
            const resp = await verifyOtpMobileLogin(payload);
            if (resp) {
                if (resp?.status == 0) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }
                if (!(resp?.data?.token && resp?.data?.user)) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect(resp.data.user)
                return {
                    status: 1,
                    message: '',
                    error: ''
                }
            }
            return {
                status: 0,
                message: 'Unable to sign in',
                error: ''
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 0,
                message: errors?.response?.data?.message || errors.toString(),
                error: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    useEffect(() => {
        if (authenticated) requestFCMToken();
    }, [authenticated]);

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
                loginViaPhone
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
