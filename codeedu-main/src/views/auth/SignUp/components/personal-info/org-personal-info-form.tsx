import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Check, ChevronsUpDown, Loader, LogIn } from 'lucide-react';
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

const formSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    platformName: z.string().min(1, "Platform Name is required"),
    email: z.string().email("Enter a valid email address"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    phone: z
        .string()
        .optional()
        .transform((val) => val?.trim() || ""),
    country_code: z.string().optional(),
    employeeStrength: z.string().min(1, "Employee Strength is required"),
    organizationType: z.enum(["industry", "institute"], {
        errorMap: () => ({ message: "Organization Type is required" }),
    }),
});

type FormData = z.infer<typeof formSchema>;

const OrgPersonalInfoForm = () => {
    const [openCountry, setOpenCountry] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [acceptedEula, setAcceptedEula] = useState(false);
    const [openEulaDialog, setOpenEulaDialog] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        content: "",
    });
    const { setAuth } = useSetAuth();

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: sessionStorage.getItem('accountEmail') || '',
            organizationType: 'industry',
            phone: "",
        },
    });

    const selectedCountry = watch("country");
    const selectedState = watch("state");
    const selectedCountryCode = watch("country_code");

    const { data: countries = [], isLoading: loadingCountries } = useCountries();
    const { data: states = [], isLoading: loadingStates } = useStates(selectedCountry);
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedState);

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

    const createOrgMutation = useMutation({
        mutationFn: createOrganization,
        onSuccess: (data) => {
            if (data.status === 0) {
                const errorMessage = data.message || "Something went wrong, please try again later.";
                setMessage({ type: "error", content: errorMessage });
                errorToast("Registration Failed", errorMessage);
                return;
            }
            if (data?.status === 1) {
                const response = {
                    token: data.data.token,
                    user: data.data.user
                }
                if (response) {
                    setAuth(response);
                    successToast("Registration Successful", "You have successfully registered and logged in.");
                }
            }
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            const errorMessage = error.response?.data?.message || "Something went wrong, please try again later.";
            setMessage({ type: "error", content: errorMessage });
            errorToast("Registration Failed", errorMessage);
        },
    });

    useEffect(() => {
        if (countries.length) {
            const india = countries.find((c) => c.name.toLowerCase() === "india");
            if (india) setValue("country", india.id.toString());
        }
    }, [countries, setValue]);

    const onSubmit = (data: FormData) => {
        const orgData = {
            name: data.name,
            email: data.email,
            short_name: data.platformName,
            mobile_number: data.phone || undefined,
            country_id: data.country,
            state_id: data.state,
            city: data.city,
            employee_strength: data.employeeStrength,
            organization_type: data.organizationType
        };

        // Persist redirectUrl before async signup so it's available after auto-login
        const pendingRedirect = new URLSearchParams(window.location.search).get('redirectUrl');
        if (pendingRedirect) {
            sessionStorage.setItem('signup_pending_redirect', pendingRedirect);
        }

        createOrgMutation.mutate(orgData);
    };

    const handleCheckboxChange = () => {
        if (!acceptedEula) {
            // Not yet accepted — open modal first; agree inside modal will set acceptedEula
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

    return (
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <div>
                            <Input type="text" placeholder='Full Name *' className="text-white mt-1 focus:outline-none focus:ring-0 font-[16px] focus-visible:ring-0 h-[62px]" autoComplete="name" {...field} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="platformName"
                    render={({ field }) => (
                        <div>
                            <Input type="text" placeholder='Platform Name *' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 h-[62px]" {...field} />
                            {errors.platformName && <p className="text-red-500 text-sm mt-1">{errors.platformName.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <div>
                            <div className="flex">
                                <Select value={selectedCountryCode || "+91"} onValueChange={(value) => setValue("country_code", value)}>
                                    <SelectTrigger className="w-[100px] mt-1 rounded-l-md focus:outline-none focus:ring-0 focus-visible:ring-0 border rounded-r-none h-[62px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {uniqueCountryCodes.map((country) => {
                                            const dialCode = country.dial_code.replace(/\s+/g, "");
                                            return (
                                            <SelectItem key={`${country.code}-${dialCode}`} value={dialCode}>
                                                {country.code} {dialCode}
                                            </SelectItem>
                                        )})}
                                    </SelectContent>
                                </Select>
                                <Input type="text" placeholder="Phone Number *" maxLength={10} className="text-white mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0 h-[62px]" autoComplete="tel" {...field}
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
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <div>
                            <Input type="email" placeholder='Email *' className="text-white mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 h-[62px]" autoComplete="email" {...field} readOnly />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => {
                            const selected = countries?.find(c => c.id.toString() === field.value?.toString());
                            return (
                                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                    <PopoverTrigger asChild className='h-[62px]'>
                                        <Button variant="outline" role="combobox" disabled={loadingCountries} aria-expanded={openCountry} className="w-full justify-between focus-visible:ring-0  h-[62px text-white">{selected?.name || "Country *"}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search country..." />
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
                                        <PopoverTrigger asChild className='h-[62px]'>
                                            <Button variant="outline" role="combobox" disabled={loadingStates || !selectedCountry || !states?.length} aria-expanded={openState} className="w-full justify-between focus-visible:ring-0 text-white">{selected?.name || "Select State *"} <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
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
                                        <PopoverTrigger asChild className='h-[62px]'>
                                            <Button variant="outline" role="combobox" disabled={loadingCities || !selectedState || !cities?.length} aria-expanded={openCity} className="w-full justify-between focus-visible:ring-0 text-white">{selected?.name || "Select City *"}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button>
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
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Controller
                    control={control}
                    name="employeeStrength"
                    render={({ field }) => (
                        <div>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 h-[62px] text-white">
                                    <SelectValue placeholder="Employee Strength*" className="text-white" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-10">1-10</SelectItem>
                                    <SelectItem value="11-50">11-50</SelectItem>
                                    <SelectItem value="51-200">51-200</SelectItem>
                                    <SelectItem value="201-500">201-500</SelectItem>
                                    <SelectItem value="501-1000">501-1000</SelectItem>
                                    <SelectItem value="1000+">1000+</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.employeeStrength && <p className="text-red-500 text-sm mt-1">{errors.employeeStrength.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="organizationType"
                    render={({ field }) => (
                        <div>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0 h-[62px] text-white">
                                    <SelectValue placeholder="Type of Organization*" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="industry">Industry</SelectItem>
                                    <SelectItem value="institute">Institute</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.organizationType && <p className="text-red-500 text-sm mt-1">{errors.organizationType.message}</p>}
                        </div>
                    )}
                />
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
                    <label htmlFor="eula" className="text-sm text-white">
                        I have read and agree to the{" "}
                        <button
                            type="button"
                            className="text-primary underline hover:text-primary/80"
                            onClick={(e) => { e.preventDefault(); setOpenEulaDialog(true); }}
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

                <div className='flex items-center justify-center w-full'>
                    <div
                        className={`w-full flex flex-col gap-3 items-center justify-center rounded-lg h-32 !w-[160px] font-bold text-xl text-center focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 ${acceptedEula ? "bg-codeyellow hover:bg-codeyellow/80 text-black" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                        onClick={handleSubmit(onSubmit)}
                    >
                        <div className="flex items-center gap-2">
                            <LogIn size={32} />
                        </div>
                        {createOrgMutation?.isPending && <Loader className="inline-block mr-2 h-4 w-4 animate-spin text-white" />}
                        {createOrgMutation.isPending ? "Processing..." : "Continue"}
                    </div>
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
}

export default OrgPersonalInfoForm