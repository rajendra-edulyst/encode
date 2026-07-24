import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Check, ChevronsUpDown, Loader, Pencil } from 'lucide-react';
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
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    phone: z
        .string()
        .optional()
        .transform((val) => val?.trim() || ""),
    alternateEmail: z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), {
            message: "Enter a valid alternate email address",
        }),
    country_code: z.string().optional(),
    pinCode: z.string().optional().transform((val) => val?.trim() || "").refine((val) => val === "" || /^\d{6}$/.test(val), {
        message: "Enter a valid pin code",
    }),
    hearAboutUs: z.string().optional(),
    address: z.string().optional(),
});


// add email_token
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

    // Fetch hooks
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
            state: "",
            city: "",
            phone: "",
            alternateEmail: "",
            country_code: "+91",
            pinCode: "",
            hearAboutUs: "",
            address: "",
        },
    });

    const selectedCountry = watch("country");
    const selectedState = watch("state");
    const selectedCountryCode = watch("country_code");
    const phoneValue = watch("phone");

    const { data: countries = [], isLoading: loadingCountries } = useCountries();
    const { data: states = [], isLoading: loadingStates } = useStates(selectedCountry);
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedState);

    // Fetch user data from token
    const { data: userResponse } = userSignUpData(token);
    const user = useMemo(() => userResponse?.data, [userResponse]);
    const { signUp } = useAuth()
    const queryClient = useQueryClient();
    const storeVerifiedMobile = useSignupVerificationStore((s) => s.verifiedMobile);
    const matchesVerifiedMobile = useSignupVerificationStore((s) => s.matchesVerifiedMobile);
    const markVerifiedFromApi = useSignupVerificationStore((s) => s.markVerifiedFromApiResponse);
    const setStoreMobileVerified = useSignupVerificationStore((s) => s.setMobileVerified);


    // Determine if country = India
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

    // Sign-up mutation
    // const signUpMutation = useMutation({
    //     mutationFn: signUpRequest,
    //     onSuccess: (data) => {
    //         if (data.status === 0) {
    //             setMessage({ type: "error", content: data.message || "Sign Up Failed. Please try again." });
    //             return;
    //         }
    //         setMessage({ type: "success", content: "Your profile has been successfully created." });
    //         queryClient.invalidateQueries({ queryKey: ["signUpTokenData"] });
    //         navigate("/reference-number");
    //     },
    //     onError: (err: unknown) => {
    //         const error = err as AxiosError<{ error?: string, errors?: Record<string, string[]> }>;
    //         console.log("Sign Up Error:", error);
    //         if (error.response?.data?.errors) {
    //             setMessage({
    //                 type: "error", content: error.response?.data?.error || (error.response?.data?.errors ? Object.values(error.response?.data?.errors).flat().join(" ") : "Something went wrong, please try again later."),
    //             });
    //             return;
    //         }
    //         if (error.response?.data?.error) {
    //             setMessage({ type: "error", content: error.response?.data?.error || "Something went wrong, please try again later." });
    //         }
    //     },
    // });

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

    // Default country: India
    useEffect(() => {
        if (countries.length) {
            const india = countries.find((c) => c.name.toLowerCase() === "india");
            if (india) setValue("country", india.id.toString());
        }
    }, [countries, setValue]);


    // Pre-fill from signup lead API. Verified mobile from signup OTP is in sessionStorage — apply it
    // even before token/lead load so redirect from /sign-up always shows number + badge.
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
    }, [user, setValue, storeVerifiedMobile, setStoreMobileVerified]);

    // Submit handler
    const onSubmit = (data: FormData) => {
        if (!token) {
            setMessage({ type: "error", content: "Sign Up Failed: No token found. Please try again." });
            sessionStorage.removeItem("token");
            navigate("/sign-up");
            return;
        }

        // const newData = {
        //     name: data.name,
        //     profile_image: profilePic,
        //     email_token: token,
        //     mobile_no: data.phone,
        //     type: "designer",
        //     data: {
        //         ...data,
        //     },
        // };
        // signUpMutation.mutate(newData);


        const userData = {
            name: data?.name ?? '',
            // password: 'BoQ28iFzUPYHEHO',
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
            wp_course_id: null
        }

        // Persist redirectUrl before async signup so it's available after auto-login
        const pendingRedirect = new URLSearchParams(window.location.search).get('redirectUrl');
        if (pendingRedirect) {
            sessionStorage.setItem('signup_pending_redirect', pendingRedirect);
        }

        signUpMutation.mutate(userData);

    };

    const handleSendPhoneOtp = () => {
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
            // Not yet accepted — open EULA modal first; agree inside modal will set acceptedEula
            setOpenEulaDialog(true);
        } else {
            // Already accepted — allow unchecking
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
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4'>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <div>
                            <Label className="font-semibold text-white text-base">Full Name<span className='text-red-500'>*</span></Label>
                            <Input type="text" placeholder='Type your name' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0" autoComplete="name" {...field} value={field.value ?? ""} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Label className="font-semibold text-white text-base">Phone Number</Label>
                                {showPhoneVerifiedBadge && (
                                    <span className="text-xs font-semibold uppercase tracking-wide text-green-500">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex">
                                <Select value={selectedCountryCode || "+91"} onValueChange={(value) => setValue("country_code", value)}>
                                    <SelectTrigger className="w-[100px] mt-1 rounded-l-md focus:outline-none focus:ring-0 focus-visible:ring-0 border rounded-r-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {uniqueCountryCodes.map((country) => {
                                            const dialCode = country.dial_code.replace(/\s+/g, "");
                                            return (
                                                <SelectItem key={`${country.code}-${dialCode}`} value={dialCode}>
                                                    {country.code} {dialCode}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                <div className="relative w-full">
                                    <Input type="text" placeholder="Type your phone number" maxLength={10} className="text-white mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0 pr-24" autoComplete="tel" {...field} value={field.value ?? ""} disabled={phoneOtpSent && !isEditingPhone && !showPhoneVerifiedBadge}
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, "");
                                            field.onChange(digitsOnly);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendPhoneOtp}
                                        disabled={!phoneValue || phoneDigits.length !== 10 || showPhoneVerifiedBadge || sendMobileOtpMutation.isPending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#00A8E9] underline underline-offset-2 disabled:text-gray-500 disabled:no-underline"
                                    >
                                        {sendMobileOtpMutation.isPending ? "Sending..." : "Verify"}
                                    </button>
                                </div>
                            </div>
                            {phoneOtpSent && !showPhoneVerifiedBadge && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={handleEditPhone}
                                        className="inline-flex items-center gap-1 text-xs text-[#00A8E9] hover:underline"
                                        aria-label="Edit mobile number"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit number
                                    </button>
                                </div>
                            )}
                            {phoneOtpSent && !showPhoneVerifiedBadge && (
                                <div className="mt-3">
                                    <InputOTP
                                        maxLength={MOBILE_OTP_LENGTH}
                                        value={phoneOtp}
                                        disabled={verifyMobileOtpMutation.isPending}
                                        onChange={setPhoneOtp}
                                    >
                                        <InputOTPGroup className="flex gap-2 w-full">
                                            {Array.from({ length: MOBILE_OTP_LENGTH }).map((_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="border rounded-sm ring-[#00A8E9] w-full text-center text-lg border-gray-500"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Button
                                            type="button"
                                            onClick={handleVerifyPhoneOtp}
                                            disabled={verifyMobileOtpMutation.isPending}
                                            className="text-white"
                                        >
                                            {verifyMobileOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                                        </Button>
                                        {countdown > 0 ? (
                                            <p className="text-sm text-gray-500">
                                                Resend OTP in {countdown}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="text-sm text-primary underline"
                                                onClick={handleResendPhoneOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {phoneVerifyError && <p className="text-red-500 text-sm mt-2">{phoneVerifyError}</p>}
                            {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>)}
                        </div>
                    )}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                <Controller
                    control={control}
                    name="alternateEmail"
                    render={({ field }) => (
                        <div>
                            <Label className="font-semibold text-white text-base">Alternative Email</Label>
                            <Input type="text" placeholder='Type your alternative email' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0" autoComplete="email" {...field} value={field.value ?? ""} />
                            {errors.alternateEmail && <p className="text-red-500 text-sm mt-1">{errors.alternateEmail.message}</p>}
                        </div>
                    )}
                />
                <div>
                    <Label htmlFor="country" className="block mb-2 font-semibold text-white text-base">
                        Country<span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => {
                            const selected = countries?.find(c => c.id.toString() === field.value?.toString());
                            return (
                                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" disabled={loadingCountries} aria-expanded={openCountry} className="w-full justify-between focus-visible:ring-0 text-white">{selected?.name || "Select country..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search country..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No country found.</CommandEmpty>
                                                {countries?.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (<CommandItem key={country.id} value={country.name} onSelect={() => { field.onChange(country.id.toString()); setOpenCountry(false); }}>{country.name} <Check className={cn("ml-auto h-4 w-4", field.value == country.id.toString() ? "opacity-100" : "opacity-0")} /></CommandItem>))}
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
                    <Label htmlFor="state" className="block mb-2 font-semibold text-white text-base">State<span className='text-red-500'>*</span></Label>
                    {!isIndia ? (
                        <Controller
                            control={control}
                            name="state"
                            render={({ field }) => (
                                <div>
                                    <Input {...field} value={field.value ?? ""} placeholder="Enter your state" className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0" />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                                </div>
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
                                            <Button variant="outline" role="combobox" disabled={loadingStates || !selectedCountry || !states?.length} aria-expanded={openState} className="w-full justify-between focus-visible:ring-0 text-white">{selected?.name || "Select state..."} <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search state..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No state found.</CommandEmpty>
                                                    {states
                                                        ?.sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((state) => (
                                                            <CommandItem key={state.id} value={state.name} onSelect={() => { field.onChange(state.id.toString()); setOpenState(false) }}>
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
                    <Label htmlFor="city" className="block mb-2 font-semibold text-white text-base">
                        City<span className='text-red-500'>*</span>
                    </Label>
                    {!isIndia ? (
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <div>
                                    <Input {...field} value={field.value ?? ""} placeholder="Enter your city" className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0" />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                                </div>
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
                                            <Button variant="outline" role="combobox" disabled={loadingCities || !selectedState || !cities?.length} aria-expanded={openCity} className="w-full justify-between focus-visible:ring-0 text-white">{selected?.name || "Select city..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search city..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No city found.</CommandEmpty>
                                                    {cities
                                                        ?.sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((city) => (
                                                            <CommandItem key={city.id} value={city.name} onSelect={() => { field.onChange(city.id.toString()); setOpenCity(false); }}> {city.name} <Check className={cn("ml-auto h-4 w-4", field.value === city.id.toString() ? "opacity-100" : "opacity-0")} /></CommandItem>
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
                <Controller
                    control={control}
                    name="pinCode"
                    render={({ field }) => (
                        <div>
                            <Label className="font-semibold text-white text-base">Pin Code</Label>
                            <Input type="text" placeholder='Write your pincode' className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 text-white" {...field} value={field.value ?? ""} />
                            {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
                        </div>
                    )}
                />
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Controller
                        control={control}
                        name="hearAboutUs"
                        render={({ field }) => (
                            <div>
                                <Label htmlFor="hearAboutUs" className="block mb-2 font-semibold text-white text-base">
                                    From where did you hear about us <span className="text-red-500">*</span>
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 text-white">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Google Search">Google Search</SelectItem>
                                        <SelectItem value="Friends/Colleague">Friends/Colleague</SelectItem>
                                        <SelectItem value="Social Media">Social Media</SelectItem>
                                        <SelectItem value="Youtube">Youtube</SelectItem>
                                        <SelectItem value="Events/Conference">Events/Conference</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs.message}</p>}
                            </div>
                        )}
                    />
                </div>
            </div>
            {/* EULA Agreement */}
            <div className="mt-6 flex flex-col items-start justify-start space-y-4">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="eula"
                        checked={acceptedEula}
                        onCheckedChange={handleCheckboxChange}
                        className="border-2 border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white w-5 h-5"
                    />
                    <label htmlFor="eula" className="text-sm text-white cursor-pointer">
                        I have read and agree to the{" "}
                        <button
                            type="button"
                            className="text-primary dark:text-cblue underline hover:text-primary/80"
                            onClick={(e) => { e.stopPropagation(); setOpenEulaDialog(true); }}
                        >
                            End User License Agreement (EULA)
                        </button>
                    </label>
                </div>
                {/* Continue Button */}
                {message && <div>
                    <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>{message.content}</p>
                </div>}
                <Button
                    type="submit"
                    disabled={!acceptedEula || signUpMutation.isPending}
                    className={`w-full rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 ${acceptedEula ? "bg-[#d63384] hover:bg-[#b02a5b] text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                >
                    {signUpMutation?.isPending && <Loader className="inline-block mr-2 h-4 w-4 animate-spin text-white" />}
                    {signUpMutation.isPending ? "Processing..." : "Continue"}
                </Button>
            </div>

            {/* EULA Modal */}
            <EulaModal
                isOpen={openEulaDialog}
                onClose={() => setOpenEulaDialog(false)}
                onAgree={() => setAcceptedEula(true)}
            />
        </form>
    );
};

export default PersonalInfoForm;