import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities, getCounties, getCountryStates } from '@/services/learner/CountryService';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
} from "@/components/ui/command";
import { useForm, Controller } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import countryCodes from '@/data/countryCode';



const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    alternateEmail: z.string().optional().transform((val) => val?.trim() || '')
        .refine((val) => val === '' || /\S+@\S+\.\S+/.test(val), {
            message: 'E nter a valid alternate email address',
        }),
    institute: z.string().min(1, 'Institute/University name is required'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z.string().optional(),
    hearAboutUs: z.string().min(1, 'Please select an option'),
    country_code: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const Student = () => {
    const [open, setOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);

    const navigate = useNavigate();

    const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country: "",
        }
    });

    const selectedCountry = watch('country');
    const selectedState = watch('state');

    const { data: countries, isLoading: isCountriesLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCounties(),
    });

    useEffect(() => {
        if (countries?.length) {
            const india = countries.find(c => c.name.toLowerCase() === "india");
            if (india) {
                setValue("country", india.id.toString());
            }
        }
    }, [countries, setValue]);

    const { data: states, isLoading: isStatesLoading } = useQuery({
        queryKey: ['states', selectedCountry],
        queryFn: () => getCountryStates(selectedCountry),
        enabled: !!selectedCountry,
    });

    const { data: cities, isLoading: isCitiesLoading } = useQuery({
        queryKey: ['cities', selectedState],
        queryFn: () => getCities(selectedState),
        enabled: !!selectedState,
    });

    const selectedCountryObj = countries?.find(c => c.id.toString() === selectedCountry?.toString());
    const isIndia = selectedCountryObj?.name?.toLowerCase() === 'india';

    const handleSubmitData = (data: FormData) => {
        console.log('Form Data:', data);
        // toast.success('Form submitted successfully!');
        sessionStorage.setItem('studentData', JSON.stringify(data));
        navigate('/details-info');
    };


    useEffect(() => {
        const accountEmail = sessionStorage.getItem('accountEmail');
        const verifiedEmail = sessionStorage.getItem('verified-email');
        const studentData = sessionStorage.getItem('studentData');

        if (!accountEmail) {
            toast.error('No account email found. Please start over.');
            navigate('/sign-up');
        }

        if (!verifiedEmail) {
            navigate('/account-verify');
        }

        if (studentData) {
            navigate('/details-info');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-[550px] px-4 rounded-lg bg-white">
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(handleSubmitData)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-[1px] border-[#FFDCF0] pb-5">
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
                    {/* <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <div>
                                <Label className="font-semibold text-[#263A43]">Phone Number<span className='text-red-500'>*</span></Label>
                                <Input
                                    type="text"
                                    placeholder='Type your phone number'
                                    className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    autoComplete="tel"
                                    {...field}
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, ""); // keep only numbers
                                        field.onChange(digitsOnly);
                                        }}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>
                        )}
                    /> */}
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
                        name="qualification"
                        render={({ field }) => (
                            <div>
                                <Label htmlFor="qualification" className="block mb-2 font-semibold text-[#263A43]">
                                    Highest Qualification<span className="text-red-500">*</span>
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 text-[#263A43]">
                                        <SelectValue placeholder="Select your highest qualification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High School">High School</SelectItem>
                                        <SelectItem value="Bachelors Degree">Bachelors Degree</SelectItem>
                                        <SelectItem value="Masters Degree">Masters Degree</SelectItem>
                                        <SelectItem value="Ph.D.">Ph.D.</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>}
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
                <div>
                    <p className="text-gray-600 text-lg font-bold mt-2">Institute/University Details</p>
                    <p className="text-gray-600 text-sm">Tell us about your institute/university</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-[1px] border-[#FFDCF0] pb-5 mt-4">
                        <Controller
                            control={control}
                            name="institute"
                            render={({ field }) => (
                                <div>
                                    <Label className="font-semibold text-[#263A43]">Institute/University Name<span className='text-red-500'>*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder='Type your institute/university'
                                        className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                    />
                                    {errors.institute && <p className="text-red-500 text-sm mt-1">{errors.institute.message}</p>}
                                </div>
                            )}
                        />
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
                                        placeholder='Write your institute/university pincode'
                                        className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                    />
                                    {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
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
                        className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px] rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                    >
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Student;