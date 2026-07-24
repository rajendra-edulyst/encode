import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import { GoogleOAuthProvider } from '@react-oauth/google'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={250}
                />
            </div>
            <div className="mb-3">
                <p className="mb-2 text-1xl text-black">Welcome back!</p>
                <h1 className="font-bold heading-text text-[#0cacec]">Login</h1>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div>
                        <style>
                            {`.force-relative { position: relative !important; z-index: 50 !important; }`}
                        </style>
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 force-relative"
                            themeColor={false}
                        >
                            Forgot password?
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-8">
                <div className="gap-2 mb-4 text-center">or continue with</div>
                <GoogleOAuthProvider clientId="909003757464-qrb4u24iacv0taqdn1v4ov153obfhltn.apps.googleusercontent.com" >
                    <OauthSignIn
                        disableSubmit={disableSubmit}
                        setMessage={setMessage}
                    />
                    
                </GoogleOAuthProvider>
            </div>
            <div>
                <div className="mt-6 text-center">
                    <span>{`Don't have an account yet?`} </span>
                    <ActionLink
                        to={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Sign up
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
