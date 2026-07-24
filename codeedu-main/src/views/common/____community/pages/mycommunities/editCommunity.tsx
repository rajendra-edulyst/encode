import React, { useMemo } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui//select";
import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JoEditConfig } from '@/utils/joeditConfig'
import JoditEditor from 'jodit-react';
import CommunityLayout from '../../layouts';
import { useDomainsStore } from '../../store/communityStore';
import { toast } from 'sonner';
import { createCommunity, fetchCommunityById } from '../../services/CommunityService';
import { useNavigate, useParams } from 'react-router-dom';


const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    communityType: z.enum(['public', 'private', 'restricted'], {
        required_error: 'Community type is required',
    }),
    location: z.string().optional(),
    category: z.string().refine(value => value !== '', {
        message: 'Category is required',
    }),
    subCategory: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof formSchema>;

const App: React.FC = () => {


    const { communityId } = useParams<{ communityId: string }>();


    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    const { domains, fetchDomains } = useDomainsStore();
    const navigate = useNavigate();

    const coverPhotoRef = React.useRef<HTMLInputElement>(null);
    const logoPhotoRef = React.useRef<HTMLInputElement>(null);
    const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);
    const [logoPhoto, setLogoPhoto] = React.useState<File | null>(null);
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    // const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            communityType: 'public',
            location: '',
            category: '',
            subCategory: '',
        },
    });


    const onSubmit = (data: FormData) => {


        if (!logoPhoto) {
            toast.error('Please upload a logo photo.');
            return;
        }

        // check logo photo is png and jpg, jpeg, webp
        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (!validImageTypes.includes(logoPhoto.type)) {
            toast.error('Logo photo must be a PNG, JPG, JPEG, or WEBP image.');
            return;
        }

        // if cover photo is provided, check its type
        if (coverPhoto && !validImageTypes.includes(coverPhoto.type)) {
            toast.error('Cover photo must be a PNG, JPG, JPEG, or WEBP image.');
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
        if (coverPhoto) {
            formData.append('cover', coverPhoto);
        }
        if (logoPhoto) {
            formData.append('file', logoPhoto);
        }

        createCommunity(formData, communityId).then(() => {
            toast.success('Community created successfully');
            navigate(`/community/mycommunities`);
        }).catch(error => {
            console.error('Error creating community:', error);
            toast.error('Failed to create community');
        });
    };


    const fetchCommunityDetails = React.useCallback(async () => {
        if (communityId) {
            const response = await fetchCommunityById(communityId);
            const data = response?.category;
            // Set form values with fetched data
            if (response) {
                setValue('name', data?.title || '');
                setValue('description', data?.description || '');
                setValue('location', '');
                setValue('category', '');
                setValue('subCategory', '');
                setLogoPreview(data?.image || null);
            }
        }
    }, [communityId]);

    React.useEffect(() => {
        if (communityId) {
            fetchCommunityDetails();
        }
    }, [communityId, fetchCommunityDetails]);


    return (
        <CommunityLayout active='mycommunities'>

            <div className="container px-4 py-8 ">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* max-w-4xl */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-cblack">Create Community</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label htmlFor="community-name" className="block mb-2 font-medium">
                                Name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="community-name"
                                placeholder="Enter community name"
                                className="w-full border-gray-300"
                                {...register('name')}
                            />
                            {
                                errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )
                            }
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
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select community type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.communityType && (
                                <p className="text-red-500 text-sm mt-1">{errors.communityType.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="location" className="block mb-2 font-medium">
                                Location
                            </Label>
                            <Select
                                onValueChange={(value) => console.log('Selected location:', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="global">Global</SelectItem>
                                    <SelectItem value="local">Local</SelectItem>
                                    <SelectItem value="regional">Regional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="category" className="font-medium">
                                    Category/Domain<span className="text-red-500">*</span>
                                </Label>
                                <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto cursor-pointer whitespace-nowrap !rounded-button">
                                    <i className="fas fa-plus mr-1 text-xs"></i> Create Category
                                </Button>
                            </div>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select
                                        value={field.value} onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Enter category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {domains && domains?.map((domain) => (
                                                <SelectItem key={domain.id} value={domain?.id?.toString()}>
                                                    {domain.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {
                                errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )
                            }
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="sub-category" className="font-medium">
                                    Sub-Category
                                </Label>
                                <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto cursor-pointer whitespace-nowrap !rounded-button">
                                    <i className="fas fa-plus mr-1 text-xs"></i> Create Sub-Category
                                </Button>
                            </div>
                            <Select
                                onValueChange={(value) => console.log('Selected sub-category:', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Enter category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="web-dev">Web Development</SelectItem>
                                    <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                                    <SelectItem value="ai">Artificial Intelligence</SelectItem>
                                    <SelectItem value="data-science">Data Science</SelectItem>
                                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Enter Description <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <JoditEditor
                                    value={field.value || ""}
                                    config={editorConfig}
                                    onBlur={(newValue) => field.onChange(newValue)}
                                    onChange={(newValue) => field.onChange(newValue)}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label className="block mb-2 font-medium">
                                Cover Photo<span className="text-red-500">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer">
                                {!coverPhoto && <div className="flex flex-col items-center justify-center space-y-4" onClick={() => coverPhotoRef.current?.click()}>
                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Upload className="text-[--IndexBlue]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-[--IndexBlue]">Upload Cover Photo</p>
                                        <p className="text-sm text-gray-500 mt-1">Max. size: 10 MB</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Drag and drop your images/videos here or click to browse
                                        </p>
                                    </div>
                                    <Button variant="outline" className="mt-4 cursor-pointer whitespace-nowrap !rounded-button" type='button'>
                                        Browse Files
                                    </Button>
                                </div>
                                }
                                {
                                    coverPhoto && (
                                        <div className="mt-4">
                                            <div className="flex justify-center py-1.5">
                                                <img
                                                    src={URL.createObjectURL(coverPhoto)}
                                                    alt="Cover Preview"
                                                    className="w-32 rounded-lg"
                                                />
                                            </div>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setCoverPhoto(null);
                                                    coverPhotoRef.current!.value = '';
                                                    coverPhotoRef.current?.click()
                                                }}
                                            >
                                                Click to change
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                            <input
                                ref={coverPhotoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setCoverPhoto(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                        {!logoPreview && <div>
                            <Label className="block mb-2 font-medium">
                                Logo Photo<span className="text-red-500">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer">
                                {!logoPhoto &&
                                    <div className="flex flex-col items-center justify-center space-y-4" onClick={() => logoPhotoRef.current?.click()}>
                                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Upload className="text-[--IndexBlue]" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-[--IndexBlue]">Upload Logo Photo</p>
                                            <p className="text-sm text-gray-500 mt-1">Max. size: 10 MB</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Drag and drop your images/videos here or click to browse
                                            </p>
                                        </div>
                                        <Button variant="outline" className="mt-4 cursor-pointer whitespace-nowrap !rounded-button" type='button'>
                                            Browse Files
                                        </Button>
                                    </div>
                                }
                                {
                                    logoPhoto && (
                                        <div className="mt-4">
                                            <div className="flex justify-center">
                                                <img
                                                    src={URL.createObjectURL(logoPhoto)}
                                                    alt="Logo Preview"
                                                    className="w-32 h-auto rounded-lg"
                                                />
                                            </div>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setLogoPhoto(null);
                                                    logoPhotoRef.current!.value = '';
                                                    logoPhotoRef.current?.click()
                                                }}
                                            >
                                                Click to change
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                            <input
                                ref={logoPhotoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setLogoPhoto(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                        }
                        {
                            logoPreview && <div className='border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center cursor-pointer'>
                                <Label className="block mb-2 font-medium">
                                    Logo Photo
                                </Label>
                                <div className="flex justify-center">
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        className="w-32 h-auto rounded-lg"
                                    />
                                </div>
                                <Button
                                    type='button'
                                    variant="link"
                                    onClick={() => {
                                        setLogoPreview(null);
                                        setLogoPhoto(null);
                                        logoPhotoRef.current!.value = '';
                                        logoPhotoRef.current?.click()
                                    }}
                                >
                                    Click to change
                                </Button>
                            </div>
                        }
                    </div>

                    <Alert className="bg-[--IndexBlue]/50 border-[--IndexBlue] text-[--IndexBlue] mb-8">
                        <div className="flex items-center">
                            <i className="fas fa-circle-info mr-2 text-[--IndexBlue]"></i>
                            <AlertDescription>
                                Active for 1 month only. Extend with coordinator recommendation or admin approval.
                            </AlertDescription>
                        </div>
                    </Alert>
                    <div className="flex justify-end space-x-2 mt-8">
                        <Button variant="outline" className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]">
                            Cancel
                        </Button>
                        <Button className="bg-[--IndexBlue] text-white cursor-pointer whitespace-nowrap !rounded-button">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </CommunityLayout>
    );
};
export default App