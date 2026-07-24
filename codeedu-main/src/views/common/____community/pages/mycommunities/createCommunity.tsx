import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
import { cn } from "@/lib/utils";
import { getCities, getCounties, getCountryStates } from '@/services/learner/CountryService';
import { JoEditConfig } from '@/utils/joeditConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import JoditEditor from 'jodit-react';
import { Check, ChevronsUpDown, Loader2, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import CommunityLayout from '../../layouts';
import { createCommunity, fetchCommunityById, fetchDomains, fetchSubDomains } from '../../services/CommunityService';


// Validation schema
const formSchema = z.object({
    name: z.string().min(1, 'Community name is required').max(100, 'Name must be 100 characters or less'),
    communityType: z.enum(['public', 'private', 'restricted'], {
        required_error: 'Community type is required',
    }),
    location: z.string().max(100, 'Location must be 100 characters or less').optional(),
    category: z.string().min(1, 'Category is required'),
    subCategory: z.string().optional(),
    description: z.string().min(1, 'Description is required').max(5000, 'Description is too long'),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const VALID_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CreateCommunity: React.FC = () => {

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250,
        readonly: false,
    }), []);

    const navigate = useNavigate();
    const coverPhotoRef = useRef<HTMLInputElement>(null);
    const logoPhotoRef = useRef<HTMLInputElement>(null);
    const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);
    const [logoPhoto, setLogoPhoto] = React.useState<File | null>(null);
    const [isSubmitting,] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);

    const [, setLogoPhotoFromURL] = useState<string | null>(null);
    const [, setCoverPhotoFromURL] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id"); 
    const isEditMode = Boolean(id);


    const { register, handleSubmit, formState: { errors }, control, watch, resetField, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            communityType: 'public',
            location: '',
            category: '',
            subCategory: '',
            country: '',
            state: '',
            city: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditMode && id) {
                    console.log("isEditMode", isEditMode)
                    const response = await fetchCommunityById(id);
                 console.log("response keys", Object.keys(response.category));
                 console.log("category data", response.category);       
                    const data = response.category;
                    reset({
                        name: data.title,
                        communityType: data.type as "public" | "private" | "restricted",
                        location: data.location ?? "",
                        category: data.domain_id?.toString(),
                        subCategory: data.sub_domain_id?.toString(),
                        description: data.description ?? "",
                        country: data.country_id?.toString(),
                        state: data.state_id?.toString(),
                        city: data.city_id?.toString(),
                    });


            
                    if (data.image) {
                        setLogoPhotoFromURL(data.image);
                    }
                    if (data.cover_image) {
                        setCoverPhotoFromURL(data.cover_image);
                    }
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("Failed to load community data");
            }
        };

        fetchData();
    }, [id, isEditMode, reset]);

       const memoizedEditorConfig = useMemo(() => ({
            ...editorConfig,
            placeholder: '',
        }), [editorConfig]);


    const selectedCategory = watch('category');
    const selectedCountry = watch('country');
    const selectedState = watch('state');

    const { data: domains, isLoading: isDomainsLoading } = useQuery({
        queryKey: ['domains'],
        queryFn: fetchDomains,
    });

    const { data: subdomains, isLoading: isSubdomainsLoading } = useQuery({
        queryKey: ['subdomains', selectedCategory],
        queryFn: () => fetchSubDomains(selectedCategory),
        enabled: !!selectedCategory,
    });


    const { data: countries, isLoading: isCountriesLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCounties(),
    });

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

    React.useEffect(() => {
        resetField('subCategory');
    }, [selectedCategory, resetField]);



    const validateImage = useCallback((file: File | null): boolean => {
        if (!file) return false;
        if (!VALID_IMAGE_TYPES.includes(file.type)) {
            toast.error(`Only ${VALID_IMAGE_TYPES.join(', ')} files are allowed`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size must be less than 10MB');
            return false;
        }
        return true;
    }, []);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, setImage: (file: File | null) => void, ref: React.RefObject<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateImage(file)) {
            setImage(file);
        } else {
            setImage(null);
            if (ref.current) ref.current.value = '';
        }
    }, [validateImage]);

    const onSubmit = useCallback(
        async (data: FormData) => {
            if (!logoPhoto || !coverPhoto) {
                toast.error('Both logo and cover photos are required');
                return;
            }

            const formData = new FormData();
            formData.append('title', data.name);
            formData.append('type', data.communityType);
            formData.append('location', data.location || '');
            formData.append('domain_id', data.category);
            formData.append('sub_domain_id', data.subCategory || '');
            formData.append('description', data.description);
            formData.append('status', 'Active');
            formData.append('cover', coverPhoto);
            formData.append('file', logoPhoto);
            formData.append('country_id', data.country || '');
            formData.append('state_id', data.state || '');
            formData.append('city_id', data.city || '');

            const communityId = searchParams.get('id');

            try {
                if (communityId) {
                    await createCommunity(formData, communityId);
                    toast.success('Community updated successfully');
                } else {
                    await createCommunity(formData);
                    toast.success('Community created successfully');
                }
                navigate('/community/mycommunities');
            } catch (error) {
                console.error(error);
                toast.error(communityId ? 'Failed to update community' : 'Failed to create community');
            }
        },
        [coverPhoto, logoPhoto, searchParams, navigate]
    );





    const renderImageUpload = useCallback((type: 'cover' | 'logo', photo: File | null, ref: React.RefObject<HTMLInputElement | null>, setPhoto: (file: File | null) => void) => (
        <div>
            <Label className="block mb-2 font-medium">
                {type === 'cover' ? 'Cover Photo' : 'Logo Photo'}<span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer">
                {!photo ? (
                    <div className="flex flex-col items-center justify-center space-y-4" onClick={() => ref.current?.click()}>
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Upload className="text-[--IndexBlue]" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-[--IndexBlue]">Upload {type === 'cover' ? 'Cover' : 'Logo'} Photo</p>
                            <p className="text-sm text-gray-500 mt-1">Max. size: 10 MB</p>
                            <p className="text-sm text-gray-500 mt-1">Drag and drop your images here or click to browse</p>
                        </div>
                        <Button variant="outline" className="mt-4 cursor-pointer whitespace-nowrap !rounded-button" type="button">
                            Browse Files
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex justify-center py-1.5">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt={`${type} Preview`}
                                className="w-32 rounded-lg"
                            />
                        </div>
                        <Button
                            variant="link"
                            onClick={() => {
                                setPhoto(null);
                                if (ref.current) ref.current.value = '';
                                ref.current?.click();
                            }}
                        >
                            Change {type} Photo
                        </Button>
                    </div>
                )}
            </div>
            <input
                ref={ref}
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleImageChange(e, setPhoto, ref as React.RefObject<HTMLInputElement>)}
            />
        </div>
    ), [handleImageChange]);

    return (
        <CommunityLayout active='mycommunities'>
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="animate-spin text-[--IndexBlue] w-10 h-10" />
                        <span className="text-[--IndexBlue]">Creating Community...</span>
                    </div>
                </div>
            )}
            <div className="container px-4 py-8 bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg mt-5 ">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-3xl font-bold text-cblack mb-8">{isEditMode ? "Update Community" : "Create Communtiy"}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label htmlFor="community-name" className="block mb-2 font-medium">
                                Name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="community-name"
                                placeholder="Enter community name"
                                className="focus:outline-none focus:ring-0 focus-visible:ring-0"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="community-type" className="block mb-2 font-medium">
                                Community Type<span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="communityType"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                            <SelectValue placeholder="Select community type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                            {/* <SelectItem value="restricted">Restricted</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.communityType && <p className="text-red-500 text-sm mt-1">{errors.communityType.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label htmlFor="category" className="block mb-2 font-medium">
                                Category/Domain<span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select value={field.value} disabled={isDomainsLoading} onValueChange={field.onChange}>
                                        <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {domains?.sort((a, b) => a.name.localeCompare(b.name)).map((domain) => (
                                                <SelectItem key={domain.id} value={domain.id.toString()}>
                                                    {domain.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="sub-category" className="block mb-2 font-medium">
                                Sub-Category
                            </Label>
                            <Controller
                                control={control}
                                name="subCategory"
                                render={({ field }) => (
                                    <Select value={field.value} disabled={!selectedCategory || isSubdomainsLoading || subdomains?.length === 0} onValueChange={field.onChange}>
                                        <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                            <SelectValue placeholder="Select sub-category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subdomains?.sort((a, b) => a.name.localeCompare(b.name)).map((subdomain) => (
                                                <SelectItem key={subdomain.id} value={subdomain.id.toString()}>
                                                    {subdomain.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                        {/* <div>
                            <Label htmlFor="country" className="block mb-2 font-medium">
                                Country
                            </Label>
                            <Controller
                                control={control}
                                name="country"
                                render={({ field }) => (
                                    <Select value={field.value} disabled={isCountriesLoading} onValueChange={field.onChange}>
                                        <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className='px-2 py-1'>
                                                <input placeholder='Search country'
                                                 value={searchcountry}
                                                 onChange={(e)=>setSearchCountry(e.target.value)}
                                                 className='' />
                                            </div>
                                            {countries?.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                                                <SelectItem key={country.id} value={country.id.toString()}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div> */}
                        <div>
                            <Label htmlFor="country" className="block mb-2 font-medium">
                                Country
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
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="state" className="block mb-2 font-medium">
                                State
                            </Label>
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

                        </div>
                        <div>
                            <Label htmlFor="city" className="block mb-2 font-medium">
                                City
                            </Label>
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

                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="block mb-2 font-medium">
                            Description<span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <JoditEditor
                                    value={field.value}
                                    config={memoizedEditorConfig}
                                    onBlur={field.onChange}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderImageUpload('cover', coverPhoto, coverPhotoRef, setCoverPhoto)}
                        {renderImageUpload('logo', logoPhoto, logoPhotoRef, setLogoPhoto)}
                    </div>

                    <Alert className="bg-[--IndexBlue]/50 border-[--IndexBlue] text-[--IndexBlue] mb-8">
                        <div className="flex items-center">
                            <i className="fas fa-circle-info mr-2 text-[--IndexBlue]"></i>
                            <AlertDescription>
                                Active for 1 month only. Extend with coordinator recommendation or admin approval.
                            </AlertDescription>
                        </div>
                    </Alert>

                    <div className="flex justify-end space-x-4 mt-8">
                        <Link to="/community/mycommunities">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                className="whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[--IndexBlue] text-white whitespace-nowrap !rounded-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditMode ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </CommunityLayout>
    );
};

export default CreateCommunity;





// import React, { useMemo } from 'react';
// import { Button } from "@/components/ui/ShadcnButton";
// import { Input } from "@/components/ui/ShadcnInput";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui//select";
// import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
// import { Label } from "@/components/ui/label";
// import { Loader2, Upload } from 'lucide-react';
// import { Controller, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { JoEditConfig } from '@/utils/joeditConfig'
// import JoditEditor from 'jodit-react';
// import CommunityLayout from '../../layouts';
// import { useDomainsStore } from '../../store/communityStore';
// import { toast } from 'sonner';
// import { createCommunity } from '../../services/CommunityService';
// import { Link, useNavigate } from 'react-router-dom';


// const formSchema = z.object({
//     name: z.string().min(1, 'Name is required'),
//     communityType: z.enum(['public', 'private', 'restricted'], {
//         required_error: 'Community type is required',
//     }),
//     location: z.string().optional(),
//     category: z.string().refine(value => value !== '', {
//         message: 'Category is required',
//     }),
//     subCategory: z.string().optional(),
//     description: z.string().min(1, 'Description is required'),
// });

// type FormData = z.infer<typeof formSchema>;

// const App: React.FC = () => {


//     const editorConfig = useMemo(() => ({
//         ...JoEditConfig,
//         height: 250
//     }), []);

//     const { domains, fetchDomains } = useDomainsStore();
//     const {subdomains, fetchSubDomains} = useDomainsStore();
//     const navigate = useNavigate();

//     const coverPhotoRef = React.useRef<HTMLInputElement>(null);
//     const logoPhotoRef = React.useRef<HTMLInputElement>(null);
//     const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);
//     const [logoPhoto, setLogoPhoto] = React.useState<File | null>(null);
//     const [createLoading, setCreateLoading] = React.useState(false);

//     React.useEffect(() => {
//         fetchDomains();
//     }, [fetchDomains]);

//     React.useEffect(()=>{
//         fetchSubDomains();
//     },[fetchSubDomains]);

//     const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: '',
//             description: '',
//             communityType: 'public',
//             location: '',
//             category: '',
//             subCategory: '',
//         },
//     });


//     const onSubmit = (data: FormData) => {


//         if (!logoPhoto) {
//             toast.error('Please upload a logo photo.');
//             return;
//         }
//         if (!coverPhoto) {
//             toast.error('Please upload a cover photo.');
//             return;
//         }

//         // check logo photo is png and jpg, jpeg, webp
//         const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
//         if (!validImageTypes.includes(logoPhoto.type)) {
//             toast.error('Logo photo must be a PNG, JPG, JPEG, or WEBP image.');
//             return;
//         }

//         // if cover photo is provided, check its type
//         if (coverPhoto && !validImageTypes.includes(coverPhoto.type)) {
//             toast.error('Cover photo must be a PNG, JPG, JPEG, or WEBP image.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('title', data.name);
//         formData.append('type', data.communityType);
//         formData.append('location', data.location || '');
//         formData.append('domain_id', data.category);
//         formData.append('sub_domain_id', data.subCategory || '');
//         formData.append('description', data.description);
//         formData.append('status', 'Active');
//         if (coverPhoto) {
//             formData.append('cover', coverPhoto);
//         }
//         if (logoPhoto) {
//             formData.append('file', logoPhoto);
//         }

//         setCreateLoading(true);
//         createCommunity(formData).then(() => {
//             toast.success('Community created successfully');
//             navigate(`/community/mycommunities`);
//         }).catch(error => {
//             console.error('Error creating community:', error);
//             toast.error('Failed to create community');
//         }).finally(() => {
//             setCreateLoading(false);
//         });
//     };


//     return (
//         <CommunityLayout active='mycommunities'>
//             {
//                 createLoading && (
//                     <div className="fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center bg-white/50">
//                         <div className="flex flex-col items-center justify-center space-x-2">
//                             <Loader2 className="animate-spin text-[--IndexBlue] w-10 h-10" />
//                             <span className="ml-2 text-[--IndexBlue]">Creating Community...</span>
//                         </div>
//                     </div>
//                 )
//             }
//             <div className="container px-4 py-8 ">
//                 <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//                     {/* max-w-4xl */}
//                     <div className="flex justify-between items-center mb-8">
//                         <h1 className="text-3xl font-bold text-cblack">Create Community</h1>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                         <div>
//                             <Label htmlFor="community-name" className="block mb-2 font-medium">
//                                 Name<span className="text-red-500">*</span>
//                             </Label>
//                             <Input
//                                 id="community-name"
//                                 placeholder="Enter community name"
//                                 className="focus:outline-none focus:ring-0 focus-visible:ring-0"
//                                 {...register('name')}
//                             />
//                             {
//                                 errors.name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//                                 )
//                             }
//                         </div>
//                         <div>
//                             <Label htmlFor="community-type" className="block mb-2 font-medium">
//                                 Community Type<span className="text-red-500">*</span>
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="communityType"
//                                 render={({ field }) => (
//                                     <Select value={field.value} onValueChange={field.onChange}>
//                                         <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                             <SelectValue placeholder="Select community type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="public">Public</SelectItem>
//                                             <SelectItem value="private">Private</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                             {errors.communityType && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.communityType.message}</p>
//                             )}
//                         </div>
//                         <div>
//                             <Label htmlFor="location" className="block mb-2 font-medium">
//                                 Location
//                             </Label>
//                             <Select
//                                 onValueChange={(value) => console.log('Selected location:', value)}
//                             >
//                                 <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                     <SelectValue placeholder="Select location" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="global">Global</SelectItem>
//                                     <SelectItem value="local">Local</SelectItem>
//                                     <SelectItem value="regional">Regional</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         <div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="category" className="font-medium">
//                                     Category/Domain<span className="text-red-500">*</span>
//                                 </Label>
//                                 {/* <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto cursor-pointer whitespace-nowrap !rounded-button">
//                                     <i className="fas fa-plus mr-1 text-xs"></i> Create Category
//                                 </Button> */}
//                             </div>
//                             <Controller
//                                 control={control}
//                                 name="category"
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value} onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                             <SelectValue placeholder="Enter category" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {domains &&
//                                                 [...domains]
//                                                     .sort((a, b) => a.name.localeCompare(b.name))
//                                                     .map((domain) => (
//                                                         <SelectItem key={domain.id} value={domain?.id?.toString()}>
//                                                             {domain.name}
//                                                         </SelectItem>
//                                                     ))}
//                                         </SelectContent>

//                                     </Select>
//                                 )}
//                             />
//                             {
//                                 errors.category && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
//                                 )
//                             }
//                         </div>
//                         <div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="sub-category" className="font-medium">
//                                     Sub-Category
//                                 </Label>
//                                 {/* <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto cursor-pointer whitespace-nowrap !rounded-button">
//                                     <i className="fas fa-plus mr-1 text-xs"></i> Create Sub-Category
//                                 </Button> */}
//                             </div>
//                             {/* <Select
//                                 onValueChange={(value) => console.log('Selected sub-category:', value)}
//                             >
//                                 <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                     <SelectValue placeholder="Enter category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="ai">Artificial Intelligence</SelectItem>
//                                     <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
//                                     <SelectItem value="data-science">Data Science</SelectItem>
//                                     <SelectItem value="mobile-dev">Mobile Development</SelectItem>
//                                     <SelectItem value="web-dev">Web Development</SelectItem>
//                                     <SelectItem value="other">Others</SelectItem>
//                                 </SelectContent>
//                             </Select> */}
//                             <Controller
//                                 control={control}
//                                 name="category"
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value} onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                             <SelectValue placeholder="Enter category" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {subdomains &&
//                                                 [...subdomains]
//                                                     .sort((a, b) => a.name.localeCompare(b.name))
//                                                     .map((subdomain) => (
//                                                         <SelectItem key={subdomain.id} value={subdomain?.id?.toString()}>
//                                                             {subdomain.name}
//                                                         </SelectItem>
//                                                     ))}
//                                         </SelectContent>

//                                     </Select>
//                                 )}
//                             />
//                             {
//                                 errors.category && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
//                                 )
//                             }
//                         </div>
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="description">
//                             Enter Description <span className="text-red-500">*</span>
//                         </Label>
//                         <Controller
//                             name="description"
//                             control={control}
//                             rules={{ required: true }}
//                             render={({ field }) => (
//                                 <JoditEditor
//                                     value={field.value || ""}
//                                     config={editorConfig}
//                                     onBlur={(newValue) => field.onChange(newValue)}
//                                     onChange={(newValue) => field.onChange(newValue)}
//                                 />
//                             )}
//                         />
//                         {errors.description && (
//                             <p className="text-red-500 text-sm">{errors.description.message}</p>
//                         )}
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         <div>
//                             <Label className="block mb-2 font-medium">
//                                 Cover Photo<span className="text-red-500">*</span>
//                             </Label>
//                             <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer">
//                                 {!coverPhoto && <div className="flex flex-col items-center justify-center space-y-4" onClick={() => coverPhotoRef.current?.click()}>
//                                     <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
//                                         <Upload className="text-[--IndexBlue]" />
//                                     </div>
//                                     <div>
//                                         <p className="text-lg font-medium text-[--IndexBlue]">Upload Cover Photo</p>
//                                         <p className="text-sm text-gray-500 mt-1">Max. size: 10 MB</p>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             Drag and drop your images/videos here or click to browse
//                                         </p>
//                                     </div>
//                                     <Button variant="outline" className="mt-4 cursor-pointer whitespace-nowrap !rounded-button" type='button'>
//                                         Browse Files
//                                     </Button>
//                                 </div>
//                                 }
//                                 {
//                                     coverPhoto && (
//                                         <div className="mt-4">
//                                             <div className="flex justify-center py-1.5">
//                                                 <img
//                                                     src={URL.createObjectURL(coverPhoto)}
//                                                     alt="Cover Preview"
//                                                     className="w-32 rounded-lg"
//                                                 />
//                                             </div>
//                                             <Button
//                                                 variant="link"
//                                                 onClick={() => {
//                                                     setCoverPhoto(null);
//                                                     coverPhotoRef.current!.value = '';
//                                                     coverPhotoRef.current?.click()
//                                                 }}
//                                             >
//                                                 Click to change
//                                             </Button>
//                                         </div>
//                                     )
//                                 }
//                             </div>
//                             <input
//                                 ref={coverPhotoRef}
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     if (e.target.files && e.target.files[0]) {
//                                         setCoverPhoto(e.target.files[0]);
//                                     }
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <Label className="block mb-2 font-medium">
//                                 Logo Photo<span className="text-red-500">*</span>
//                             </Label>
//                             <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer">
//                                 {!logoPhoto &&
//                                     <div className="flex flex-col items-center justify-center space-y-4" onClick={() => logoPhotoRef.current?.click()}>
//                                         <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
//                                             <Upload className="text-[--IndexBlue]" />
//                                         </div>
//                                         <div>
//                                             <p className="text-lg font-medium text-[--IndexBlue]">Upload Logo Photo</p>
//                                             <p className="text-sm text-gray-500 mt-1">Max. size: 10 MB</p>
//                                             <p className="text-sm text-gray-500 mt-1">
//                                                 Drag and drop your images/videos here or click to browse
//                                             </p>
//                                         </div>
//                                         <Button variant="outline" className="mt-4 cursor-pointer whitespace-nowrap !rounded-button" type='button'>
//                                             Browse Files
//                                         </Button>
//                                     </div>
//                                 }
//                                 {
//                                     logoPhoto && (
//                                         <div className="mt-4">
//                                             <div className="flex justify-center">
//                                                 <img
//                                                     src={URL.createObjectURL(logoPhoto)}
//                                                     alt="Logo Preview"
//                                                     className="w-32 h-auto rounded-lg"
//                                                 />
//                                             </div>
//                                             <Button
//                                                 variant="link"
//                                                 onClick={() => {
//                                                     setLogoPhoto(null);
//                                                     logoPhotoRef.current!.value = '';
//                                                     logoPhotoRef.current?.click()
//                                                 }}
//                                             >
//                                                 Click to change
//                                             </Button>
//                                         </div>
//                                     )
//                                 }
//                             </div>
//                             <input
//                                 ref={logoPhotoRef}
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     if (e.target.files && e.target.files[0]) {
//                                         setLogoPhoto(e.target.files[0]);
//                                     }
//                                 }}
//                             />
//                         </div>
//                     </div>

//                     <Alert className="bg-[--IndexBlue]/50 border-[--IndexBlue] text-[--IndexBlue] mb-8">
//                         <div className="flex items-center">
//                             <i className="fas fa-circle-info mr-2 text-[--IndexBlue]"></i>
//                             <AlertDescription>
//                                 Active for 1 month only. Extend with coordinator recommendation or admin approval.
//                             </AlertDescription>
//                         </div>
//                     </Alert>
//                     <div className="flex justify-end space-x-2 mt-8">
//                         {/* <Link to={`/community/mycommunities`}>
//                         <Button
//                         disabled={createLoading}
//                          variant="outline" className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]">
//                             Cancel
//                         </Button>
//                         </Link> */}
//                         {!createLoading ? (
//                             <Link to="/community/mycommunities">
//                                 <Button
//                                     variant="outline"
//                                     className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]"
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Link>
//                         ) : (
//                             <Button
//                                 disabled
//                                 variant="outline"
//                                 className="whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue] opacity-50 cursor-not-allowed"
//                             >
//                                 Cancel
//                             </Button>
//                         )}
//                         <Button
//                             disabled={createLoading}
//                             className="bg-[--IndexBlue] text-white cursor-pointer whitespace-nowrap !rounded-button">
//                             Create
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </CommunityLayout>
//     );
// };
// export default App