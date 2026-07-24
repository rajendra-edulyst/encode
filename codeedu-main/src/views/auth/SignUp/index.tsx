import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/Input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendOtpSignup, signupOtpResend, verifyOtp } from "@/services/auth/AccountService";
import { sendMobileOtp, verifyMobileOtpSignup } from "@/services/AuthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, UserRound, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOtpTimer, OTP_CONFIG } from "../@hooks/useOtp";
import { errorToast, successToast } from "../@lib/toastUtils";
import { AxiosError } from "axios";
import { clearSignupVerifiedMobile } from "@/utils/signupVerifiedMobileStorage";
import { extractTokenFromAuthPayload } from "@/utils/extractAuthApiToken";
import { getSignupVerificationState } from "@/store/signupVerificationStore";
import boy from '@assets/images/boy6.png'
import OauthSignIn from "../SignIn/components/OauthSignIn";
import AppleSignIn from "../SignIn/components/AppleSignIn";
import { GoogleOAuthProvider } from "@react-oauth/google";
import appConfig from "@/configs/app.config";

const SignUp = () => {
  const queryClient = useQueryClient();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { countdown, resetTimer } = useOtpTimer();
  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isMobile = (value: string) => /^\d{10}$/.test(value);
  const isEmailFlow = isEmail(emailOrPhone);
  const isMobileFlow = isMobile(emailOrPhone);
  const otpLength = OTP_CONFIG.OTP_LENGTH;

  const [message, setMessage] = useState<{ type: "error" | "success"; content: string, for: "signup" | "verify" | "resend", } | null>(null);

  // Send OTP mutation
  const signupMutation = useMutation({
    mutationFn: sendOtpSignup,
    onSuccess: (data) => {
      if (data?.status === 0) {
        return setMessage({ type: "error", content: data?.message || "Something went wrong", for: "signup" });
      }
      if (!data?.data?.token) return setMessage({ type: "error", content: data?.message || "Could not generate token", for: "signup" });
      sessionStorage.setItem("token", data.data.token);
      clearSignupVerifiedMobile();
      if (isEmailFlow) {
        sessionStorage.setItem("accountEmail", emailOrPhone);
      }
      setOtpSent(true);
      resetTimer();
      setMessage({ type: "success", content: data?.message ?? 'OTP sent successfully. Please check your email.', for: "signup" });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string }>;
      setMessage({ type: "error", content: error.response?.data?.message || "Something went wrong, please try again later.", for: "signup" });
    },
  });

  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data?.status === 0) {
        setMessage({
          type: "error",
          content: data?.error || data?.message || "Invalid OTP",
          for: "verify",
        });
        return;
      }
      const store = getSignupVerificationState();
      const marked = store.markVerifiedFromApiResponse(data, {
        email: emailOrPhone.trim(),
        fallbackType: "email",
      });
      if (!marked) {
        store.setEmailVerified(emailOrPhone.trim());
      }
      setMessage({ type: "success", content: "Your account is verified", for: "verify" });
      void queryClient.invalidateQueries({ queryKey: ["signUpTokenData"] });
      navigate("/personal-info" + window.location.search);
    },
    onError: () => {
      setOtp("");
      setMessage({ type: "error", content: "Invalid OTP", for: "verify" });
    },
  });

  const sendMobileOtpMutation = useMutation({
    mutationFn: sendMobileOtp,
    onSuccess: (data) => {
      if (data?.status === 0) {
        setMessage({ type: "error", content: data?.message || "Could not send OTP", for: "signup" });
        return;
      }
      const leadToken = extractTokenFromAuthPayload(data);
      if (leadToken) {
        sessionStorage.setItem("token", leadToken);
      }
      sessionStorage.removeItem("accountEmail");
      setOtpSent(true);
      resetTimer();
      setMessage({ type: "success", content: data?.message ?? "OTP sent successfully. Please check your mobile.", for: "signup" });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string; error?: string[] }>;
      const errMessage = error?.response?.data?.error?.[0] || error.response?.data?.message || "Something went wrong, please try again later.";
      setMessage({ type: "error", content: errMessage, for: "signup" });
    },
  });

  const verifyMobileMutation = useMutation({
    mutationFn: verifyMobileOtpSignup,
    onSuccess: (data) => {
      if (data?.status === 0) {
        setMessage({
          type: "error",
          content: data?.error || (data as { message?: string }).message || "Invalid OTP",
          for: "verify",
        });
        return;
      }
      const t = extractTokenFromAuthPayload(data);
      if (typeof t === "string" && t.length > 0) {
        sessionStorage.setItem("token", t);
      }
      const store = getSignupVerificationState();
      const marked = store.markVerifiedFromApiResponse(data, {
        mobile: emailOrPhone.trim(),
        fallbackType: "mobile",
      });
      if (!marked) {
        store.setMobileVerified(emailOrPhone.trim());
      }
      void queryClient.invalidateQueries({ queryKey: ["signUpTokenData"] });
      setMessage({ type: "success", content: "Your mobile is verified", for: "verify" });
      navigate("/personal-info" + window.location.search);
    },
    onError: () => {
      setOtp("");
      setMessage({ type: "error", content: "Invalid OTP", for: "verify" });
    },
  });

  // Resend OTP mutation
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

  const resendMobileMutation = useMutation({
    mutationFn: sendMobileOtp,
    onSuccess: (data) => {
      const leadToken = extractTokenFromAuthPayload(data);
      if (leadToken) {
        sessionStorage.setItem("token", leadToken);
      }
      resetTimer();
      setMessage({ type: "success", content: data?.message || "OTP resent successfully", for: "resend" });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string; error?: string[] }>;
      const errMessage = error?.response?.data?.error?.[0] || error.response?.data?.message || "Something went wrong, please try again later.";
      setMessage({ type: "error", content: errMessage, for: "resend" });
    },
  });

  // Auto verify OTP when all digits are entered
  useEffect(() => {
    if (otp.length === otpLength && otpSent) {
      handleAutoVerify();
    }
  }, [otp, otpSent, otpLength]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const value = emailOrPhone.trim();
    if (!value) {
      errorToast("Input Required", "Please enter your email or mobile number");
      return;
    }
    if (isEmail(value)) {
      signupMutation.mutate(value);
      return;
    }
    if (isMobile(value)) {
      sendMobileOtpMutation.mutate({ mobile_number: value, digits: 4, is_signup: 1 });
      return;
    }
    setMessage({ type: "error", content: "Please enter a valid email or mobile number", for: "signup" });
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (otp.length !== otpLength) {
      // errorToast("Invalid OTP", `Enter a ${OTP_CONFIG.OTP_EMAIL_LENGTH}-digit code`);
      setMessage({ type: "error", content: `Enter a ${otpLength}-digit code`, for: "verify" });
      return;
    }

    if (otp === OTP_CONFIG.TEST_OTP) {
      setMessage({ type: "success", content: "Verified (Otp Bypass With Test OTP)", for: "verify" });
      if (isMobileFlow) {
        getSignupVerificationState().setMobileVerified(emailOrPhone.trim());
        void queryClient.invalidateQueries({ queryKey: ["signUpTokenData"] });
      }
      return navigate("/personal-info" + window.location.search);
    }

    if (isEmailFlow) {
      verifyMutation.mutate({ email: emailOrPhone, otp });
      return;
    }
    if (isMobileFlow) {
      verifyMobileMutation.mutate({ mobile_number: emailOrPhone, otp });
      return;
    }
    setMessage({ type: "error", content: "Please enter a valid email or mobile number", for: "verify" });
  };

  const handleAutoVerify = () => {
    if (otp.length === otpLength) {
      handleVerifyOtp();
    }
  };

  const handleResendOtp = () => {
    if (isEmailFlow) {
      resendMutation.mutate(emailOrPhone);
      return;
    }
    if (isMobileFlow) {
      resendMobileMutation.mutate({ mobile_number: emailOrPhone, digits: 4, is_signup: 1 });
      return;
    }
    setMessage({ type: "error", content: "Please enter a valid email or mobile number", for: "resend" });
  };

  return (
    <GoogleOAuthProvider clientId={appConfig.googleAuth.clientId}>
      <div className="flex w-full flex-col max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto rounded-[20px]">
        {/* Mobile Header Section - Outside the card */}
        <div className="mb-4 flex md:hidden flex-row items-start justify-between">
          <h1 className="text-[28px] font-bold leading-tight text-white text-left w-[60%]">
            Step In and <br />
            Unlock New <br />
            Creative <br />
            <span className="text-[#00A8E9] font-creative text-3xl">
              Possibilities
            </span>
          </h1>
          <div className="w-[140px] -mt-2 -mr-6 relative z-10">
            <img src={boy} alt="boy" className="w-full object-contain scale-x-[-1]" />
          </div>
        </div>

        {/* Card Container */}
        <div className="flex w-full flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[90px] py-6 lg:py-8 xl:py-10 2xl:py-12 bg-[#1D1D1D] rounded-[20px] overflow-hidden">
          {/* Desktop Header Section - Inside the card */}
          <div className="hidden md:block mb-4 lg:mb-6 2xl:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-[32px] 2xl:text-[40px] font-bold leading-tight text-white lg:leading-tight whitespace-nowrap">
              Step in to begin your Creative{" "}
              <span className="text-[#00A8E9] font-creative">
                Possibilities
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 lg:gap-8 justify-around lg:justify-between items-center w-full">
            <div className="hidden sm:block w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-[318px]">
              <img src={boy} alt="boy" className="w-full object-contain scale-x-[-1]" />
            </div>
            <div className="w-full md:flex-1 md:max-w-md relative z-20">
              {/* Email/Mobile Entry Section - Always Visible */}
              <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSendOtp} >
                <div className='flex flex-col gap-2'>
                  {/* <Label className="text-white text-sm font-medium">
                Enter your Email or Mobile Number
              </Label> */}
                  <Input
                    required
                    type="text"
                    value={emailOrPhone}
                    placeholder="Enter your email or mobile number"
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (/^\d*$/.test(nextValue)) {
                        setEmailOrPhone(nextValue.slice(0, 10));
                        return;
                      }
                      setEmailOrPhone(nextValue);
                    }}
                    className="dark:bg-[#101010] h-12 md:h-[52px] lg:h-[56px] rounded-[12px] px-4 md:px-6 text-sm md:text-[16px] font-normal placeholder:text-[#505050] text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none dark:focus-visible:bg-[#101010] dark:focus:bg-[#101010]"
                  />
                  {
                    message && message.for === "signup" && (
                      <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>{message.content}</p>
                    )
                  }
                </div>

                <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                  <p className="text-[11px] md:text-sm text-white w-[50%] md:max-w-[50%] font-semibold md:font-normal leading-tight">
                    Send OTP to verify <br className="block md:hidden" /> your Email.
                  </p>

                  <Button
                    type="submit"
                    disabled={signupMutation.isPending || sendMobileOtpMutation.isPending}
                    className="group relative inline-flex h-10 md:h-[52px] lg:h-[56px] flex-1 md:w-40 items-center justify-center
              rounded-xl md:rounded-2xl border border-[#7FC142] bg-[#7FC142] text-black
              shadow-md transition-all duration-200 hover:brightness-95 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7FC142]
              font-bold text-sm md:text-lg lg:text-xl"
                  >
                    {(signupMutation.isPending || sendMobileOtpMutation.isPending) && <LoaderCircle className="w-4 h-4 animate-spin mr-2" />}
                    Send OTP
                  </Button>
                </div>
              </form>

              {/* OTP Verification Section - Always Visible but conditionally enabled */}
              <div className="space-y-4 sm:space-y-6 mt-4">
                <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleVerifyOtp}>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={otpLength}
                      value={otp}
                      disabled={verifyMutation.isPending || verifyMobileMutation.isPending || !otpSent}
                      onChange={setOtp}
                    >
                      <InputOTPGroup className="flex w-full max-w-[30rem] justify-between gap-2 sm:gap-3">
                        {Array.from({ length: otpLength }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className={`
                      h-10 w-10 border-none rounded-md text-center dark:bg-[#101010] dark:text-white text-white font-semibold sm:h-11 sm:w-12 sm:rounded-xl sm:text-lg md:h-[52px] md:w-[64px] lg:h-[56px] lg:w-[80px]`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {
                    message && message.for === "verify" && (
                      <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"} text-center`}>{message.content}</p>
                    )
                  }
                </form>
                {/* Resend OTP Section */}
                {otpSent && (
                  <div className="text-center text-sm">
                    {countdown > 0 ? (
                      <p className="text-gray-400">
                        You can request a new OTP in{' '}
                        <span className="font-semibold text-[#00A8E9]">{countdown}</span> seconds
                      </p>
                    ) : (
                      <div className="flex justify-center items-center flex-col gap-2">
                        <p className="text-gray-400">{`Didn't get the code?`}</p>
                        <button
                          type="button"
                          className="text-[#00A8E9] cursor-pointer font-semibold hover:underline"
                          disabled={resendMutation.isPending || resendMobileMutation.isPending}
                          onClick={handleResendOtp}
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                    {message && message.for === "resend" && (
                      <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"} text-center`}>{message.content}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3">
                <div className="hidden sm:block h-px w-20 bg-[#3A3F48]" />
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">or Login through</span>
                <div className="flex gap-2">
                  <OauthSignIn compact />
                  <AppleSignIn compact />
                </div>
              </div>

              {/* Already have account section */}
              <div className="pt-4 text-start sm:pt-6">
                <p className="text-white text-sm font-bold mb-4">Already have an Account?</p>
              </div>

              {/* Login/Signup Buttons Section */}
              <div className="mt-1 sm:mt-2">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  {/* Log In Button */}
                  <Link
                    to={"/sign-in" + window.location.search}
                    className="
              group relative inline-flex h-16 w-full items-center justify-center sm:h-20 lg:h-24
              rounded-2xl border border-[#2C2C2C] bg-[#FFEC00] text-black
              shadow-md transition-all duration-200 hover:brightness-95 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9]
            "
                    aria-label="Log In"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LogIn className="h-6 w-6" />
                      <span className="text-sm font-semibold sm:text-base">Log In</span>
                    </div>
                  </Link>

                  <Link
                    to={"/sign-up" + window.location.search}
                    className="
              group relative inline-flex h-16 w-full items-center justify-center sm:h-20 lg:h-24
              rounded-2xl border border-[#00A8E9] bg-[#00A8E9] text-black
              shadow-md transition-all duration-200 hover:brightness-95 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9]
            "
                    aria-label="Sign Up"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserRound className="h-6 w-6" />
                      <span className="text-sm font-semibold sm:text-base">Sign Up</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
    //     <Dialog open={showDialog} onOpenChange={setShowDialog}>
    //     <DialogContent className='text-center bg-[#5A5A5A]'>
    //         <div>
    //             <div className='mb-6'>
    //                 <h1 className='text-[64px] mb-4'>✨</h1>
    //                 <h1 className='text-3xl font-bold text-white'>You are Registered ✅ to explore and design how the world learns !!.</h1>
    //             </div>
    //             <p className='text-base text-white font-normal'>Welcome to CODE Edu BETA — It’s not flawless (yet), but that’s where you come in. Explore, experiment, and help us make learning truly alive.</p>
    //         </div>
    //         <div className="relative z-20 flex justify-center w-full max-w-5xl" onClick={() => navigate('/getting-started/profile')}>
    //             <div className='text-center text-base gap-2 bg-codeyellow w-[122px] h-[100px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={handleNext}>
    //                 {saveDomainsMutation?.isPending ? <Spinner /> : <ChevronRight className="w-12 h-22" strokeWidth={2} />}
    //                 Start Exploring
    //             </div>
    //         </div>
    //         <div>
    //             <p className='mt-6 text-sm text-white font-light'>
    //                 This BETA learns from you — literally. Every click, choice, and comment helps us improve.
    //             </p>
    //         </div>
    //     </DialogContent>
    // </Dialog>
  );
};

export default SignUp;