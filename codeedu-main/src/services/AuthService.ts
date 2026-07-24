import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    SignUpRequestApiReponse,
    OAuthSignUpData,
    OAuthSignUpApiResponse,
} from '@/@types/auth'
import { UpdateAcceptanceResponse } from '@/@types/learner/eula'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: endpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiGoogleOauthSignIn(data: any) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.googleOauthSignIn,
        method: 'post',
        data,
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiGoogleOauthSignUp(data: any): Promise<OAuthSignUpData> {
    const response = await ApiService.fetchDataWithAxios<OAuthSignUpApiResponse>({
        url: `google-signup-details`,
        method: 'post',
        data,
    })
    return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiAppleOauthSignIn(data: any) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.appleOauthSignIn,
        method: 'post',
        data,
    })
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signUpRequest(data: any): Promise<SignUpRequestApiReponse> {
    const response = await ApiService.fetchDataWithAxios<SignUpRequestApiReponse>({
        url: '/code-sign-up',
        method: 'post',
        data,
    })
    return response;
}

export async function emailLoginWithCode(data: { email: string }): Promise<{
    status: number,
    message: string
}> {
    const response = await ApiService.fetchDataWithAxios<{
        status: number,
        message: string
    }>({
        url: '/email-signup',
        method: 'post',
        data,
    })
    return response;
}

export async function verifyEmailLoginCode(data: { email: string, otp: string }): Promise<SignInResponse> {
    const response = await ApiService.fetchDataWithAxios<SignInResponse>({
        url: '/verify-email-signin',
        method: 'post',
        data,
    })
    return response;
}


export async function updateEulaAcceptance(formData: FormData): Promise<UpdateAcceptanceResponse> {
    const response = await ApiService.fetchDataWithAxios<UpdateAcceptanceResponse>({
        url: '/v1/update-acceptance',
        method: 'post',
        data: formData as unknown as Record<string, unknown>,
    })
    return response;
}


interface SaveDeviceTokenResponse {
    status: number;
    data: { id: number; message: string }[];
    error: string[];
}

export async function saveDeviceToken(
    token: string,
    deviceType: string,
    deviceId: string,


): Promise<SaveDeviceTokenResponse> {
    const response = await ApiService.fetchDataWithAxios<SaveDeviceTokenResponse>({
        url: '/saveDeviceToken',
        method: 'post',
        data: {
            device_id: deviceId,
            device_type: deviceType,
            device_token: token,
        },
        headers: {
            'Content-Type': 'application/json',
        },

    });
    return response;
}





// org sso login
export async function orgSsoLogin(data: { token: string }): Promise<OAuthSignUpData> {
    const response = await ApiService.fetchDataWithAxios<OAuthSignUpApiResponse>({
        url: '/v1/external-login',
        method: 'post',
        data,
    })
    return response.data;
}

export type SignupOtpApiResponse = {
    status: number
    message: string
    error?: string | string[]
    data?: {
        verification_type?: 'mobile' | 'email'
        token?: string
        [key: string]: unknown
    }
}

export async function sendMobileOtp(data: {
    mobile_number: string
    digits: 4
    /** Sign-up / registration flows (not sign-in). */
    is_signup?: 1
}): Promise<SignupOtpApiResponse> {
    const response = await ApiService.fetchDataWithAxios<SignupOtpApiResponse>({
        url: '/v1/send-mobile-otp',
        method: 'post',
        data,
    })
    return response;
}

/** Mobile OTP during sign-in (establishes session when valid). */
export async function verifyMobileOtp(data: { mobile_number: string; otp: string }): Promise<SignInResponse> {
    const response = await ApiService.fetchDataWithAxios<SignInResponse>({
        url: '/v1/validate-mobile-otp',
        method: 'post',
        data: {
            mobile_number: data.mobile_number,
            otp: data.otp,
        },
    })
    return response;
}

/** Mobile OTP during sign-up / profile lead: backend expects `skip_login: 1`. */
export async function verifyMobileOtpSignup(data: {
    mobile_number: string
    otp: string
}): Promise<SignInResponse & SignupOtpApiResponse> {
    const response = await ApiService.fetchDataWithAxios<SignInResponse & SignupOtpApiResponse>({
        url: '/v1/validate-mobile-otp',
        method: 'post',
        data: {
            mobile_number: data.mobile_number,
            otp: data.otp,
            skip_login: 1,
        },
    })
    return response;
}