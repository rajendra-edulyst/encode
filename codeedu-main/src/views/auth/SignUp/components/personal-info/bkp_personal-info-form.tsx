import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EulaContent } from '../eula/content';
import { signUpRequest } from '@/services/AuthService';
import { AxiosError } from 'axios';
import { userSignUpData } from '@/views/auth/@hooks/useAuth';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    phone: z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((val) => val === "" || /^\d{10}$/.test(val), {
            message: "Enter a valid 10 digits phone number",
        }),
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

    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    // Fetch hooks
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const selectedCountry = watch("country");
    const selectedState = watch("state");
    const selectedCountryCode = watch("country_code");

    const { data: countries = [], isLoading: loadingCountries } = useCountries();
    const { data: states = [], isLoading: loadingStates } = useStates(selectedCountry);
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedState);

    // Fetch user data from token
    const { data: userResponse } = userSignUpData(token);
    const user = useMemo(() => userResponse?.data, [userResponse]);


    // Determine if country = India
    const selectedCountryObj = useMemo(() => countries.find((c) => c.id.toString() === selectedCountry?.toString()), [countries, selectedCountry]);
    const isIndia = selectedCountryObj?.name?.toLowerCase() === "india";

    // Sign-up mutation
    const signUpMutation = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            if (data.status === 0) {
                setMessage({ type: "error", content: data.message || "Sign Up Failed. Please try again." });
                return;
            }
            setMessage({ type: "success", content: "Your profile has been successfully created." });
            queryClient.invalidateQueries({ queryKey: ["signUpTokenData"] });
            navigate("/reference-number");
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ error?: string, errors?: Record<string, string[]> }>;
            console.log("Sign Up Error:", error);
            if (error.response?.data?.errors) {
                setMessage({
                    type: "error", content: error.response?.data?.error || (error.response?.data?.errors ? Object.values(error.response?.data?.errors).flat().join(" ") : "Something went wrong, please try again later."),
                });
                return;
            }
            if (error.response?.data?.error) {
                setMessage({ type: "error", content: error.response?.data?.error || "Something went wrong, please try again later." });
            }
        },
    });

    // Default country: India
    useEffect(() => {
        if (countries.length) {
            const india = countries.find((c) => c.name.toLowerCase() === "india");
            if (india) setValue("country", india.id.toString());
        }
    }, [countries, setValue]);


    // Pre-fill user data
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("phone", user.mobile_number);
        }
    }, [user, setValue]);

    // Submit handler
    const onSubmit = (data: FormData) => {
        if (!token) {
            setMessage({ type: "error", content: "Sign Up Failed: No token found. Please try again." });
            sessionStorage.removeItem("token");
            navigate("/sign-up");
            return;
        }

        const profilePic = sessionStorage.getItem("profile_image") || "";
        const newData = {
            name: data.name,
            profile_image: profilePic,
            email_token: token,
            mobile_no: data.phone,
            type: "designer",
            data: {
                ...data,
            },
        };
        signUpMutation.mutate(newData);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setAcceptedEula(checked);
    };


    useEffect(() => {
        if (!isIndia) {
            setValue("state", "");
            setValue("city", "");
        }
    }, [isIndia, setValue]);

    return (
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4'>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <div>
                            <Label className="font-semibold text-white text-base">Full Name<span className='text-red-500'>*</span></Label>
                            <Input type="text" placeholder='Type your name' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0" autoComplete="name" {...field} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <div>
                            <Label className="font-semibold text-white text-base">Phone Number</Label>
                            <div className="flex">
                                <Select value={selectedCountryCode || "+91"} onValueChange={(value) => setValue("country_code", value)}>
                                    <SelectTrigger className="w-[100px] mt-1 rounded-l-md focus:outline-none focus:ring-0 focus-visible:ring-0 border rounded-r-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {countryCodes.map((country, index) => (
                                            <SelectItem key={index} value={country.dial_code}>
                                                {country.code} {country.dial_code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="text" placeholder="Type your phone number" className="text-white mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0" autoComplete="tel" {...field}
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, "");
                                        field.onChange(digitsOnly);
                                    }}
                                />
                            </div>
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
                            <Input type="text" placeholder='Type your alternative email' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0" autoComplete="email" {...field} />
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
                                    <Input {...field} placeholder="Enter your state" className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0" />
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
                                    <Input {...field} placeholder="Enter your city" className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0" />
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
                            <Input type="text" placeholder='Write your pincode' className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 text-white" {...field} />
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
                        className="border-gray-400 data-[state=checked]:bg-[#00A8E9] data-[state=checked]:text-white data-[state=checked]:border-white"
                        onCheckedChange={handleCheckboxChange}
                    />
                    <label htmlFor="eula" className="text-sm text-white">
                        I have read and agree to the{" "}
                        <button
                            type="button"
                            className="text-[#00A8E9] underline hover:text-[#00A8E9]/80"
                            onClick={() => setOpenEulaDialog(true)}
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

            {/* EULA Dialog */}
            <Dialog open={openEulaDialog} onOpenChange={setOpenEulaDialog}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#1D1D1D] border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#7FBC42]">
                            End User License Agreement (EULA)
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <EulaContent />
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    );
};

export default PersonalInfoForm;