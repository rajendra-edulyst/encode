import { type ButtonHTMLAttributes, useState } from "react"
import Button from "@/components/ui/Button"
import appConfig from '@/configs/app.config'
import { apiAppleOauthSignIn } from "@/services/OAuthServices"
import { errorToast } from "../../@lib/toastUtils"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { OAuthSignUpData, User } from "@/@types/auth"
import { useThemeStore } from "@/store/themeStore"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { setProfileEditKey } from '@/views/common/profile-view/config'
import { useSetAuth } from "@/auth/auth.helper"
import AppleOauthIcon from '@/assets/icons/apple_auth.png'
import AppleSignin from "react-apple-signin-auth"

type AppleSignInProps = {
  compact?: boolean
}

const AppleSignIn = ({ compact = false }: AppleSignInProps) => {

  const signupProfile = useThemeStore((s) => s.loginProfile);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [response, setResponse] = useState<OAuthSignUpData | null>(null);
  // login
  const [invalidRole, setInvalidRole] = useState<boolean>(false);
  const { setAuth } = useSetAuth();
  const getProfileTypeFromSignupProfile = (profile: string) =>
    profile === 'designer' ? 'creator' : 'organization';

  const appleLoginMutation = useMutation({
    mutationFn: apiAppleOauthSignIn,
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
      errorToast('Sign In Failed', (error?.response?.data?.message || 'Something went wrong, please try again later'));
    },
  })


  const handleAppleSuccess = (appleResponse: { authorization?: { id_token?: string } }) => {
    const idToken = appleResponse?.authorization?.id_token
    if (!idToken) {
      errorToast('Sign In Failed', 'No Apple token received')
      return
    }
    appleLoginMutation.mutate({ token: idToken, type: "apple" })
  }

  const handleLogin = (loginResponse: { user: User; token: string; } | null) => {
    const user = loginResponse?.user;
    const token = loginResponse?.token;
    if(!user || !token) return;
    setAuth({ user, token });
  }

  if (compact) {
    return (
      <AppleSignin
        uiType="dark"
        authOptions={{
          clientId: appConfig.appleAuth.clientId,
          scope: 'email name',
          redirectURI: appConfig.appleAuth.redirectUri,
          usePopup: true,
        }}
        render={(props: ButtonHTMLAttributes<HTMLButtonElement>) => (
          <button
            {...props}
            type="button"
            className="h-10 w-10 bg-transparent border-0 p-0 shadow-none outline-none hover:bg-transparent flex items-center justify-center"
            disabled={appleLoginMutation.isPending}
            aria-label="Apple sign in"
          >
            <img className="h-8 w-8" src={AppleOauthIcon} alt="Apple sign in" />
          </button>
        )}
        onSuccess={handleAppleSuccess}
        onError={() => errorToast('Sign In Failed', 'Something went wrong, please try again later')}
      />
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <AppleSignin
        uiType="dark"
        authOptions={{
          clientId: appConfig.appleAuth.clientId,
          scope: 'email name',
          redirectURI: appConfig.appleAuth.redirectUri,
          usePopup: true,
        }}
        render={(props: ButtonHTMLAttributes<HTMLButtonElement>) => (
          <Button
            {...props}
            className="flex-1 rounded-md w-full hover:text-cpink hover:border-[#d63384] hover:ring-[#d63384]"
            type="button"
            loading={appleLoginMutation.isPending}
            disabled={appleLoginMutation.isPending}
          >
            <div className="flex items-center justify-center gap-2">
              <img className="h-[20px] w-[20px] mx-2" src={AppleOauthIcon} alt="Apple sign in" />
              <span className="text-sm font-semibold">Sign In with Apple</span>
            </div>
          </Button>
        )}
        onSuccess={handleAppleSuccess}
        onError={() => errorToast('Sign In Failed', 'Something went wrong, please try again later')}
      />
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

export default AppleSignIn