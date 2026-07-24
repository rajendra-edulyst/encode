import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Check, ChevronsUpDown, Loader, LogIn, Pencil } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
import { useForm, Controller } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import countryCodes from '@/data/countryCode';
import { useCities, useCountries, useStates } from '@/hooks/data/useLocation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EulaModal from '../eula/EulaModal';
import { AxiosError } from 'axios';
import { userSignUpData } from '@/views/auth/@hooks/useAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/auth';
import { sendMobileOtp, verifyMobileOtpSignup } from '@/services/AuthService';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTP_CONFIG, useOtpTimer } from '@/views/auth/@hooks/useOtp';
import { clearSignupVerifiedMobile, getSignupVerifiedMobile } from '@/utils/signupVerifiedMobileStorage';
import { isSignupLeadMobileVerifiedByApi } from '@/utils/signupLeadPhoneVerified';
import { useSignupVerificationStore } from '@/store/signupVerificationStore';

const formSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    platformName: z.string().min(1, "Platform Name is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    phone: z.string().optional(),
    country_code: z.string().optional(),
});

type FormData = z.infer<typeof formSchema> & { email_token: string };

const PersonalInfoForm = () => {
    const MOBILE_OTP_LENGTH = OTP_CONFIG.OTP_LENGTH;

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token") || "";

    const [openCountry, setOpenCountry] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [acceptedEula, setAcceptedEula] = useState(false);
    const [openEulaDialog, setOpenEulaDialog] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        content: "",
    });
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState("");
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [phoneVerifyError, setPhoneVerifyError] = useState("");
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const { countdown, resetTimer } = useOtpTimer();

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            platformName: "",
            country: "",
            state: "",
            city: "",
            phone: "",
            country_code: "+91",
        },
    });

    const selectedCountry = watch("country");
    const selectedState = watch("state");
    const selectedCountryCode = watch("country_code");
    const phoneValue = watch("phone");

    const { data: countries = [], isLoading: loadingCountries } = useCountries();
    const { data: states = [], isLoading: loadingStates } = useStates(selectedCountry);
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedState);

    const { data: userResponse } = userSignUpData(token);
    const user = useMemo(() => userResponse?.data, [userResponse]);
    const { signUp } = useAuth()
    const queryClient = useQueryClient();
    const matchesVerifiedMobile = useSignupVerificationStore((s) => s.matchesVerifiedMobile);
    const markVerifiedFromApi = useSignupVerificationStore((s) => s.markVerifiedFromApiResponse);
    const setStoreMobileVerified = useSignupVerificationStore((s) => s.setMobileVerified);

    const selectedCountryObj = useMemo(() => countries.find((c) => c.id.toString() === selectedCountry?.toString()), [countries, selectedCountry]);
    const isIndia = selectedCountryObj?.name?.toLowerCase() === "india";
    const uniqueCountryCodes = useMemo(() => {
        const seen = new Set<string>();
        return countryCodes.filter((country) => {
            const dialCode = country.dial_code.replace(/\s+/g, "");
            if (seen.has(dialCode)) return false;
            seen.add(dialCode);
            return true;
        });
    }, []);

    const signUpMutation = useMutation({
        mutationFn: (userData: any) => signUp(userData, true),
        onSuccess: (data) => {
            if (data.status === 0) {
                setMessage({ type: "error", content: data.message || "Something went wrong, please try again later." });
                return;
            }
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('accountEmail');
            clearSignupVerifiedMobile();
            setMessage({ type: "success", content: "Registration successful! Redirecting to community..." });
            navigate("/getting-started/preferences");
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            setMessage({ type: "error", content: error.response?.data?.message || "Something went wrong, please try again later." });
        },
    });

    const phoneDigits = (phoneValue || "").replace(/\D/g, "");
    const mobileNumberForOtp = phoneDigits;
    const prevPhoneDigitsRef = useRef<string | null>(null);
    const showPhoneVerifiedBadge =
        isPhoneVerified ||
        matchesVerifiedMobile(phoneDigits) ||
        isSignupLeadMobileVerifiedByApi(user, phoneDigits);

    const sendMobileOtpMutation = useMutation({
        mutationFn: sendMobileOtp,
        onSuccess: (response) => {
            if (response?.status === 0) {
                setPhoneVerifyError(response.message || "Failed to send OTP.");
                return;
            }
            setPhoneOtpSent(true);
            setPhoneOtp("");
            setPhoneVerifyError("");
            resetTimer();
        },
        onError: () => {
            setPhoneVerifyError("Failed to send OTP. Please try again.");
        },
    });

    const verifyMobileOtpMutation = useMutation({
        mutationFn: verifyMobileOtpSignup,
        onSuccess: (response, variables) => {
            if (response?.status === 0) {
                setPhoneVerifyError(response.error || "Invalid OTP. Please try again.");
                return;
            }
            const marked = markVerifiedFromApi(response, {
                mobile: variables.mobile_number,
                fallbackType: 'mobile',
            });
            if (!marked) {
                setStoreMobileVerified(variables.mobile_number);
            }
            setIsPhoneVerified(true);
            setPhoneOtpSent(false);
            setPhoneOtp("");
            setPhoneVerifyError("");
            setMessage({ type: "success", content: "Mobile number verified successfully." });
            void queryClient.invalidateQueries({ queryKey: ['signUpTokenData'] });
        },
        onError: () => {
            setPhoneVerifyError("Invalid OTP. Please try again.");
        },
    });

    useEffect(() => {
        if (countries.length) {
            const india = countries.find((c) => c.name.toLowerCase() === "india");
            if (india) setValue("country", india.id.toString());
        }
    }, [countries, setValue]);

    useEffect(() => {
        const verifiedSignupMobile = getSignupVerifiedMobile();
        const hasVerifiedSignup = verifiedSignupMobile.length === 10;

        if (hasVerifiedSignup) {
            setValue("phone", verifiedSignupMobile);
            setIsPhoneVerified(true);
            setPhoneOtpSent(false);
            setPhoneOtp("");
        }

        if (user) {
            setValue("name", user.name);
            const userMobileDigits =
                user.mobile_number != null && user.mobile_number !== ""
                    ? String(user.mobile_number).replace(/\D/g, "")
                    : "";

            if (!hasVerifiedSignup) {
                const phoneToShow =
                    userMobileDigits.length > 10 ? userMobileDigits.slice(-10) : userMobileDigits;
                setValue("phone", phoneToShow);
            }

            const digitsForApi = hasVerifiedSignup
                ? verifiedSignupMobile
                : userMobileDigits.length > 10
                    ? userMobileDigits.slice(-10)
                    : userMobileDigits;
            const apiSaysVerified = isSignupLeadMobileVerifiedByApi(user, digitsForApi);
            if (hasVerifiedSignup || apiSaysVerified) {
                if (digitsForApi.length === 10) {
                    setStoreMobileVerified(digitsForApi);
                }
                setIsPhoneVerified(true);
                setPhoneOtpSent(false);
                setPhoneOtp("");
            }
        }
    }, [user, setValue, setStoreMobileVerified]);

    const onSubmit = (data: FormData) => {
        // if (!token) {
        //     setMessage({ type: "error", content: "Sign Up Failed: No token found. Please try again." });
        //     sessionStorage.removeItem("token");
        //     navigate("/sign-up");
        //     return;
        // }

        const userData = {
            name: data?.name ?? '',
            email: userResponse?.email || "",
            dob: '',
            profilePic: `https://ui-avatars.com/api/?name=${data?.name}`,
            profile_pic_cdn: `https://ui-avatars.com/api/?name=${data?.name}`,
            first_name: data?.name?.split(' ')[0] || "",
            last_name: data?.name?.split(' ')[1] || "",
            gender: "",
            mobile_no: data?.phone || "",
            alternate_mobile_no: "",
            email_address: userResponse?.email || "",
            date_of_birth: "",
            db_code: "0",
            username: userResponse?.email || "",
            locale: "English",
            created_timezone: "UTC+05:30",
            wp_center_id: null,
            wp_course_id: null,
            platform_name: data?.platformName || "",
        }

        const pendingRedirect = new URLSearchParams(window.location.search).get('redirectUrl');
        if (pendingRedirect) {
            sessionStorage.setItem('signup_pending_redirect', pendingRedirect);
        }

        signUpMutation.mutate(userData);
    };

    const handleSendPhoneOtp = () => {
        // if (!phoneValue) {
        //     setPhoneVerifyError("Phone number is required.");
        //     return;
        // }
        if (!/^\d{10}$/.test(phoneDigits)) {
            setPhoneVerifyError("Enter a valid 10-digit phone number.");
            return;
        }
        setPhoneVerifyError("");
        setIsEditingPhone(false);
        sendMobileOtpMutation.mutate({ mobile_number: mobileNumberForOtp, digits: 4 });
    };

    const handleVerifyPhoneOtp = () => {
        if (phoneOtp.length !== MOBILE_OTP_LENGTH) {
            setPhoneVerifyError(`Please enter the ${MOBILE_OTP_LENGTH}-digit OTP.`);
            return;
        }
        verifyMobileOtpMutation.mutate({
            mobile_number: mobileNumberForOtp,
            otp: phoneOtp,
        });
    };

    const handleResendPhoneOtp = () => {
        if (sendMobileOtpMutation.isPending) return;
        sendMobileOtpMutation.mutate({ mobile_number: mobileNumberForOtp, digits: 4 });
    };

    const handleEditPhone = () => {
        clearSignupVerifiedMobile();
        setIsEditingPhone(true);
        setIsPhoneVerified(false);
        setPhoneOtpSent(false);
        setPhoneOtp("");
        setPhoneVerifyError("");
    };

    const handleCheckboxChange = () => {
        if (!acceptedEula) {
            setOpenEulaDialog(true);
        } else {
            setAcceptedEula(false);
        }
    };

    useEffect(() => {
        if (!isIndia) {
            setValue("state", "");
            setValue("city", "");
        }
    }, [isIndia, setValue]);

    useEffect(() => {
        const verifiedSignupMobile = getSignupVerifiedMobile();
        const digits = (phoneValue || "").replace(/\D/g, "");

        if (verifiedSignupMobile.length === 10 && matchesVerifiedMobile(digits)) {
            setIsPhoneVerified(true);
            setPhoneOtpSent(false);
            setPhoneOtp("");
            setPhoneVerifyError("");
            prevPhoneDigitsRef.current = digits.length > 10 ? digits.slice(-10) : digits;
            return;
        }

        if (user && isSignupLeadMobileVerifiedByApi(user, digits)) {
            setIsPhoneVerified(true);
            setPhoneOtpSent(false);
            setPhoneOtp("");
            setPhoneVerifyError("");
            prevPhoneDigitsRef.current = digits.length > 10 ? digits.slice(-10) : digits;
            return;
        }

        const prev = prevPhoneDigitsRef.current;
        if (prev !== null && prev !== digits) {
            setIsPhoneVerified(false);
            setPhoneOtpSent(false);
            setPhoneOtp("");
            setPhoneVerifyError("");
        }
        prevPhoneDigitsRef.current = digits;
    }, [phoneValue, selectedCountryCode, user, matchesVerifiedMobile]);

    return (
        <form className="flex flex-col gap-8 mt-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Row 1: Full Name + Platform Name */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <div>
                            <div className='relative'>
                                <Label className={`absolute top-1/2 -translate-y-1/2 left-8 font-[400] text-[#7C7C7C] text-base pointer-events-none ${field.value ? 'hidden' : ''}`}>
                                    Full Name<span className='text-[#FF1818]'>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    className="bg-[#101010] border-none text-white h-[52px] px-8 rounded-xl focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-[#7C7C7C]"
                                    autoComplete="name"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="platformName"
                    render={({ field }) => (
                        <div>
                            <div className='relative'>
                                <Label className={`absolute top-1/2 -translate-y-1/2 left-8 font-[400] text-[#7C7C7C] text-sm whitespace-nowrap pointer-events-none ${field.value ? 'hidden' : ''}`}>
                                    Choose Your Platform Name<span className='text-[#FF1818]'>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    className="bg-[#101010] border-none text-white h-[52px] px-8 rounded-xl focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-[#7C7C7C]"
                                    autoComplete="off"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </div>
                            {errors.platformName && <p className="text-red-500 text-sm mt-1">{errors.platformName.message}</p>}
                        </div>
                    )}
                />
            </div>

            {/* Row 2: Phone Number with Send OTP button */}
            <div className='flex flex-wrap'>
                <div className="flex flex-col md:flex-row gap-5 w-full">
                    <div className="flex gap-0 h-[52px] bg-[#101010] items-center px-4 md:px-8 rounded-xl w-full md:w-[calc(50%-10px)]">
                        <Select value={selectedCountryCode || "+91"} onValueChange={(value) => setValue("country_code", value)}>
                            <SelectTrigger className="w-[100px] h-[52px] bg-[#101010] rounded-xl border-none text-white focus:outline-none focus:ring-0 focus-visible:ring-0 p-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto bg-[#101010] border-gray-600 text-white">
                                {uniqueCountryCodes.map((country) => {
                                    const dialCode = country.dial_code.replace(/\s+/g, "");
                                    return (
                                        <SelectItem key={`${country.code}-${dialCode}`} value={dialCode}>
                                            {country.code} {dialCode}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        <span className='text-[#7C7C7C] text-base font-[400]'>|</span>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <div className='relative'>
                                    <Label className={`absolute top-1/2 -translate-y-1/2 left-2 font-[400] text-[#7C7C7C] text-base pointer-events-none ${field.value ? 'hidden' : ''}`}>
                                        Phone No
                                    </Label>
                                    <Input
                                        type="text"
                                        maxLength={10}
                                        className="bg-[#101010] border-none text-white h-[52px] px-2 rounded-xl flex-1 focus:outline-none focus:bg-[#101010] focus:ring-0 focus-visible:ring-0 placeholder:text-gray-500"
                                        autoComplete="tel"
                                        {...field}
                                        value={field.value ?? ""}
                                        disabled={phoneOtpSent && !isEditingPhone && !showPhoneVerifiedBadge}
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, "");
                                            field.onChange(digitsOnly);
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {showPhoneVerifiedBadge ? (
                        <div className="flex flex-1 w-full items-center gap-3">
                            <div className="flex h-[52px] items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 text-green-500">
                                <Check className="h-5 w-5" />
                                <span className="text-[16px] font-[700]">Verified</span>
                            </div>
                            <Button
                                type="button"
                                onClick={handleEditPhone}
                                className="h-[52px] rounded-2xl bg-[#323232] px-5 text-white hover:bg-[#3d3d3d]"
                                aria-label="Edit verified phone number"
                            >
                                <Pencil className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : phoneOtpSent ? (
                        <div className="w-full md:w-[calc(50%-10px)]">
                            <InputOTP
                                maxLength={MOBILE_OTP_LENGTH}
                                value={phoneOtp}
                                disabled={verifyMobileOtpMutation.isPending}
                                onChange={setPhoneOtp}
                            >
                                <InputOTPGroup className="flex gap-3 w-full justify-between rounded-xl">
                                    {Array.from({ length: MOBILE_OTP_LENGTH }).map((_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="bg-[#101010] border-none rounded-xl text-white text-center text-lg w-[77.11px] h-[52px] focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            <div className="mt-4 flex items-start justify-between gap-3">
                                {countdown > 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Resend OTP in {countdown}s
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        className="text-sm text-[#00A8E9] underline"
                                        onClick={handleResendPhoneOtp}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                                <Button
                                    type="button"
                                    onClick={phoneOtpSent && !showPhoneVerifiedBadge ? handleVerifyPhoneOtp : handleSendPhoneOtp}
                                    // disabled={
                                    //     (!phoneValue || phoneDigits.length !== 10 || showPhoneVerifiedBadge || sendMobileOtpMutation.isPending) &&
                                    //     !(phoneOtpSent && !showPhoneVerifiedBadge)
                                    // }
                                    className="bg-[#7FC142] hover:bg-[#6ec847] text-black text-[20px] font-[700] h-[52px] px-8 rounded-2xl"
                                >
                                    {phoneOtpSent && !showPhoneVerifiedBadge
                                        ? (verifyMobileOtpMutation.isPending ? "Verifying..." : "Verify OTP")
                                        : (sendMobileOtpMutation.isPending ? "Sending..." : "Send OTP")
                                    }
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-1 w-full'>
                            <Button
                                type="button"
                                onClick={phoneOtpSent && !showPhoneVerifiedBadge ? handleVerifyPhoneOtp : handleSendPhoneOtp}
                                disabled={
                                    (!phoneValue || phoneDigits.length !== 10 || showPhoneVerifiedBadge || sendMobileOtpMutation.isPending) &&
                                    !(phoneOtpSent && !showPhoneVerifiedBadge)
                                }
                                className="bg-[#7FC142] hover:bg-[#6ec847] text-black text-[20px] font-[700] h-[52px] px-8 rounded-2xl"
                            >
                                {phoneOtpSent && !showPhoneVerifiedBadge
                                    ? (verifyMobileOtpMutation.isPending ? "Verifying..." : "Verify OTP")
                                    : (sendMobileOtpMutation.isPending ? "Sending..." : "Send OTP")
                                }
                            </Button>
                        </div>
                    )}
                </div>
                {phoneVerifyError && <p className="text-red-500 text-sm mt-2">{phoneVerifyError}</p>}
                {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>)}
            </div>

            {/* Row 3: Country, State, City */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div>
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => {
                            const selected = countries?.find(c => c.id.toString() === field.value?.toString());
                            return (
                                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={loadingCountries}
                                            aria-expanded={openCountry}
                                            className="w-full h-[52px] justify-between focus-visible:ring-0 text-white bg-[#101010] border-none hover:bg-[#101010] rounded-xl"
                                        >
                                            {selected?.name || <span className={`font-[400] text-[#7C7C7C] text-base pointer-events-none`}>
                                                Country<span className='text-[#FF1818]'>*</span>
                                            </span>}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 bg-[#101010] border-none text-white">
                                        <Command className="bg-[#101010] text-white">
                                            <CommandInput placeholder="Search country..." className="h-9 bg-[#101010] text-white border-none" />
                                            <CommandList className="bg-[#101010] text-white">
                                                <CommandEmpty className="text-white">No country found.</CommandEmpty>
                                                {countries?.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                                                    <CommandItem
                                                        key={country.id}
                                                        value={country.name}
                                                        onSelect={() => { field.onChange(country.id.toString()); setOpenCountry(false); }}
                                                        className="text-white hover:bg-gray-800"
                                                    >
                                                        {country.name}
                                                        <Check className={cn("ml-auto h-4 w-4", field.value == country.id.toString() ? "opacity-100" : "opacity-0")} />
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            );
                        }}
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                </div>

                <div>
                    {!isIndia ? (
                        <Controller
                            control={control}
                            name="state"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="State"
                                    className="w-full h-[52px] bg-[#101010] border-none text-white rounded-xl focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-gray-500"
                                />
                            )}
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="state"
                            render={({ field }) => {
                                const selected = states?.find(s => s.id.toString() === field.value?.toString());
                                return (
                                    <Popover open={openState} onOpenChange={setOpenState}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                disabled={loadingStates || !selectedCountry || !states?.length}
                                                aria-expanded={openState}
                                                className={`w-full h-[52px] justify-between focus-visible:ring-0 bg-[#101010] border-none hover:bg-[#101010] rounded-xl ${selected?.name ? "text-white" : "text-[#7C7C7C]"}`}
                                            >
                                                {selected?.name || "State"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-[#101010] border-none text-white">
                                            <Command className="bg-[#101010] text-white">
                                                <CommandInput placeholder="Search state..." className="h-9 bg-[#101010] text-white border-none" />
                                                <CommandList className="bg-[#101010] text-white">
                                                    <CommandEmpty className="text-white">No state found.</CommandEmpty>
                                                    {states
                                                        ?.sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((state) => (
                                                            <CommandItem
                                                                key={state.id}
                                                                value={state.name}
                                                                onSelect={() => { field.onChange(state.id.toString()); setOpenState(false) }}
                                                                className="text-white hover:bg-gray-800"
                                                            >
                                                                {state.name}
                                                                <Check className={cn("ml-auto h-4 w-4", field.value === state.id.toString() ? "opacity-100" : "opacity-0")} />
                                                            </CommandItem>
                                                        ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                    )}
                </div>

                <div>
                    {!isIndia ? (
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="City"
                                    className="w-full h-[52px] bg-[#101010] border-none text-white rounded-xl focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-gray-500"
                                />
                            )}
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => {
                                const selected = cities?.find(c => c.id.toString() === field.value?.toString());
                                return (
                                    <Popover open={openCity} onOpenChange={setOpenCity}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                disabled={loadingCities || !selectedState || !cities?.length}
                                                aria-expanded={openCity}
                                                className={`w-full h-[52px] justify-between focus-visible:ring-0 text-[#7C7C7C] bg-[#101010] border-none hover:bg-[#101010] rounded-xl ${selected?.name ? "text-white" : "text-[#7C7C7C]"}`}
                                            >
                                                {selected?.name || "City"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-[#101010] border-none text-white">
                                            <Command className="bg-[#101010] text-white">
                                                <CommandInput placeholder="Search city..." className="h-9 bg-[#101010] text-white border-none" />
                                                <CommandList className="bg-[#101010] text-white">
                                                    <CommandEmpty className="text-white">No city found.</CommandEmpty>
                                                    {cities
                                                        ?.sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((city) => (
                                                            <CommandItem
                                                                key={city.id}
                                                                value={city.name}
                                                                onSelect={() => { field.onChange(city.id.toString()); setOpenCity(false); }}
                                                                className="text-white hover:bg-gray-800"
                                                            >
                                                                {city.name}
                                                                <Check className={cn("ml-auto h-4 w-4", field.value === city.id.toString() ? "opacity-100" : "opacity-0")} />
                                                            </CommandItem>
                                                        ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                    )}
                </div>
            </div>

            {/* EULA Agreement and Continue Button */}
            <div className="mt-4 flex flex-col items-start justify-start space-y-4 gap-4">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="eula"
                        checked={acceptedEula}
                        onCheckedChange={handleCheckboxChange}
                        className="border-2 border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white w-5 h-5"
                    />
                    <label htmlFor="eula" className="text-sm text-white cursor-pointer whitespace-nowrap">
                        I have read and agree to the{" "}
                        <button
                            type="button"
                            className="text-[#00A8E9] underline hover:text-[#00A8E9]/80 font-[700] whitespace-nowrap"
                            onClick={(e) => { e.stopPropagation(); setOpenEulaDialog(true); }}
                        >
                            End User License Agreement (EULA)
                        </button>
                    </label>
                </div>

                {message.content && (
                    <div>
                        <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>{message.content}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={!acceptedEula || signUpMutation.isPending}
                    className={`group relative inline-flex h-[80px] w-[168px] items-center justify-center
             rounded-2xl border border-[#2C2C2C] m-auto
             shadow-md transition-all duration-200 focus:outline-none
             focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9] ${acceptedEula && !signUpMutation.isPending ? "bg-[#FFEC00] text-black hover:brightness-95" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                >
                    <div className="flex flex-col items-center justify-center gap-2 text-[20px] font-[700]">
                        <LogIn className="h-6 w-6 min-w-[23px] min-h-[23px]" />
                        {signUpMutation?.isPending && <Loader className="inline-block mr-2 h-4 w-4 animate-spin text-black" />}
                        {signUpMutation.isPending ? "Processing..." : "Continue"}
                    </div>
                </Button>
            </div>

            <EulaModal
                isOpen={openEulaDialog}
                onClose={() => setOpenEulaDialog(false)}
                onAgree={() => setAcceptedEula(true)}
            />
        </form>
    );
};

export default PersonalInfoForm;
