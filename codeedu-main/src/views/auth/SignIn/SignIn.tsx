import { GoogleOAuthProvider } from '@react-oauth/google'
import SignInForm from './components/SignInForm'
import appConfig from '@/configs/app.config'
import { X } from 'lucide-react';
import { useState } from 'react';
// import OauthSignIn from './components/OauthSignIn'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import AppleSignIn from './components/AppleSignIn'

export const SignInBase = () => {

    const [loginWith, setLoginWith] = useState<'password' | 'otp'>('password');

    return (
        <>
            {loginWith == 'otp' && <X id="jshdfhasbfhjbashfb" className='absolute top-5 right-5 text-white cursor-pointer' onClick={() => setLoginWith('password')} />}
            <div className="mb-4 xl:mb-6">
                <p className="text-2xl md:text-3xl lg:text-[32px] 2xl:text-[40px] font-bold md:leading-[36px] lg:leading-[40px] 2xl:leading-[50px] text-white">
                    Start Crafting Your Creative{" "}
                    <span
                        className="text-[#00A8E9] font-creative"
                    >
                        Future
                    </span>
                    <span
                        className="text-white text-3xl md:text-4xl lg:text-[40px] 2xl:text-[48px]"
                        style={{
                            fontWeight: 400,
                            fontStyle: "normal",
                        }}
                    >
                        .
                    </span>
                </p>
            </div>
            <div className='relative'>
                <GoogleOAuthProvider clientId={appConfig.googleAuth.clientId}>
                    <SignInForm loginWith={loginWith} setLoginWith={setLoginWith} />
                </GoogleOAuthProvider>
            </div>
            {/* or with horizontal line */}
            {/* <div className="my-6 flex items-center justify-center">
                <hr className="w-full border-gray-300" />
                <span className="mx-4 text-gray-500">or</span>
                <hr className="w-full border-gray-300" />
            </div>
            <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
                <GoogleOAuthProvider clientId="909003757464-qrb4u24iacv0taqdn1v4ov153obfhltn.apps.googleusercontent.com" >
                    <OauthSignIn />
                </GoogleOAuthProvider>
                <AppleSignIn />
            </div> */}
            {/* </div> */}
        </>
    )
}

const SignIn = () => {

    return <SignInBase />
}

export default SignIn
