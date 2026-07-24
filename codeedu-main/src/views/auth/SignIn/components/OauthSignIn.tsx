import Button from '@/components/ui/Button'
import appConfig from '@/configs/app.config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { errorToast } from '../../@lib/toastUtils'
import { AxiosError } from 'axios'
import { apiGoogleOauthSignUp } from '@/services/AuthService'
import { useGoogleLogin } from '@react-oauth/google'
import { useThemeStore } from '@/store/themeStore'
import { useState } from 'react'
import { OAuthSignUpData } from '@/@types/auth'
import { useNavigate } from 'react-router-dom'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { setProfileEditKey } from '@/views/common/profile-view/config'
import { useSetAuth } from '@/auth/auth.helper'
import GoogleOauthIcon from '@/assets/icons/oauth_google.png'

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

type OauthSignInProps = {
    compact?: boolean
}

const OauthSignIn = ({ compact = false }: OauthSignInProps) => {
    const signupProfile = useThemeStore((s) => s.loginProfile);
    const [response, setResponse] = useState<OAuthSignUpData | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // login
    const [invalidRole, setInvalidRole] = useState<boolean>(false);
    const { setAuth } = useSetAuth();
    const getProfileTypeFromSignupProfile = (profile: string) =>
        profile === 'designer' ? 'creator' : 'organization';

    const googleTokenMutation = useMutation({
        mutationFn: fetchGoogleTokens,
    });
    // changes made for the profile service 
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
                        setAuth({ user, token: resp.token });
                    }

                    if (signupProfile === 'institute') {
                        if (user?.role !== 'Admin' || user?.user_org_type !== 'university') {
                            setInvalidRole(true);
                            return;
                        }

                        setAuth({ user, token: resp.token });
                    }

                    if (signupProfile === 'industry') {
                        if (user?.role !== 'Admin' || user?.user_org_type !== 'industry') {
                            setInvalidRole(true);
                            return;
                        }

                        setAuth({ user, token: resp.token });
                    }
                }
                else {
                    sessionStorage.setItem('profileType', getProfileTypeFromSignupProfile(signupProfile));
                    sessionStorage.setItem('token', resp.email_token);
                    setProfileEditKey(resp?.user?.profile_svc_editkey ?? '')
                    sessionStorage.setItem('accountEmail', resp?.signup_lead?.email || '');
                    sessionStorage.setItem('profile_image', resp?.profile_pic || '');
                    queryClient.invalidateQueries({ queryKey: ['signUpTokenData'] });
                    navigate('/personal-info', { replace: true });
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
                // errorToast(error?.response?.data?.message || 'Login failed')
                console.log('Sign Up Error:', error);
            }
        },
        onError: (err: unknown) => {
            console.error('Login Failed:', err)
        },
    })

    if (compact) {
        return (
            <button
                type="button"
                className="h-8 w-8 bg-transparent border-0 p-0 shadow-none outline-none hover:bg-transparent"
                disabled={googleTokenMutation.isPending || signUpTokenMutation.isPending}
                onClick={() => handleSignIn()}
                aria-label="Google sign in"
            >
                <img
                    className="h-8 w-8"
                    src={GoogleOauthIcon}
                    alt="Google sign in"
                />
            </button>
        )
    }

    return (
        <div className="flex items-center justify-center gap-2 w-full">
            <Button
                className="flex-1 rounded-md w-full hover:text-cpink hover:border-[#d63384] hover:ring-[#d63384]"
                type="button"
                loading={googleTokenMutation.isPending || signUpTokenMutation.isPending}
                disabled={googleTokenMutation.isPending || signUpTokenMutation.isPending}
                onClick={() => {
                    handleSignIn()
                }}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px] mx-4"
                        src={GoogleOauthIcon}
                        alt="Google sign in"
                    />
                    <span className='text-sm font-semibold'>Sign In with Google</span>
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
                        {response?.user && <AlertDialogAction className='bg-[#d63384] hover:bg-[#b02a5b] text-white' onClick={() => setAuth({ user: response?.user, token: response?.token })}>Yes, Continue</AlertDialogAction>}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default OauthSignIn;