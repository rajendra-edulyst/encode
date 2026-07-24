import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
} from "@/components/ui/command"
import { useForm, Controller } from 'react-hook-form';
import { cn } from "@/lib/utils"
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import countryCodes from '@/data/countryCode';
import { useCities, useCountries, useStates } from '@/hooks/data/useLocation';
import { signUpRequest } from '@/services/AuthService';
import { errorToast, successToast } from '@/views/auth/@lib/toastUtils';
import { AxiosError } from 'axios';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    alternateEmail: z.string().optional().transform((val) => val?.trim() || '')
        .refine((val) => val === '' || /\S+@\S+\.\S+/.test(val), {
            message: 'Enter a valid alternate email address',
        }), country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z.string().min(4, 'Pin code must be exactly 4 characters').optional(),
    hearAboutUs: z.string().min(1, 'Please select an option'),
    address: z.string().min(1, 'Address is required'),
    industryurl: z.string().optional(),
    brochure: z
        .instanceof(File)
        .refine((file) => file.size > 0, {
            message: "Upload the brochure",
        })
        .optional(),
    industry: z.string(),
    description: z.string(),
    spocOption: z.enum(["fill", "skip"]),
    spocname: z.string().optional(),
    designation: z.string().optional(),
    email: z.string().optional(),
    phonenumber: z.string().optional(),
    country_code: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.spocOption === "fill") {
        if (!data.spocname?.trim()) {
            ctx.addIssue({ code: "custom", path: ["spocname"], message: "spoc name is required" });
        }
        if (!data.designation?.trim()) {
            ctx.addIssue({ code: "custom", path: ["designation"], message: "spoc designation is required" });
        }
        if (!data.email?.trim()) {
            ctx.addIssue({ code: "custom", path: ["email"], message: "spoc email is required" });
        }
        if (!data.phonenumber?.trim()) {
            ctx.addIssue({ code: "custom", path: ["phonenumber"], message: "spoc phonenumber is required" });
        }
    }

});


type FormData = z.infer<typeof formSchema>;




const Industry = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const token = sessionStorage.getItem("token") || "";

    const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            spocOption: "skip",
            spocname: "",
        }
    });

    const selectedCountry = watch('country');
    const selectedState = watch('state');

    const spocOption = watch("spocOption");
    const isDisabled = spocOption === "skip";


    const { data: countries = [], isLoading: isCountriesLoading } = useCountries()
    // Fetch states for selected country
    const { data: states, isLoading: isStatesLoading } = useStates(selectedCountry);
    const { data: cities, isLoading: isCitiesLoading } = useCities(selectedState);

    const selectedCountryObj = useMemo(() => countries?.find(c => c.id.toString() === selectedCountry?.toString()), [countries, selectedCountry]);
    const isIndia = selectedCountryObj?.name?.toLowerCase() === 'india';

    useEffect(() => {
        if (countries?.length) {
            const india = countries?.find(c => c.name.toLowerCase() === 'india');
            if (india) setValue('country', india.id.toString());
        }
    }, [countries, setValue]);

    const signUpMutation = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            console.log(data);
            successToast("Profile Created", "Your profile has been successfully created.");
            queryClient.invalidateQueries({ queryKey: ['signUpTokenData'] });
            navigate('/details-info');
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            errorToast("Sign Up Failed", error.response?.data?.message || "Something went wrong, please try again later.");
        },
    });

    const handleSubmitData = (data: FormData) => {
        if (!token) {
            errorToast("Sign Up Failed", "No token found. Please try again.");
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('accountEmail');
            navigate('/sign-up');
        }

        const newData = {
            data: data,
            email_token: token,
            mobile_no: data.phone,
            type: "industry",
            name: data.name ?? "",
        }
        signUpMutation.mutate(newData);
    };

    return (
        <div className="h-[550px]  px-4 rounded-lg  bg-white">
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(handleSubmitData)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6  border-b-[1px] border-[#FFDCF0] pb-5">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <div>
                                <Label className="font-semibold text-[#263A43]">Name<span className='text-red-500'>*</span></Label>
                                <Input
                                    type="text"
                                    placeholder='Type your name'
                                    className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    autoComplete="name"
                                    {...field}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <div>
                                <Label className="font-semibold text-[#263A43]">
                                    Phone Number<span className='text-red-500'>*</span>
                                </Label>
                                <div className="flex">
                                    <select
                                        className="text-[#263A43] mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0 border"
                                        value={watch("country_code") || "+91"}
                                        onChange={(e) => setValue("country_code", e.target.value)}
                                    >
                                        {countryCodes.map((country, index) => (
                                            <option key={index} value={country.dial_code}>
                                                {country.code} {country.dial_code}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        type="text"
                                        placeholder="Type your phone number"
                                        className="text-[#263A43] mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        autoComplete="tel"
                                        {...field}
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, "");
                                            field.onChange(digitsOnly);
                                        }}
                                    />
                                </div>

                                {/* Error message */}
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name="alternateEmail"
                        render={({ field }) => (
                            <div>
                                <Label className="font-semibold text-[#263A43]">Alternative Email</Label>
                                <Input
                                    type="text"
                                    placeholder='Type your alternative email'
                                    className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    autoComplete="email"
                                    {...field}
                                />
                                {errors.alternateEmail && <p className="text-red-500 text-sm mt-1">{errors.alternateEmail.message}</p>}
                            </div>
                        )}
                    />



                </div>
                <div className='border-b-[1px] border-[#FFDCF0] pb-5'>
                    <p className="text-gray-600 text-lg font-bold mt-2">Industry Details</p>
                    <p className="text-gray-600 text-sm">Tell us about your industry</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">

                        <Controller
                            control={control}
                            name="industry"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Industry Name<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder='Type your industry name'
                                        className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                    />
                                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8  mt-4">
                        <Controller
                            control={control}
                            name="address"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Address<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder='Type your address'
                                        className='mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0'
                                        {...field}
                                    />
                                    {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">
                        <div>
                            <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
                                Country<span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="country"
                                render={({ field }) => {
                                    const selected = countries?.find(c => c.id.toString() === field.value?.toString());
                                    return (
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={isCountriesLoading}
                                                    aria-expanded={open}
                                                    className="w-full justify-between focus-visible:ring-0"
                                                >
                                                    {selected?.name || "Select country..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search country..." className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>No country found.</CommandEmpty>
                                                        {countries
                                                            ?.sort((a, b) => a.name.localeCompare(b.name))
                                                            .map((country) => (
                                                                <CommandItem
                                                                    key={country.id}
                                                                    value={country.name}
                                                                    onSelect={() => {
                                                                        field.onChange(country.id.toString());
                                                                        setOpen(false);
                                                                    }}
                                                                >
                                                                    {country.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            field.value == country.id.toString() ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
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
                            <Label htmlFor="state" className="block mb-2 font-semibold text-[#263A43]">
                                State<span className='text-red-500'>*</span>
                            </Label>
                            {!isIndia ? (
                                <Controller
                                    control={control}
                                    name="state"
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                {...field}
                                                placeholder="Enter your state"
                                                className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0"
                                            />
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
                                            <Popover open={stateOpen} onOpenChange={setStateOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isStatesLoading || !selectedCountry || !states?.length}
                                                        aria-expanded={stateOpen}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                    >
                                                        {selected?.name || "Select state..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search state..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No state found.</CommandEmpty>
                                                            {states
                                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((state) => (
                                                                    <CommandItem
                                                                        key={state.id}
                                                                        value={state.name}
                                                                        onSelect={() => {
                                                                            field.onChange(state.id.toString());
                                                                            setStateOpen(false);
                                                                        }}
                                                                    >
                                                                        {state.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value === state.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
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
                            <Label htmlFor="city" className="block mb-2 font-semibold text-[#263A43]">
                                City<span className='text-red-500'>*</span>
                            </Label>
                            {!isIndia ? (
                                <Controller
                                    control={control}
                                    name="city"
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                {...field}
                                                placeholder="Enter your city"
                                                className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0"
                                            />
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
                                            <Popover open={cityOpen} onOpenChange={setCityOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isCitiesLoading || !selectedState || !cities?.length}
                                                        aria-expanded={cityOpen}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                    >
                                                        {selected?.name || "Select city..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search city..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No city found.</CommandEmpty>
                                                            {cities
                                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((city) => (
                                                                    <CommandItem
                                                                        key={city.id}
                                                                        value={city.name}
                                                                        onSelect={() => {
                                                                            field.onChange(city.id.toString());
                                                                            setCityOpen(false);
                                                                        }}
                                                                    >
                                                                        {city.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value === city.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
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
                        <Controller
                            control={control}
                            name="pinCode"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Pin Code</Label>
                                    <Input
                                        type="text"
                                        placeholder='Write your institute pincode'
                                        className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                    />
                                    {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    {/* <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <div>
                                <Label className="font-semibold text-[#263A43]">
                                    About Industry <span className="text-red-500">*</span>
                                </Label>
                                <textarea

                                    placeholder="Tell us about your industry"
                                    rows={5}
                                    className="mt-1 p-3 border border-gray-300 rounded-md resize-none text-[#263A43] focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    {...field}
                                />
                                {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
                            </div>
                        )}
                    /> */}

                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <div className="flex flex-col gap-2 mt-4">
                                <Label className="font-semibold text-[#263A43]">
                                    About Industry <span className="text-red-500">*</span>
                                </Label>
                                <textarea
                                    placeholder="Tell us about your industry"
                                    rows={5}
                                    className="mt-1 p-3 border border-gray-300 rounded-md resize-none text-[#263A43] focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    {...field}
                                />
                                {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
                            </div>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">
                        <Controller
                            control={control}
                            name="industryurl"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Industry URL</Label>
                                    <Input
                                        type="text"
                                        placeholder='Type your institute URL'
                                        className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                    />
                                    {errors.industryurl && <p className="text-red-500 text-sm mt-1">{errors.industryurl.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    <Controller
                        name="brochure"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div className="flex flex-col gap-2 mt-4">
                                <Label className="font-semibold text-[#263A43]">Upload Brochure</Label>

                                <div className="relative border-2 border-dashed border-pink-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-pink-50 transition duration-200">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        id="brochureUpload"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                onChange(file);
                                                console.log('Selected file:', file);
                                            }
                                        }}
                                    />
                                    <div className="text-[#d63384] font-semibold text-sm">
                                        Click or drag a file here to upload
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG</p>
                                    {value && (
                                        <p className="text-sm mt-2 text-green-600">
                                            Selected: {value.name}
                                        </p>
                                    )}
                                </div>
                                {errors.brochure && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.brochure.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                </div>
                {/* <div className='border-b-[1px] border-[#FFDCF0] pb-5'>
                    <p className="text-gray-600 text-lg font-bold mt-2">SPOC Details</p>
                    <p className="text-gray-600 text-sm">Tell us about your SPOC</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">

                        <div>
                            <Label className="font-semibold text-[#263A43]">SPOC Name<span className='text-red-500'>*</span></Label>
                            <Input
                                required
                                type="text"
                                placeholder='Type your SPOC name'
                                className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                            />
                       </div>
                        <div>
                            <Label className="font-semibold text-[#263A43]">Designation<span className='text-red-500'>*</span></Label>
                            <Input
                                required
                                type="text"
                                placeholder='Type your SPOC Designation'
                                className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                            />
                       </div>
                        <div>
                            <Label className="font-semibold text-[#263A43]">Email<span className='text-red-500'>*</span></Label>
                            <Input
                                required
                                type="text"
                                placeholder='Type your SPOC email'
                                className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                            />
                       </div>
                        <div>
                            <Label className="font-semibold text-[#263A43]">Phone Number<span className='text-red-500'>*</span></Label>
                            <Input
                                required
                                type="text"
                                placeholder='Type your SPOC phone number'
                                className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                            />
                       </div>
                </div>
                    </div> */}
                <div className="border-b-[1px] border-[#FFDCF0] pb-5">
                    <p className="text-gray-600 text-lg font-bold mt-2">SPOC Details</p>
                    <p className="text-gray-600 text-sm">Tell us about your SPOC</p>

                    <div className="flex items-center gap-8 mt-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="spoc"
                                value="fill"
                                checked={spocOption === "fill"}
                                onChange={(e) => setValue("spocOption", e.target.value as "fill" | "skip")}
                            />
                            <span className="text-[#263A43] font-medium">Someone else is the SPOC</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="spoc"
                                value="skip"
                                checked={spocOption === "skip"}
                                onChange={(e) => setValue("spocOption", e.target.value as "fill" | "skip")}
                            />
                            <span className="text-[#263A43] font-medium">I am the SPOC</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <Controller
                            control={control}
                            name="spocname"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">SPOC Name<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        disabled={isDisabled}
                                        placeholder='Type your SPOC name'
                                        className='mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0'
                                        {...field}
                                    />
                                    {errors.spocname && <p className='text-red-500 text-sm mt-1'>{errors.spocname.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="designation"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Designation<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        disabled={isDisabled}
                                        placeholder='Type your SPOC designation'
                                        className='mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0'
                                        {...field}
                                    />
                                    {errors.designation && <p className='text-red-500 text-sm mt-1'>{errors.designation.message}</p>}
                                </div>
                            )}
                        />


                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Email<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        disabled={isDisabled}
                                        placeholder='Type your SPOC email'
                                        className='mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0'
                                        {...field}
                                    />
                                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="phonenumber"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Phone Number<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        disabled={isDisabled}
                                        placeholder='Type your SPOC phone number'
                                        className='mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0'
                                        {...field}
                                    />
                                    {errors.phonenumber && <p className='text-red-500 text-sm mt-1'>{errors.phonenumber.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-[#263A43] text-lg font-bold mt-2">From where did you hear about us?</p>
                    <p className="text-[#263A43] text-sm">Help us understand how you found us</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Controller
                            control={control}
                            name="hearAboutUs"
                            render={({ field }) => (
                                <div>
                                    <Label htmlFor="hearAboutUs" className="block mb-2 font-semibold text-[#263A43]">
                                        Please Select One<span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0">
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
                <div className='mt-7 flex justify-center'>
                    <Button
                        type="submit"
                        className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                    >
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Industry


// const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [name, setName] = useState('');
//     const [password,] = useState('');

//     const [, setError] = useState('');
//     const { signUp } = useAuth()
//     const [open, setOpen] = useState(false);
//     const [stateOpen, setStateOpen] = useState(false);
//     const [cityOpen, setCityOpen] = useState(false);
//     const [spocOption, setSpocOption] = useState("fill");

//     const isDisabled = spocOption !== "fill";


//     const {
//         register,
//         control,
//         watch,
//         // formState: { errors },
//     } = useForm<FormData>({
//         defaultValues: {
//             name: '',
//             password: '',
//             country: '',
//             state: '',
//             city: '',
//         },
//     });


//     const selectedCountry = watch('country');
//     const selectedState = watch('state');




//     const { data: countries, isLoading: isCountriesLoading } = useQuery({
//         queryKey: ['countries'],
//         queryFn: () => getCounties(),
//     });

//     const { data: states, isLoading: isStatesLoading } = useQuery({
//         queryKey: ['states', selectedCountry],
//         queryFn: () => getCountryStates(selectedCountry),
//         enabled: !!selectedCountry,
//     });

//     const { data: cities, isLoading: isCitiesLoading } = useQuery({
//         queryKey: ['cities', selectedState],
//         queryFn: () => getCities(selectedState),
//         enabled: !!selectedState,
//     });

//     const selectedCountryObj = countries?.find(c => c.id.toString() === selectedCountry?.toString());
//     const isIndia = selectedCountryObj?.name?.toLowerCase() === 'india';



//     useEffect(() => {
//         const storedEmail = sessionStorage.getItem('verified-email');
//         if (!storedEmail) {
//             navigate('/sign-up');
//         } else {
//             setEmail(storedEmail);
//         }
//     }, [navigate]);

//     const mutation = useMutation({
//         mutationFn: signUp,
//         onSuccess: () => {
//             // clean up email
//             toast.success('Verified', {
//                 description: 'Your account has been verified successfully.',
//                 duration: 3000,
//                 position: 'top-right',
//                 style: {
//                     background: '#f0f4f8',
//                     color: '#333',
//                 },
//             });
//             // set verified-email in localStorage
//             localStorage.setItem('verified-email', email);
//             // remove accountEmail from localStorage
//             localStorage.removeItem('accountEmail');
//             navigate('/details-info');
//         },
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         onError: (err: any) => {
//             setError(err?.response?.data?.message || 'OTP verification failed.');
//         }
//     });

//     const createAccount = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!email || !name) {
//             setError('All fields are required.');
//             return;
//         }

//         // if (password !== confirmPassword) {
//         //     setError('Passwords do not match.');
//         //     return;
//         // }

//         const result = {
//             name, password, email,
//             dob: '',
//             profilePic: "",
//             first_name: name,
//             last_name: "",
//             gender: "",
//             mobile_no: "",
//             alternate_mobile_no: "",
//             email_address: email,
//             date_of_birth: "",
//             db_code: "0",
//             username: email,
//             locale: "English",
//             created_timezone: "UTC+05:30",
//             wp_center_id: null,
//             wp_course_id: null
//         };

//         mutation.mutate(result);

//         localStorage.removeItem('verified-email');

//     }

