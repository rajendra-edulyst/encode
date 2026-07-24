import ApiService from '@/services/ApiService';
import { SendOtpMailApiResponse, SendOtpMobileApiResponse, SignInResponse, SignUpOtpSendApiResponse, SignUpResendOtpApiResponse, SignUpTokenApiResponse } from '@/@types/auth';

// sendOtp(email)
export async function sendOtp(email: string): Promise<SendOtpMailApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SendOtpMailApiResponse>({
            url: '/send_hscode',
            method: 'post',
            data: {
                email: email,
                is_signup: true,
                forgot_pass: 0,
                locale: 'en',
            },
        });
        return response
    } catch (error) {
        throw error as string;
    }
}

// sendOtp (forgot_pass=1)
export async function sendForgotOtp(email: string): Promise<SendOtpMailApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SendOtpMailApiResponse>({
            url: '/send_hscode',
            method: 'post',
            data: {
                email: email,
                forgot_pass: 1,
            },
        });
        return response
    } catch (error) {
        throw error as string;
    }
}



// verifyOtp(email, otp)
export async function verifyOtp({ email, otp }: { email: string, otp: string }): Promise<SendOtpMailApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SendOtpMailApiResponse>({
            url: '/verify_hscode',
            method: 'post',
            data: {
                principal_email: email,
                hscode: otp,
                skip_login: 1,
            },
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function sendOtpMobileLogin(data: { mobile_no: string }): Promise<SendOtpMobileApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SendOtpMobileApiResponse>({
            url: '/joy/signin',
            method: 'post',
            data: data,
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


export async function verifyOtpMobileLogin(payload: { mobile_no: string; otp_key: string }): Promise<SignInResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SignInResponse>({
            url: '/joy/validate-opt',
            method: 'post',
            data: payload,
        });

        return response
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifynewpasswordOtp(token: string): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios({
            url: '/verify-token',
            method: 'post',
            data: {
                token: token
            },
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ResetPassword(token: string, password: string, confirm_password: string): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios({
            url: '/reset-password',
            method: 'post',
            data: {
                token: token,
                password: password,
                confirm_password: confirm_password
            },
        });
        return response
    } catch (error) {
        throw error as string;
    }
}



// new signup new code

export async function sendOtpSignup(email: string): Promise<SignUpOtpSendApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SignUpOtpSendApiResponse>({
            url: '/send-reg-otp',
            method: 'post',
            data: {
                email: email,
                is_signup: 1,
                forgot_pass: 0,
                locale: 'en',
            },
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchSignUpTokenData(token: string): Promise<SignUpTokenApiResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<SignUpTokenApiResponse>({
            url: `/signup-lead-data/${token}`,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}

export async function signupOtpResend(email: string): Promise<{ token: string }> {
    try {
        const response = await ApiService.fetchDataWithAxios<SignUpResendOtpApiResponse>({
            url: '/send-reg-otp',
            method: 'post',
            data: {
                email: email,
                is_signup: true,
                forgot_pass: 0,
                locale: 'en',
            },
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}