
import { useState } from 'react'
import './SignInForm.css'
import { requestFCMToken } from '@/services/NotificationService'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { apiSignIn, emailLoginWithCode, sendMobileOtp, verifyEmailLoginCode, verifyMobileOtp } from '@/services/AuthService'
import { Loader, UserRound, LogIn } from 'lucide-react'
import { User } from '@/@types/auth'
import { AxiosError } from 'axios'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { OTP_CONFIG, useOtpTimer } from '../../@hooks/useOtp'
import { useSetAuth } from '@/auth/auth.helper'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import OauthSignIn from './OauthSignIn'
import AppleSignIn from './AppleSignIn'

type SignInFormSchema = {
    email: string
    password: string
}

type SignInWithOtpForm = {
    emailOrPhone: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z.string({ required_error: 'Please enter your email' }).min(1, { message: 'Please enter your email' }),
    password: z.string({ required_error: 'Please enter your password or OTP' }).min(1, { message: 'Please enter your password or OTP' }),
})

const validationWithOtp: ZodType<SignInWithOtpForm> = z.object({
    emailOrPhone: z.string({ required_error: 'Please enter your email or phone number' }).min(1, { message: 'Please enter your email or phone number' }),
})


interface SignInFormProps {
    setLoginWith: (value: 'password' | 'otp') => void
    loginWith: 'password' | 'otp',
}

const SignInForm = ({ setLoginWith, loginWith }: SignInFormProps) => {


    // const [invalidRole, setInvalidRole] = useState<boolean>(false);
    // const [response, setResponse] = useState<{ token: string, user: User } | null>(null);
    const signupProfile = useThemeStore((state) => state.loginProfile);
    const { setAuth } = useSetAuth();
    const [emailOrPhone, setEmailOrPhone] = useState<string>("");


    const handleLogin = (loginResponse: { user: User; token: string; } | null) => {

        // setResponse(loginResponse);
        const user = loginResponse?.user;
        const token = loginResponse?.token;
        const isEula = loginResponse?.user;

        if (user && token) {
            if (signupProfile === 'designer') {
                // if (!['Learner', 'Presenter', 'Designer'].includes(user.role)) {
                //     setInvalidRole(true);
                //     return;
                // }
                setAuth(loginResponse);
                requestFCMToken();
            }

            if (signupProfile === 'institute') {
                // if (response?.user?.role !== 'Admin' || response?.user?.user_org_type !== 'university') {
                //     setInvalidRole(true);
                //     return;
                // }

                setAuth(loginResponse);
            }

            if (signupProfile === 'industry') {
                // if (response?.user?.role !== 'Admin' || response?.user?.user_org_type !== 'industry') {
                //     setInvalidRole(true);
                //     return;
                // }
                setAuth(loginResponse);
            }

            requestFCMToken();

            const rememberMe = localStorage.getItem('rememberMe') === 'true';

            if (rememberMe && token) {
                localStorage.setItem('rememberMe', 'true')
                localStorage.setItem('rememberToken', token)
                localStorage.setItem('eula_accepted', String(isEula?.eula_accepted ?? ''));
                localStorage.setItem('terms_condition_accepted', String(isEula?.terms_condition_accepted ?? ''));
                localStorage.setItem('privacy_policy_accepted', String(isEula?.privacy_policy_accepted ?? ''));


            } else {
                localStorage.removeItem('rememberMe')
                localStorage.removeItem('rememberToken')
            }
        }
    }



    return (
        <div className={`mt-4 xl:mt-8`}>
            {loginWith === "password" && <LoginWithEmailPassword
                loginWith={loginWith}
                setLoginWith={setLoginWith}
                handleLogin={handleLogin}
                emailOrPhone={emailOrPhone}
                setEmailOrPhone={setEmailOrPhone}
            />}
            {loginWith === 'otp' && <LoginWithEmailPhoneOtp
                loginWith={loginWith}
                setLoginWith={setLoginWith}
                handleLogin={handleLogin}
                emailOrPhone={emailOrPhone}
                setEmailOrPhone={setEmailOrPhone}
            />}

            {/* Sign Up and Log In Buttons - Updated to match AuthCtaRow styles */}
            {/* <InValidRoleDialog open={invalidRole} response={response} setAuth={setAuth} onOpenChange={setInvalidRole} /> */}
        </div>
    )
}

export default SignInForm


interface LoginWithEmailPasswordProps {
    loginWith: 'password' | 'otp',
    setLoginWith?: (value: 'password' | 'otp') => void
    handleLogin?: (loginResponse: { user: User; token: string; } | null) => void
    emailOrPhone: string,
    setEmailOrPhone: (value: string) => void
}

const LoginWithEmailPassword = ({ setLoginWith, handleLogin, emailOrPhone, setEmailOrPhone }: LoginWithEmailPasswordProps) => {

    const [message, setMessage] = useState<{
        type: 'error' | 'success', text: string
    } | null>(null);

    const { handleSubmit, formState: { errors }, control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: emailOrPhone || localStorage.getItem('email') || '',
            password: localStorage.getItem('password') || '',
        },
        resolver: zodResolver(validationSchema),
    });

    const loginMutation = useMutation({
        mutationFn: apiSignIn,
        onSuccess: (data) => {
            if (data?.status === 1) {
                const response = {
                    token: data.data.token,
                    user: data.data.user
                }
                if (response) {
                    handleLogin?.(response);
                    // successToast("Signed In", "You have successfully signed in.");
                }
            }
            else {
                // errorToast("Sign In Failed", data?.error || "Something went wrong, please try again later.");
                setMessage({ type: 'error', text: data?.error || "Something went wrong, please try again later." });
            }
        },
        onError: (err: unknown) => {
            console.log('Login successful', err);
            const error = err as AxiosError<{ error?: string }>;
            // errorToast("Sign Up Failed", error.response?.data?.message || "Something went wrong, please try again later.");
            setMessage({ type: 'error', text: error.response?.data?.error || "Something went wrong, please try again later." });
        },
    })

    const signInWithEmailPassword = (data: SignInFormSchema) => {
        if (localStorage.getItem('rememberMe') === 'true') {
            localStorage.setItem('email', data.email);
            localStorage.setItem('password', data.password);
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
        }

        const payload = {
            email: data.email,
            password: data.password,
            org_check_required: 0
        }
        loginMutation.mutate(payload);
    }

    return (
        <Form className='relative' onSubmit={handleSubmit(signInWithEmailPassword)}>
            <FormItem
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
                className={errors.email ? 'mb-5 xl:mb-6' : 'mb-1 xl:mb-2'}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type={`email`}
                            placeholder={'Enter your email'}
                            autoComplete="off"
                            value={field.value}
                            onChange={(e) => {
                                setEmailOrPhone(e.target.value);
                                field.onChange(e.target.value);
                            }}
                        />
                    )}
                />
            </FormItem>
            <RadioGroup
                className="flex gap-6 mb-2 mt-2 xl:mb-3 xl:mt-3"
                name="loginVia"
                value={'password'}
                onValueChange={(value) => {
                    setLoginWith?.(value as 'password' | 'otp')
                }}
            >
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="password" id="password" className={'border-[1.5px] rounded-full w-4 h-4 border-[#00A8E9] text-[#00A8E9]'} />
                    <Label htmlFor="password" className="text-[#00A8E9] font-medium">Password</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="otp" id="otp" className={classNames('border-[1.5px] rounded-full w-4 h-4 border-[#515B60] text-[#515B60]')} />
                    <Label htmlFor="otp" className="text-[#00A8E9] font-medium">OTP</Label>
                </div>
            </RadioGroup>
            <div className="relative mt-2 xl:mt-4">
                <div className={errors.password ? 'mb-6 xl:mb-8' : 'mb-2 xl:mb-4'}>
                    <FormItem
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                        className='mb-0'
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    placeholder="Enter your password"
                                    autoComplete="off"
                                    className="py-2"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    {message && <p className={`text-sm mb-2 ${message.type === 'error' ? 'text-red-500' : 'text-white'}`}>{message.text}</p>}
                </div>
                <div className='flex justify-between items-center'>
                    <div className="flex items-center pl-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="mr-2 accent-[#00A8E9] bg-white"
                            defaultChecked={localStorage.getItem('rememberMe') === 'true'}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    localStorage.setItem('rememberMe', 'true');
                                } else {
                                    localStorage.setItem('rememberMe', 'false');
                                }
                            }}
                        />
                        <label htmlFor="remember" className="text-sm text-white">
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-[#FFEC00] hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <div className="mt-3 xl:mt-5 flex items-center justify-center gap-3 oauth-container">
                    <div className="h-px w-16 bg-[#3A3F48] oauth-divider" />
                    <span className="text-sm font-semibold text-white whitespace-nowrap oauth-text">or Login through</span>
                    <div className="flex gap-3 oauth-buttons-wrapper">
                        <OauthSignIn compact />
                        <AppleSignIn compact />
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-center mt-6">
                <Button
                    block
                    variant="solid"
                    type="submit"
                    className="bg-[#00A8E9] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold flex justify-center items-center gap-2"
                >
                    {loginMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}{loginMutation.isPending ? 'Signing in...' : 'Log in'}
                </Button>
            </div> */}
            <div className="mt-4 xl:mt-8">
                <p className="text-sm font-medium text-white mb-2 xl:mb-4">{"Don't have an account?"}</p>

                <div className="grid grid-cols-2 gap-4 auth-action-buttons">

                    <Link
                        to={"/sign-up/start" + window.location.search}
                        className="
                            group relative inline-flex h-16 lg:h-20 xl:h-28 w-full items-center justify-center
                            rounded-xl lg:rounded-2xl border border-[#00A8E9] bg-[#00A8E9] text-black
                            shadow-md transition-all duration-200 hover:brightness-95 focus:outline-none
                            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9]
                            auth-action-btn-item
                        "
                        aria-label="Sign Up"
                    >
                        <div className="flex flex-col items-center justify-center gap-2">
                            <UserRound className="h-6 w-6" />
                            <span className="text-base font-semibold">Sign Up</span>
                        </div>
                    </Link>


                    <button
                        className="group relative inline-flex h-16 lg:h-20 xl:h-28 w-full items-center justify-center
             rounded-xl lg:rounded-2xl border border-[#2C2C2C] bg-[#FFE500] text-black
             shadow-md transition-all duration-200 hover:brightness-95 focus:outline-none
             focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9] auth-action-btn-item"
                        aria-label="Log In"
                    >
                        <div className="flex flex-col items-center justify-center gap-2 text-base font-semibold">
                            <LogIn className="h-6 w-6" />
                            {loginMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                            {loginMutation.isPending ? 'Logging in...' : 'Log in'}
                        </div>
                    </button>

                </div>
            </div>
        </Form>
    )
}


interface LoginWithEmailPhoneOtpProps {
    loginWith: 'password' | 'otp',
    setLoginWith?: (value: 'password' | 'otp') => void
    handleLogin?: (loginResponse: { user: User; token: string; } | null) => void
    emailOrPhone: string,
    setEmailOrPhone: (value: string) => void
}

const LoginWithEmailPhoneOtp = ({ setLoginWith, handleLogin, emailOrPhone, setEmailOrPhone }: LoginWithEmailPhoneOtpProps) => {

    const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
    const isMobile = (value: string) => /^\d{10}$/.test(value);

    const [otpSend, setOtpSend] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [userNotFound, setUserNotFound] = useState<boolean>(false);

    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const { countdown, resetTimer } = useOtpTimer();

    const { handleSubmit, formState: { errors }, control, watch } = useForm<SignInWithOtpForm>({
        defaultValues: {
            emailOrPhone: emailOrPhone || localStorage.getItem('email') || '',
        },
        resolver: zodResolver(validationWithOtp),
    });

    const emailOrPhoneValue = watch('emailOrPhone');
    const otpLength = OTP_CONFIG.OTP_LENGTH;

    const resendMobileOtpMutation = useMutation({
        mutationFn: sendMobileOtp,
        onSuccess: () => {
            resetTimer();
            // successToast("OTP Resent", "Check your email or phone");
            setMessage({ type: 'success', text: "OTP Resent. Check your email or phone" });
        },
        onError: (err: unknown) => {
            // const error = err as AxiosError<{ message?: string }>;
            // errorToast("OTP Resend Failed", error.response?.data?.message || "Something went wrong, please try again later.");
            const error = err as AxiosError<{ message?: string }>;
            setMessage({ type: 'error', text: error.response?.data?.message || "Something went wrong, please try again later." });
        },
    });

    const resendEmailOtpMutation = useMutation({
        mutationFn: emailLoginWithCode,
        onSuccess: (data) => {
            resetTimer();
            // successToast("OTP Resent", data.message || "Check your email or phone");
            setMessage({ type: 'success', text: data.message || "Check your email or phone" });
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            // errorToast("OTP Resend Failed", error.response?.data?.message || "Something went wrong, please try again later.");
            setMessage({ type: 'error', text: error.response?.data?.message || "Something went wrong, please try again later." });
        },
    });


    const sendEmailMutation = useMutation({
        mutationFn: emailLoginWithCode,
        onSuccess: (data) => {
            if (data?.status === 0) {
                setMessage({ type: 'error', text: data.message || "Something went wrong" });
                return;
            }
            setOtpSend(true);
            setMessage({ type: 'success', text: data.message || "Please check your email for the OTP." });
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            // setMessage({ type: 'error', text: error.response?.data?.message || "Something went wrong, please try again later." });
            const message = error.response?.data?.message || "Something went wrong, please try again later.";
            if (message === 'User not found!') {
                setUserNotFound(true);
            }
        },
    });

    const verifyEmailMutation = useMutation({
        mutationFn: (data: { email: string; otp: string }) => verifyEmailLoginCode(data),
        onSuccess: (data) => {
            console.log("verifyEmailMutation", data);
            if (data.status === 0) {
                setOtp("");
                // errorToast("Invalid OTP", data?.error || "Please try again.");
                setMessage({ type: 'error', text: data?.error || "Something went wrong, please try again later." });
                return;
            }

            if (data?.data?.token && data?.data?.user) {
                setOtp("");
                // successToast("Verified", "Your account is verified");
                setMessage({ type: 'success', text: "Your account is verified" });
                handleLogin?.({ token: data.data.token, user: data.data.user });
                return;
            }

            // errorToast("Verification Failed", "Something went wrong, please try again later.");
            setMessage({ type: 'error', text: "Something went wrong, please try again later." });
        },
        onError: () => {
            setOtp("");
            // errorToast("Invalid OTP", "Please try again.");
            // setMessage("Invalid OTP. Please try again.");
        },
    });


    const sendOtpMobileMutation = useMutation({
        mutationFn: sendMobileOtp,
        onSuccess: (data) => {
            if (data?.status === 0) {
                setMessage({ type: 'error', text: data.message || "Something went wrong" });
                return;
            }
            setOtpSend(true);
            // successToast("OTP Sent", "Please check your email or phone for the OTP.");
            setMessage({ type: 'success', text: "OTP Sent. Please check your email or phone for the OTP." });
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{
                message?: string;
                error?: string[];
            }>;
            const message = error?.response?.data?.error?.length ? error.response.data?.error?.[0] : error.response?.data?.message;
            // errorToast("Sign Up Failed", message || "Something went wrong, please try again later.");
            setMessage({ type: 'error', text: message || "Something went wrong, please try again later." });
        },
    });

    const verifyMobileOtpMutation = useMutation({
        mutationFn: verifyMobileOtp,
        onSuccess: (data) => {
            // successToast("Verified", "Your account is verified");
            setMessage({ type: 'success', text: "Your account is verified" });
            const response = {
                token: data.data.token,
                user: data.data.user
            }
            if (response) {
                handleLogin?.(response);
            }
        },
        onError: () => {
            setOtp("");
            // errorToast("Invalid OTP", "Please try again.");
            setMessage({ type: 'error', text: "Invalid OTP. Please try again." });
        },
    });

    const signInWithOtp = (data: SignInWithOtpForm) => {

        const input = data.emailOrPhone;

        if (!input) {
            // errorToast("Please enter Email or Phone");
            setMessage({ type: 'error', text: "Please enter Email or Phone" });
            return;
        }

        // Determine login type
        const loginViaEmail = isEmail(input);
        const loginViaMobile = isMobile(input);

        if (!otpSend) {
            if (loginViaEmail) {
                sendEmailMutation.mutate({ email: input });
            } else if (loginViaMobile) {
                const data = {
                    mobile_number: input,
                    digits: 4 as const,
                }
                sendOtpMobileMutation.mutate(data);
            } else {
                // errorToast("Invalid Email or Mobile");
                setMessage({ type: 'error', text: "Invalid Email or Mobile" });
            }
            return;
        }

        const currentOtpLength = OTP_CONFIG.OTP_LENGTH;

        if (!otp || otp.length !== currentOtpLength) {
            // errorToast(
            //     "Valid OTP is required",
            //     `Please enter the ${currentOtpLength}-digit OTP sent to your ${loginViaEmail ? "email" : "mobile"}.`
            // );
            setMessage({ type: 'error', text: `Please enter the ${currentOtpLength}-digit OTP sent to your ${loginViaEmail ? "email" : "mobile"}.` });
            return;
        }

        if (loginViaEmail) {
            verifyEmailMutation.mutate({ email: input, otp });
        } else if (loginViaMobile) {
            verifyMobileOtpMutation.mutate({ mobile_number: input, otp: otp });
        }

    }

    const resendOtp = () => {
        if (resendMobileOtpMutation.isPending || resendEmailOtpMutation.isPending) return;
        const emailPhone = watch('emailOrPhone');
        if (!emailPhone) {
            // errorToast("Please enter Email or Phone");
            setMessage({ type: 'error', text: "Please enter Email or Phone" });
            return;
        }

        const loginViaEmail = isEmail(emailPhone);
        const loginViaMobile = isMobile(emailPhone);

        if (loginViaEmail) {
            resendEmailOtpMutation.mutate({ email: emailPhone });
        } else if (loginViaMobile) {
            resendMobileOtpMutation.mutate({ mobile_number: emailPhone, digits: 4 });
        } else {
            // errorToast("Invalid Email or Mobile");
            setMessage({ type: 'error', text: "Invalid Email or Mobile" });
        }
    }

    return (
        <Form onSubmit={handleSubmit(signInWithOtp)}>
            <div>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.emailOrPhone)}
                    errorMessage={errors.emailOrPhone?.message}
                    className={errors.emailOrPhone ? 'mb-5 xl:mb-6' : 'mb-0'}
                >
                    <Controller
                        name="emailOrPhone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter your email or mobile no."
                                autoComplete="off"
                                disabled={otpSend}
                                value={field.value}
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    if (/^\d*$/.test(nextValue)) {
                                        const trimmed = nextValue.slice(0, 10);
                                        setEmailOrPhone(trimmed);
                                        field.onChange(trimmed);
                                        return;
                                    }
                                    setEmailOrPhone(nextValue);
                                    field.onChange(nextValue);
                                }}
                            />
                        )}
                    />
                </FormItem>
                {
                    userNotFound && <div className='mt-2'>
                        <p className="text-[#00A8E9]">Welcome!</p>
                        <p className="text-sm text-red-500">It looks like you {`don't`} have an account yet.</p>
                        <Link to="/sign-up/start" className="text-sm text-codeblue hover:underline">
                            Please sign up to begin.
                        </Link>
                    </div>
                }
            </div>
            <div className='mt-2'>
                <RadioGroup
                    className="flex gap-6 mb-3 mt-3"
                    name="loginVia"
                    value={'otp'}
                    onValueChange={(value) => {
                        setLoginWith?.(value as 'password' | 'otp')
                    }}
                >
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="password" id="password" className={'border-[1.5px] rounded-full w-4 h-4 border-[#515B60] text-[#515B60]'} />
                        <Label htmlFor="password" className="text-[#00A8E9] font-medium">Password</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="otp" id="otp" className={classNames('border-[1.5px] rounded-full w-4 h-4 border-[#00A8E9] text-[#00A8E9]')} />
                        <Label htmlFor="otp" className="text-[#00A8E9] font-medium">OTP</Label>
                    </div>
                </RadioGroup>
            </div>
            {
                otpSend && <div>
                    <InputOTP maxLength={otpLength} value={otp} disabled={verifyEmailMutation.isPending || verifyMobileOtpMutation.isPending} onChange={setOtp}>
                        <InputOTPGroup className="flex gap-2 w-full otp-input-group">
                            {Array.from({ length: otpLength }).map((_, index) => (
                                <InputOTPSlot
                                    key={index}
                                    index={index}
                                    className="border rounded-sm ring-[#00A8E9] w-full text-center text-lg border-gray-500 otp-input-slot"
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            }
            {
                message && <p className={`text-sm mb-2 mt-2 ${message.type === 'error' ? 'text-red-500' : 'text-white'}`}>{message.text}</p>
            }
            <div className="flex flex-col justify-center mt-6">
                {
                    !otpSend && <Button
                        type="submit"
                        className="bg-[#00A8E9] text-white w-full rounded-lg px-8 py-3 font-semibold flex justify-center items-center gap-2 shadow-md hover:bg-[#0098d4] transition-colors duration-200"
                    >
                        {(sendOtpMobileMutation.isPending || sendEmailMutation.isPending) && <Loader className="ml-2 h-4 w-4 animate-spin" />}{(sendOtpMobileMutation?.isPending || sendEmailMutation?.isPending) ? 'Sending...' : 'Send OTP'}
                    </Button>
                }
                {
                    otpSend && <Button
                        type="submit"
                        className="bg-[#00A8E9] text-white w-full rounded-lg px-8 py-3 font-semibold flex justify-center items-center gap-2 shadow-md hover:bg-[#0098d4] transition-colors duration-200"
                    >
                        {(sendOtpMobileMutation.isPending || sendEmailMutation.isPending) && <Loader className="ml-2 h-4 w-4 animate-spin" />}{(sendOtpMobileMutation?.isPending || sendEmailMutation?.isPending) ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                }

                {
                    otpSend && <div className="text-center text-base text-[#263A43] mt-4">
                        <div className="text-center">
                            {countdown > 0 ? (
                                <p>You can request a new OTP in <span className="font-semibold text-[#00A8E9]">{countdown}</span> seconds</p>
                            ) : (
                                <div className='flex justify-center items-center flex-col gap-2'>
                                    <p>{`Didn't`} get the code?</p>
                                    <button type='button' className='text-[#00A8E9] cursor-pointer' disabled={resendMobileOtpMutation.isPending || resendEmailOtpMutation.isPending} onClick={resendOtp}>Resend OTP</button>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </Form>

    )
}

