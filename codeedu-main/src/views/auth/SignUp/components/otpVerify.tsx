import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/ShadcnButton';
import { signupOtpResend, verifyOtp } from '@/services/auth/AccountService';
import { useThemeStore } from '@/store/themeStore';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOtpTimer, OTP_CONFIG } from '../../@hooks/useOtp';
import { errorToast, successToast } from '../../@lib/toastUtils';
import { AxiosError } from 'axios';

const OtpVerify: React.FC = () => {

    const navigate = useNavigate();
    const { loginProfile } = useThemeStore();
    const [otp, setOtp] = useState("");
    const email = sessionStorage.getItem("accountEmail") || "";

    const { countdown, resetTimer } = useOtpTimer();


    const verifyMutation = useMutation({
        mutationFn: verifyOtp,
        onSuccess: () => {
            successToast("Verified", "Your account is verified");
            navigate("/personal-info" + window.location.search);
        },
        onError: () => {
            setOtp("");
            errorToast("Invalid OTP", "Please try again.");
        },
    });

    // Resend OTP
    const resendMutation = useMutation({
        mutationFn: signupOtpResend,
        onSuccess: (data) => {
            sessionStorage.setItem("token", data.token);
            resetTimer();
            successToast("OTP Resent", "Check your email");
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            errorToast("OTP Resend Failed", error.response?.data?.message || "Something went wrong, please try again later.");
        },
    });

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== OTP_CONFIG.OTP_LENGTH)
            return errorToast("Invalid OTP", "Enter a 4-digit code");

        if (otp === OTP_CONFIG.TEST_OTP) {
            successToast("Verified (Otp Bypass WWith Test OTP)", "Account verified");
            return navigate("/personal-info" + window.location.search);
        }

        verifyMutation.mutate({ email, otp });
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-cblue">
                    Sign up as <span className="capitalize">{loginProfile}</span>
                </h1>
                <Button variant="ghost" size="icon" aria-label="Cancel signup" onClick={() => { sessionStorage.removeItem('accountEmail'); navigate("/sign-up") }}><X className="h-5 w-5" /></Button>
            </header>

            <div className="space-y-2">
                <p className="text-lg font-semibold text-[#263A43]">Verify Your Email</p>
                <p className="text-base text-[#263A43]"> Enter the {OTP_CONFIG.OTP_LENGTH}-digit code sent to{' '} <span className="text-[#d63384] font-medium">{email}</span></p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleVerify}>
                <div>
                    <InputOTP maxLength={OTP_CONFIG.OTP_LENGTH} value={otp} disabled={verifyMutation.isPending} onChange={setOtp}>
                        <InputOTPGroup className="flex gap-2 w-full">
                            {Array.from({ length: OTP_CONFIG.OTP_LENGTH }).map((_, index) => (
                                <InputOTPSlot
                                    key={index}
                                    index={index}
                                    className="border rounded-sm ring-[#d63384] w-full text-center text-lg"
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button
                    type="submit"
                    disabled={verifyMutation.isPending || otp.length !== OTP_CONFIG.OTP_LENGTH}
                    className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg py-6 font-semibold text-base focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                >
                    {verifyMutation.isPending && (<LoaderCircle className="h-4 w-4 animate-spin mr-2" />)} Verify & Continue
                </Button>
            </form>

            <div className="text-center text-base text-[#263A43]">
                <div className="text-center">
                    {countdown > 0 ? (
                        <p>You can request a new OTP in <span className="font-semibold text-[#d63384]">{countdown}</span> seconds</p>
                    ) : (
                        <div className='flex justify-center items-center flex-col gap-2'>
                            <p>{`Didn’t`} get the code?</p>
                            <button className='text-[#d63384] cursor-pointer' disabled={resendMutation.isPending} onClick={() => resendMutation.mutate(email)}>Resend OTP</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;