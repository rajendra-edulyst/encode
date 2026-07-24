import Button from '@/components/ui/Button'
import appConfig from '@/configs/app.config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { errorToast } from '../../@lib/toastUtils'
import { AxiosError } from 'axios'
import { apiGoogleOauthSignUp } from '@/services/AuthService'
import { useGoogleLogin } from '@react-oauth/google'
import { useThemeStore } from '@/store/themeStore'
import { useState } from 'react'
import { OAuthSignUpData, User } from '@/@types/auth'
import { ADMIN, FACULTY, INDUSTRY, LEARNER, ACADEMMIC_DASHBOARD } from '@/constants/roles.constant'
import { useSessionUser, useToken } from '@/store/authStore'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { setProfileEditKey } from '@/views/common/profile-view/config'


async function fetchGoogleTokens(authCode: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code: authCode,
            client_id: appConfig.googleAuth.clientId,
            client_secret: appConfig.googleAuth.clientSecret,
            redirect_uri: appConfig.googleAuth.redirectUri,
            grant_type: 'authorization_code',
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch Google access token')
    }
    return response.json()
}

const OauthSignUp = () => {

    const signupProfile = useThemeStore((s) => s.loginProfile);
    const [response, setResponse] = useState<OAuthSignUpData | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // login
    const { setToken } = useToken();
    const setUser = useSessionUser((state) => state.setUser);
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn);
    const [invalidRole, setInvalidRole] = useState<boolean>(false);
    const getProfileTypeFromSignupProfile = (profile: string) =>
        profile === 'designer' ? 'creator' : 'organization';

    const googleTokenMutation = useMutation({
        mutationFn: fetchGoogleTokens,
    });

    const signUpTokenMutation = useMutation({
        mutationFn: apiGoogleOauthSignUp,
        onSuccess: (resp) => {
            if (resp) {
                setResponse(resp);
                if (resp?.token && resp?.user) {
                    const user = resp.user;

                    if (signupProfile === 'designer') {
                        if (!['Learner', 'Presenter', 'Designer'].includes(user?.role)) {
                            setInvalidRole(true);
                            return;
                        }
                        handleLogin({ user, token: resp.token });
                    }


                    if (signupProfile === 'institute') {
                        if (user?.role !== 'Admin' || user?.user_org_type !== 'university') {
                            setInvalidRole(true);
                            return;
                        }

                        handleLogin({ user, token: resp.token });
                    }

                    if (signupProfile === 'industry') {
                        if (user?.role !== 'Admin' || user?.user_org_type !== 'industry') {
                            setInvalidRole(true);
                            return;
                        }
                        handleLogin({ user, token: resp.token });
                    }
                }
                else {
                    sessionStorage.setItem('profileType', getProfileTypeFromSignupProfile(signupProfile));
                    sessionStorage.setItem('token', resp.email_token);
                    sessionStorage.setItem('accountEmail', resp?.signup_lead?.email || '');
                    sessionStorage.setItem('profile_image', resp?.profile_pic || '');
                    queryClient.invalidateQueries({ queryKey: ['signUpTokenData'] });
                    navigate('/personal-info' + window.location.search, { replace: true });
                }

            }
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            errorToast('Sign Up Failed', (error?.response?.data?.message || 'Something went wrong, please try again later'));
        },
    })

    const handleSignIn = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid profile email',
        onSuccess: async (codeResponse) => {
            try {
                const tokenData = await googleTokenMutation.mutateAsync(codeResponse.code)
                const loginToken = tokenData.id_token
                await signUpTokenMutation.mutateAsync({
                    token: loginToken,
                    type: signupProfile.toLowerCase(),
                })
            } catch (err: unknown) {
                const error = err as AxiosError<{ message?: string }>;
                errorToast(error?.response?.data?.message || 'Login failed')
            }
        },
        onError: (err: unknown) => {
            console.error('Login Failed:', err)
        },
    })


    const handleLogin = (loginResponse: { user: User; token: string; } | null) => {

        const user = loginResponse?.user;
        const token = loginResponse?.token;

        if (user && token) {
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

            if (user?.user_org_type === 'industry') {
                if (user?.role?.toLowerCase() === 'admin') {
                    user.authority = [INDUSTRY];
                }
            }

            setToken(token)
            setSessionSignedIn(true)
            setUser(user)
            setProfileEditKey(user?.profile_svc_editkey ?? '');

            const search = window.location.search
            const params = new URLSearchParams(search)
            const redirectUrl = params.get(REDIRECT_URL_KEY);
            if (redirectUrl) {
                navigate(redirectUrl);
            } else {
                navigate(appConfig.authenticatedEntryPath);
            }
        }
        else {
            errorToast('Login Failed', 'Invalid user data received from the server.')
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 w-full">
            <Button
                className="flex-1 rounded-md w-full hover:text-cpink hover:border-[#d63384] hover:ring-[#d63384]"
                type="button"
                loading={googleTokenMutation.isPending || signUpTokenMutation.isPending}
                onClick={() => {
                    handleSignIn()
                }}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px] mx-4"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span className='text-sm font-semibold'>Sign Up with Google</span>
                </div>
            </Button>
            <AlertDialog open={invalidRole} onOpenChange={setInvalidRole}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hi, {response?.user?.name}</AlertDialogTitle>
                        <AlertDialogDescription>It looks like {`you’re`} signed in with a <span className='font-bold text-[#d63384]'>{signupProfile}</span> account, but this role {`isn’t`} currently enabled for you. Would you like to continue using your current role instead?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-[#d63384] hover:bg-[#b02a5b] text-white' onClick={() => handleLogin(response)}>Yes, Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default OauthSignUp;
