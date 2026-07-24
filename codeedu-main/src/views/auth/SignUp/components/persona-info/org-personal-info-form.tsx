import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Check, ChevronsUpDown, Loader, LogIn, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
import { useForm, Controller } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import countryCodes from '@/data/countryCode';
import { useCities, useCountries, useStates } from '@/hooks/data/useLocation';
import { useMutation } from '@tanstack/react-query';
import EulaModal from '../eula/EulaModal';
import { AxiosError } from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { createOrganization } from '@/services/organization.service';
import { useSetAuth } from '@/auth/auth.helper';
import { successToast, errorToast } from '@/views/auth/@lib/toastUtils';

// Schema matching the image fields
const formSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    platformName: z.string().min(1, "Platform Name is required"),
    phone: z.string().regex(/^\d*$/, "Only digits allowed").optional(),
    countryCode: z.string().optional().default("+91"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
});

type FormData = z.infer<typeof formSchema>;

// Mock OTP API – replace with actual endpoints
const sendOtpApi = async (phone: string, countryCode: string) => {
    const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
    return data;
};

const verifyOtpApi = async (phone: string, otp: string) => {
    const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid OTP');
    return data;
};

const OrgPersonalInfoForm = () => {
    const [openCountry, setOpenCountry] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [acceptedEula, setAcceptedEula] = useState(false);
    const [openEulaDialog, setOpenEulaDialog] = useState(false);

    // OTP states
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { setAuth } = useSetAuth();

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            countryCode: "+91",
            phone: "",
            fullName: "",
            platformName: "",
            country: "",
            state: "",
            city: "",
        },
    });

    const selectedCountry = watch("country");
    const selectedState = watch("state");
    const selectedCountryCode = watch("countryCode");
    const phoneNumber = watch("phone");

    const { data: countries = [], isLoading: loadingCountries } = useCountries();
    const { data: states = [], isLoading: loadingStates } = useStates(selectedCountry);
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedState);

    const selectedCountryObj = useMemo(() => countries.find((c) => c.id.toString() === selectedCountry?.toString()), [countries, selectedCountry]);
    const isIndia = selectedCountryObj?.name?.toLowerCase() === "india";

    // Unique country codes for phone prefix dropdown
    const uniqueCountryCodes = useMemo(() => {
        const seen = new Set<string>();
        return countryCodes.filter((country) => {
            const dialCode = country.dial_code.replace(/\s+/g, "");
            if (seen.has(dialCode)) return false;
            seen.add(dialCode);
            return true;
        });
    }, []);

    // OTP mutations
    const sendOtpMutation = useMutation({
        mutationFn: () => sendOtpApi(phoneNumber || "", selectedCountryCode || "+91"),
        onSuccess: () => {
            setOtpSent(true);
            setResendTimer(30);
            successToast("OTP Sent", "Verification code has been sent to your phone.");
            // Start countdown
            const interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            errorToast("Failed to send OTP", err.response?.data?.message || "Please try again.");
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: () => verifyOtpApi(phoneNumber || "", otpValue),
        onSuccess: () => {
            setIsOtpVerified(true);
            successToast("Phone Verified", "Your phone number has been verified.");
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            errorToast("Invalid OTP", err.response?.data?.message || "Please check the code and try again.");
        },
    });

    // Create organization mutation (final step)
    const createOrgMutation = useMutation({
        mutationFn: (data: any) => createOrganization(data),
        onSuccess: (data) => {
            if (data.status === 0) {
                errorToast("Registration Failed", data.message || "Something went wrong.");
                return;
            }
            if (data?.status === 1) {
                const response = {
                    token: data.data.token,
                    user: data.data.user,
                };
                if (response) {
                    setAuth(response);
                    successToast("Registration Successful", "You have successfully registered and logged in.");
                }
            }
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            errorToast("Registration Failed", err.response?.data?.message || "Please try again later.");
        },
    });

    // Auto-select India as default country when countries load
    useEffect(() => {
        if (countries.length) {
            const india = countries.find((c) => c.name.toLowerCase() === "india");
            if (india) setValue("country", india.id.toString());
        }
    }, [countries, setValue]);

    // Reset state/city when country changes (for non-India free text)
    useEffect(() => {
        if (!isIndia) {
            setValue("state", "");
            setValue("city", "");
        }
    }, [isIndia, setValue]);

    const handleSendOtp = () => {
        if (!phoneNumber) {
            errorToast("Phone required", "Please enter your phone number first.");
            return;
        }
        if (phoneNumber.length < 6) {
            errorToast("Invalid phone", "Phone number must be at least 6 digits.");
            return;
        }
        sendOtpMutation.mutate();
    };

    const handleVerifyOtp = () => {
        if (!otpValue) {
            errorToast("OTP required", "Please enter the verification code.");
            return;
        }
        verifyOtpMutation.mutate();
    };

    const onSubmit = (data: FormData) => {
        if (!acceptedEula) {
            errorToast("EULA required", "Please accept the End User License Agreement.");
            return;
        }
        if (data.phone && !isOtpVerified) {
            errorToast("Phone not verified", "Please verify your phone number first.");
            return;
        }

        const email = sessionStorage.getItem('accountEmail') || '';

        const orgData = {
            name: data.fullName,
            short_name: data.platformName,
            mobile_number: data.phone,
            country_id: data.country,
            state_id: data.state,
            city: data.city,
            email,
        };
        createOrgMutation.mutate(orgData);
    };

    const handleCheckboxChange = () => {
        if (!acceptedEula) {
            setOpenEulaDialog(true);
        } else {
            setAcceptedEula(false);
        }
    };

    return (
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Row 1: Full Name and Platform Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder=""
                                className="text-white bg-[#101010] mt-1 focus:outline-none focus:ring-0 font-[16px] focus-visible:ring-0 h-[52px] rounded-xl border-none"
                                autoComplete="name"
                                {...field}
                            />
                            {!field.value && (
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                                    <span className="text-muted-foreground font-normal text-[16px]">Full Name <span className="text-red-500">*</span></span>
                                </div>
                            )}
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="platformName"
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder=""
                                className="text-white bg-[#101010] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 h-[52px] rounded-xl border-none"
                                {...field}
                            />
                            {!field.value && (
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                                    <span className="text-muted-foreground font-normal text-[16px]">Choose Your Platform Name <span className="text-red-500">*</span></span>
                                </div>
                            )}
                            {errors.platformName && <p className="text-red-500 text-sm mt-1">{errors.platformName.message}</p>}
                        </div>
                    )}
                />
            </div>

            {/* Row 2: Phone with country code + Send OTP button */}
            <div className="flex flex-col md:flex-row gap-5 w-full items-start">
                <div className="flex flex-col w-full md:w-[calc(66%-10px)]">
                    <div className="flex gap-0 h-[52px] bg-[#101010] items-center px-4 md:px-8 rounded-xl w-full">
                        <Controller
                            control={control}
                            name="countryCode"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[100px] h-[52px] bg-[#101010] border-none rounded-xl text-white focus:ring-0 focus-visible:ring-0 px-0">
                                        <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto bg-[#101010] border-gray-700">
                                        {uniqueCountryCodes.map((country) => {
                                            const dialCode = country.dial_code.replace(/\s+/g, "");
                                            return (
                                                <SelectItem key={`${country.code}-${dialCode}`} value={dialCode} className="text-white">
                                                    {country.code} {dialCode}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <span className='text-[#7C7C7C] text-base font-[400] mx-2'>|</span>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <div className="flex-1">
                                    <Input
                                        type="tel"
                                        placeholder="Phone No"
                                        className="text-white bg-[#101010] focus:outline-none focus:ring-0 focus-visible:ring-0 h-[52px] border-none px-2"
                                        autoComplete="tel"
                                        {...field}
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, "");
                                            field.onChange(digitsOnly);
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div className="w-full md:w-[calc(33%-10px)]">
                    <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendOtpMutation.isPending || resendTimer > 0 || isOtpVerified}
                        className="h-[52px] w-full bg-[#7FC142] hover:bg-[#6ec847] text-black text-[20px] font-[700] rounded-xl flex items-center justify-center gap-2"
                    >
                        {sendOtpMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : null}
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Send OTP"}
                    </Button>
                </div>
            </div>

            {/* OTP Section (shown after send) */}
            {otpSent && !isOtpVerified && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                            className="text-white bg-[#101010] h-[52px] rounded-xl border-none"
                            maxLength={6}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyOtpMutation.isPending}
                        className="h-[52px] bg-codeyellow hover:bg-codeyellow/80 text-black rounded-xl"
                    >
                        {verifyOtpMutation.isPending ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                        Verify OTP
                    </Button>
                </div>
            )}

            {/* Row 3: Country, State, City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country */}
                <div>
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => {
                            const selected = countries?.find(c => c.id.toString() === field.value?.toString());
                            return (
                                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                    <PopoverTrigger asChild className="h-[52px]">
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={loadingCountries}
                                            aria-expanded={openCountry}
                                            className="w-full justify-between bg-[#101010] border-none text-white hover:bg-[#1a1a1a] rounded-xl focus-visible:ring-0 font-[16px]"
                                        >
                                            {selected?.name || (
                                                <span className="text-muted-foreground font-normal">
                                                    Country <span className="text-red-500">*</span>
                                                </span>
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 bg-[#101010] border-gray-700">
                                        <Command>
                                            <CommandInput placeholder="Search country..." className="text-white" />
                                            <CommandList>
                                                <CommandEmpty>No country found.</CommandEmpty>
                                                {countries?.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                                                    <CommandItem
                                                        key={country.id}
                                                        value={country.name}
                                                        onSelect={() => {
                                                            field.onChange(country.id.toString());
                                                            setOpenCountry(false);
                                                        }}
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        placeholder=""
                                        className="text-white bg-[#101010] h-[52px] rounded-xl border-none focus:ring-0 font-[16px]"
                                    />
                                    {!field.value && (
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-muted-foreground font-normal text-[16px]">State <span className="text-red-500">*</span></span>
                                        </div>
                                    )}
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
                                        <PopoverTrigger asChild className="h-[52px]">
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                disabled={loadingStates || !selectedCountry || !states?.length}
                                                aria-expanded={openState}
                                                className="w-full justify-between bg-[#101010] border-none text-white hover:bg-[#1a1a1a] rounded-xl font-[16px]"
                                            >
                                                {selected?.name || (
                                                    <span className="text-muted-foreground font-normal">
                                                        State <span className="text-red-500">*</span>
                                                    </span>
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-[#101010] border-gray-700">
                                            <Command>
                                                <CommandInput placeholder="Search state..." className="text-white" />
                                                <CommandList>
                                                    <CommandEmpty>No state found.</CommandEmpty>
                                                    {states?.sort((a, b) => a.name.localeCompare(b.name)).map((state) => (
                                                        <CommandItem
                                                            key={state.id}
                                                            value={state.name}
                                                            onSelect={() => {
                                                                field.onChange(state.id.toString());
                                                                setOpenState(false);
                                                            }}
                                                            className="text-white"
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

                {/* City */}
                <div>
                    {!isIndia ? (
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <div className="relative">
                                    <Input
                                        {...field}
                                        placeholder=""
                                        className="text-white bg-[#101010] h-[52px] rounded-xl border-none focus:ring-0 font-[16px]"
                                    />
                                    {!field.value && (
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-muted-foreground font-normal text-[16px]">City <span className="text-red-500">*</span></span>
                                        </div>
                                    )}
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
                                        <PopoverTrigger asChild className="h-[52px]">
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                disabled={loadingCities || !selectedState || !cities?.length}
                                                aria-expanded={openCity}
                                                className="w-full justify-between bg-[#101010] border-none text-white hover:bg-[#1a1a1a] rounded-xl font-[16px]"
                                            >
                                                {selected?.name || (
                                                    <span className="text-muted-foreground font-normal">
                                                        City <span className="text-red-500">*</span>
                                                    </span>
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-[#101010] border-gray-700">
                                            <Command>
                                                <CommandInput placeholder="Search city..." className="text-white" />
                                                <CommandList>
                                                    <CommandEmpty>No city found.</CommandEmpty>
                                                    {cities?.sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
                                                        <CommandItem
                                                            key={city.id}
                                                            value={city.name}
                                                            onSelect={() => {
                                                                field.onChange(city.id.toString());
                                                                setOpenCity(false);
                                                            }}
                                                            className="text-white"
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

            {/* EULA Agreement */}
            <div className="mt-6 flex flex-col items-start justify-start space-y-4">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="eula"
                        checked={acceptedEula}
                        onCheckedChange={handleCheckboxChange}
                        className="border-2 border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white w-5 h-5"
                    />
                    <label htmlFor="eula" className="text-sm text-white whitespace-nowrap">
                        I have read and agree to the{" "}
                        <button
                            type="button"
                            className="text-primary underline hover:text-primary/80 whitespace-nowrap"
                            onClick={(e) => { e.preventDefault(); setOpenEulaDialog(true); }}
                        >
                            End User License Agreement (EULA)
                        </button>
                    </label>
                </div>

                {/* Continue Button */}
                <div className="flex items-center justify-center w-full mt-4">
                    <Button
                        type="submit"
                        disabled={!acceptedEula || (!!phoneNumber && !isOtpVerified) || createOrgMutation.isPending}
                        className={`group relative inline-flex h-[80px] w-[168px] items-center justify-center
             rounded-2xl border border-[#2C2C2C] m-auto
             shadow-md transition-all duration-200 focus:outline-none
             focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E9] ${acceptedEula && (!phoneNumber || isOtpVerified) && !createOrgMutation.isPending ? "bg-[#FFEC00] text-black hover:brightness-95" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                    >
                        <div className="flex flex-col items-center justify-center gap-2">
                            {createOrgMutation.isPending ? <Loader className="h-6 w-6 animate-spin" /> : <LogIn className="h-6 w-6" />}
                            <span className="text-[20px] font-bold sm:text-[20px]">{createOrgMutation.isPending ? "Processing..." : "Continue"}</span>
                        </div>
                    </Button>
                </div>
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

export default OrgPersonalInfoForm;