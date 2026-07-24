import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useEventCategories, useCreateEvent, useEventById, useUpdateEvent } from '@/hooks/data/collaborate/useEvents'
import { toast } from 'sonner'
import { useAuth } from '@/auth'
import { useSkills } from '@/hooks/data/useSkills'
import { Skill } from '@/@types/skills'
import { useFunctionalDomains } from '@/hooks/data/useFunctionalDomain'
import { useParams, useNavigate } from 'react-router-dom'

const eventSchema = z.object({
    eventCategory: z.number().min(1, 'Event Category is required'),
    eventTitle: z.string().min(1, 'Event Title is required'),
    eventDate: z.string().min(1, 'Event Date is required'),
    sessionHours: z.string().min(1, 'Session Hours is required'),
    description: z.string().min(1, 'Description is required'),
    expertName: z.string().min(1, 'Expert Name is required'),
    expertDesignation: z.string().min(1, 'Expert Designation is required'),
    expertImage: z.any().optional(),
    skillsCovered: z.string().min(1, 'Skills Covered is required'),
    functionalDomain: z.string().min(1, 'Functional Domain is required'),
    creatorLevel: z.string().min(1, 'Creator Level is required'),
    modeOfDelivery: z.string().min(1, 'Mode of Delivery is required'),
    venue: z.string().optional(),
}).refine((data) => {
    if (data.modeOfDelivery === 'offline' && !data.venue) {
        return false;
    }
    return true;
}, {
    message: 'Venue is required for offline events',
    path: ['venue'],
})

type EventFormData = z.infer<typeof eventSchema>

const AddEvent = () => {


    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // get event Category name form ?category=
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [bannerError, setBannerError] = useState<string>('');
    const { data: eventCategories, isLoading: isLoadingEventCategories } = useEventCategories();
    const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
    const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
    const { data: eventData} = useEventById(id);
    const { data: skills = [], isLoading: isLoadingSkills } = useSkills();
    const { data: functionalDomains = [], isLoading: isLoadingDomains } = useFunctionalDomains();
    // update event categories alphabetically
    const sortedEventCategories = eventCategories?.slice().sort((a, b) => a.name.localeCompare(b.name));

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventCategory: 0,
            eventTitle: '',
            eventDate: '',
            sessionHours: '',
            description: '',
            expertName: user && user?.name || '',
            expertDesignation: 'Admin',
            skillsCovered: '',
            functionalDomain: '',
            creatorLevel: '',
            modeOfDelivery: '',
            venue: '',
        }
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue('expertImage', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setBannerError('Only JPG and PNG files are allowed');
            return;
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            setBannerError('File size must be less than 3MB');
            return;
        }

        setBannerError('');
        setBannerImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };



    const onSubmit = (data: EventFormData) => {
        // Combine date and time for start_date with seconds
        const startDateTime = `${data.eventDate} ${data.sessionHours}:00`;
        // Calculate end_date (add 2 hours to session time as example)
        const endDateTime = `${data.eventDate} ${data.sessionHours}:00`;

        // Calculate reg_due_date as 12 hours before event start
        const eventStart = new Date(`${data.eventDate}T${data.sessionHours}:00`);
        const regDueDate = new Date(eventStart.getTime() - 12 * 60 * 60 * 1000);
        const regDueDateString = `${regDueDate.getFullYear()}-${String(regDueDate.getMonth() + 1).padStart(2, '0')}-${String(regDueDate.getDate()).padStart(2, '0')} ${String(regDueDate.getHours()).padStart(2, '0')}:${String(regDueDate.getMinutes()).padStart(2, '0')}:${String(regDueDate.getSeconds()).padStart(2, '0')}`;

        // Convert comma-separated skill IDs to array
        const skillIds = data.skillsCovered.split(',').filter(id => id.trim() !== '');

        const eventData = {
            name: data.eventTitle,
            start_date: startDateTime,
            end_date: endDateTime,
            reg_due_date: regDueDateString,
            description: data.description,
            event_mode: data.modeOfDelivery as 'online' | 'offline',
            instructions: data.expertName,
            venue: data.venue,
            event_category_id: data.eventCategory,
            expertDesignation: data.expertDesignation,
            expertImage: data.expertImage,
            image: '',
            file: bannerImage,
            'skill_id[]': skillIds,
            domain_id: data.functionalDomain,
            creatorLevel: data.creatorLevel,
            organization_id: user.organization_id,
        };

        if (isEditMode && id) {
            // Update mode - add program_id
            const updateData = {
                ...eventData,
                program_id: id,
            };

            updateEvent(updateData, {
                onSuccess: () => {
                    toast.success('Event updated successfully!');
                    navigate(`/collaborate/events/${id}`);
                },
                onError: (error) => {
                    toast.error('Failed to update event: ' + error);
                },
            });
        } else {
            // Create mode
            createEvent(eventData, {
                onSuccess: () => {
                    setShowSuccessDialog(true);
                    reset();
                    setImagePreview(null);
                    setSelectedSkills([]);
                    setBannerImage(null);
                    setBannerPreview(null);
                    setBannerError('');
                },
                onError: (error) => {
                    toast.error('Failed to create event: ' + error);
                },
            });
        }
    }

    // useEffect to set event category from URL
    useEffect(() => {
        if (categoryFromUrl && sortedEventCategories && !isEditMode) {
            const matchedCategory = sortedEventCategories.find(
                (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
            );
            if (matchedCategory) {
                setValue('eventCategory', matchedCategory.id);
            }
        }
    }, [categoryFromUrl, sortedEventCategories, setValue, isEditMode]);

    // useEffect to auto-fill form when editing
    useEffect(() => {
        if (isEditMode && eventData && skills.length > 0) {
            const programData = eventData.competitions_details?.program;
            const eventDetails = programData?.event_details;
            const instructions = eventData.competition_instructions;
            const eventSkills = eventData?.skills || [];

            if (!programData) return;

            // Extract date and time from start_date (format: "YYYY-MM-DD HH:MM:SS")
            if (programData.start_date) {
                const startDateParts = programData.start_date.split(' ');
                const eventDate = startDateParts[0]; // YYYY-MM-DD
                const sessionTime = startDateParts[1]?.substring(0, 5); // HH:MM

                setValue('eventDate', eventDate || '');
                setValue('sessionHours', sessionTime || '');
            }

            // Set basic fields from program
            setValue('eventTitle', programData.name || '');
            setValue('description', programData.description || '');

            // Set expert name from instructions
            setValue('expertName', instructions?.instructions || '');
            setValue('expertDesignation', 'Admin');

            // Set mode of delivery based on venue
            if (eventDetails?.venue && eventDetails.venue.trim() !== '') {
                setValue('modeOfDelivery', 'offline');
                setValue('venue', eventDetails.venue);
            } else {
                setValue('modeOfDelivery', 'online');
                setValue('venue', '');
            }

            // Set event category
            if (eventDetails?.event_category_id) {
                setValue('eventCategory', Number(eventDetails.event_category_id) || 0);
            }

            // Set creator level (default to 'builder' if not available)
            setValue('creatorLevel', programData.competition_level || 'builder');

            // Set functional domain - match by name
            if (eventDetails?.functional_domain && functionalDomains.length > 0) {
                const matchedDomain = functionalDomains.find(
                    d => d.name.toLowerCase() === eventDetails.functional_domain?.toLowerCase()
                );
                if (matchedDomain) {
                    setValue('functionalDomain', matchedDomain.id.toString());
                }
            }

            // Set skills - convert skill names to IDs
            if (eventSkills.length > 0 && skills.length > 0) {
                const matchedSkills: Skill[] = [];
                const skillIds: string[] = [];

                eventSkills.forEach((skillName: string) => {
                    const foundSkill = skills.find(s => s.skill_name === skillName);
                    if (foundSkill) {
                        matchedSkills.push(foundSkill);
                        skillIds.push(foundSkill.skill_id.toString());
                    }
                });

                setSelectedSkills(matchedSkills);
                setValue('skillsCovered', skillIds.join(','));
            }

            // Set banner preview if image exists
            if (programData.image) {
                setBannerPreview(programData.image);
            }
        }
    }, [isEditMode, eventData, skills, functionalDomains, setValue]);


    return (
        <Card>
            <CardContent>
                <div className="mx-auto">
                    {/* Header */}
                    <div className="bg-[#2a2a2a] rounded-lg p-6 mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span>👋</span> Hello Organizer!
                            </h1>
                            <p className="text-lg text-white mt-2">
                                {isEditMode
                                    ? `Update your event details and we'll review the changes!`
                                    : `Your event could spark someone's next big idea. Let's make it happen!`
                                }
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                {isEditMode
                                    ? `Make any necessary changes and submit for review.`
                                    : `Thanks for sharing your event idea – we're excited to review it!`
                                }
                            </p>
                        </div>
                        <div
                            className="bg-[#7FBC42] hover:bg-[#6da635] text-black px-8 py-6 text-lg rounded-lg text-center flex flex-col items-center justify-center cursor-pointer"
                            style={{ pointerEvents: isCreating || isUpdating ? 'none' : 'auto', opacity: isCreating || isUpdating ? 0.6 : 1 }}
                            onClick={() => {
                                document.getElementById('event-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }}
                        >
                            <ArrowRight />
                            {
                                isUpdating && 'Updating...'
                            }
                            {
                                isCreating && 'Sending...'
                            }
                            {
                                !isCreating && !isUpdating && (isEditMode ? 'Update' : 'Send')
                            }
                            <br />
                            {
                                isEditMode ? 'Event' : 'Request'
                            }
                        </div>
                    </div>

                    {/* Banner Upload Section */}
                    <div className="bg-[#2a2a2a] rounded-lg p-6 mb-6">
                        <Label className="text-white text-base font-semibold mb-2 block">
                            Event Banner<span className="text-red-500">*</span>
                        </Label>
                        <p className="text-gray-400 text-sm mb-4">
                            Upload a banner image for your event. Accepted formats: JPG, PNG | Max size: 3MB
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        className="hidden"
                                        onChange={handleBannerUpload}
                                    />
                                    <div className="bg-[#7FBC42] hover:bg-[#6da635] text-black px-6 py-2 rounded-lg font-semibold transition">
                                        {bannerImage ? 'Change Banner' : 'Upload Banner'}
                                    </div>
                                </label>
                                {bannerImage && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setBannerImage(null);
                                            setBannerPreview(null);
                                            setBannerError('');
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                            {bannerError && (
                                <p className="text-red-500 text-sm">{bannerError}</p>
                            )}
                            {bannerPreview && (
                                <div className="mt-2">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        className="w-full max-h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <form id="event-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Row 2: Event Details & Expert Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Event Details */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6 col-span-2">
                                <Label className="text-white font-semibold mb-4 block text-lg">
                                    Event Details
                                </Label>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white text-sm font-medium mb-2 block">
                                            Event Title<span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="eventTitle"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Enter event title"
                                                    className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500"
                                                />
                                            )}
                                        />
                                        {errors.eventTitle && (
                                            <p className="text-red-500 text-xs mt-1">{errors.eventTitle.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-white text-sm font-medium mb-2 block">
                                            Event Description<span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="description"
                                            render={({ field }) => (
                                                <div className="relative">
                                                    <textarea
                                                        {...field}
                                                        rows={4}
                                                        placeholder="Enter event description"
                                                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-md text-white placeholder:text-gray-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#7FBC42]"
                                                    />
                                                    {errors.description && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Expert Details */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6 col-span-2">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Expert Details<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">Who is conducting this event?</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <Controller
                                        control={control}
                                        name="expertName"
                                        render={({ field }) => (
                                            <div>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                        <SelectValue placeholder="Select name" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={user && user?.name || 'User'}>{user && user?.name || 'User'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.expertName && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.expertName.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="expertDesignation"
                                        render={({ field }) => (
                                            <div>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                        <SelectValue placeholder="Select designation" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.expertDesignation && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.expertDesignation.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <div>
                                        <label className="flex flex-col items-center justify-center h-10 bg-[#3a3a3a] border border-gray-600 rounded-md cursor-pointer hover:bg-[#4a4a4a] transition">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-md" />
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Upload className="h-4 w-4" />
                                                    <span className="text-xs">Image</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 1: Event Category & Event Timeline */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Event Category */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Event Category<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">What type of experience are you creating?</p>
                                <Controller
                                    control={control}
                                    name="eventCategory"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value > 0 ? field.value.toString() : ''}
                                            disabled={isLoadingEventCategories}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    sortedEventCategories?.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.eventCategory && (
                                    <p className="text-red-500 text-sm mt-1">{errors.eventCategory.message}</p>
                                )}
                            </div>

                            {/* Event Timeline */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Event Timeline<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">
                                    Registration starts 7 days before the Event Date and Ends 12 Hours before Event begins.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        control={control}
                                        name="eventDate"
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="bg-[#3a3a3a] border-gray-600 text-white pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <mask id="mask0_4221_460" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                            <rect width="24" height="24" fill="#D9D9D9" />
                                                        </mask>
                                                        <g mask="url(#mask0_4221_460)">
                                                            <path d="M5 8H19V6H5V8ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V3C6 2.71667 6.09583 2.47917 6.2875 2.2875C6.47917 2.09583 6.71667 2 7 2C7.28333 2 7.52083 2.09583 7.7125 2.2875C7.90417 2.47917 8 2.71667 8 3V4H16V3C16 2.71667 16.0958 2.47917 16.2875 2.2875C16.4792 2.09583 16.7167 2 17 2C17.2833 2 17.5208 2.09583 17.7125 2.2875C17.9042 2.47917 18 2.71667 18 3V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V10.675C21 10.9583 20.9042 11.1958 20.7125 11.3875C20.5208 11.5792 20.2833 11.675 20 11.675C19.7167 11.675 19.4792 11.5792 19.2875 11.3875C19.0958 11.1958 19 10.9583 19 10.675V10H5V20H10.8C11.0833 20 11.3208 20.0958 11.5125 20.2875C11.7042 20.4792 11.8 20.7167 11.8 21C11.8 21.2833 11.7042 21.5208 11.5125 21.7125C11.3208 21.9042 11.0833 22 10.8 22H5ZM18 23C16.6167 23 15.4375 22.5125 14.4625 21.5375C13.4875 20.5625 13 19.3833 13 18C13 16.6167 13.4875 15.4375 14.4625 14.4625C15.4375 13.4875 16.6167 13 18 13C19.3833 13 20.5625 13.4875 21.5375 14.4625C22.5125 15.4375 23 16.6167 23 18C23 19.3833 22.5125 20.5625 21.5375 21.5375C20.5625 22.5125 19.3833 23 18 23ZM18.5 17.8V15.5C18.5 15.3667 18.45 15.25 18.35 15.15C18.25 15.05 18.1333 15 18 15C17.8667 15 17.75 15.05 17.65 15.15C17.55 15.25 17.5 15.3667 17.5 15.5V17.775C17.5 17.9083 17.525 18.0375 17.575 18.1625C17.625 18.2875 17.7 18.4 17.8 18.5L19.325 20.025C19.425 20.125 19.5417 20.175 19.675 20.175C19.8083 20.175 19.925 20.125 20.025 20.025C20.125 19.925 20.175 19.8083 20.175 19.675C20.175 19.5417 20.125 19.425 20.025 19.325L18.5 17.8Z" fill="white" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                {errors.eventDate && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.eventDate.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="sessionHours"
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    {...field}
                                                    className="bg-[#3a3a3a] border-gray-600 text-white pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <mask id="mask0_4221_476" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                            <rect width="24" height="24" fill="#D9D9D9"/>
                                                        </mask>
                                                        <g mask="url(#mask0_4221_476)">
                                                            <path d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V3C6 2.71667 6.09583 2.47917 6.2875 2.2875C6.47917 2.09583 6.71667 2 7 2C7.28333 2 7.52083 2.09583 7.7125 2.2875C7.90417 2.47917 8 2.71667 8 3V4H16V3C16 2.71667 16.0958 2.47917 16.2875 2.2875C16.4792 2.09583 16.7167 2 17 2C17.2833 2 17.5208 2.09583 17.7125 2.2875C17.9042 2.47917 18 2.71667 18 3V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8ZM12 14C11.7167 14 11.4792 13.9042 11.2875 13.7125C11.0958 13.5208 11 13.2833 11 13C11 12.7167 11.0958 12.4792 11.2875 12.2875C11.4792 12.0958 11.7167 12 12 12C12.2833 12 12.5208 12.0958 12.7125 12.2875C12.9042 12.4792 13 12.7167 13 13C13 13.2833 12.9042 13.5208 12.7125 13.7125C12.5208 13.9042 12.2833 14 12 14ZM8 14C7.71667 14 7.47917 13.9042 7.2875 13.7125C7.09583 13.5208 7 13.2833 7 13C7 12.7167 7.09583 12.4792 7.2875 12.2875C7.47917 12.0958 7.71667 12 8 12C8.28333 12 8.52083 12.0958 8.7125 12.2875C8.90417 12.4792 9 12.7167 9 13C9 13.2833 8.90417 13.5208 8.7125 13.7125C8.52083 13.9042 8.28333 14 8 14ZM16 14C15.7167 14 15.4792 13.9042 15.2875 13.7125C15.0958 13.5208 15 13.2833 15 13C15 12.7167 15.0958 12.4792 15.2875 12.2875C15.4792 12.0958 15.7167 12 16 12C16.2833 12 16.5208 12.0958 16.7125 12.2875C16.9042 12.4792 17 12.7167 17 13C17 13.2833 16.9042 13.5208 16.7125 13.7125C16.5208 13.9042 16.2833 14 16 14ZM12 18C11.7167 18 11.4792 17.9042 11.2875 17.7125C11.0958 17.5208 11 17.2833 11 17C11 16.7167 11.0958 16.4792 11.2875 16.2875C11.4792 16.0958 11.7167 16 12 16C12.2833 16 12.5208 16.0958 12.7125 16.2875C12.9042 16.4792 13 16.7167 13 17C13 17.2833 12.9042 17.5208 12.7125 17.7125C12.5208 17.9042 12.2833 18 12 18ZM8 18C7.71667 18 7.47917 17.9042 7.2875 17.7125C7.09583 17.5208 7 17.2833 7 17C7 16.7167 7.09583 16.4792 7.2875 16.2875C7.47917 16.0958 7.71667 16 8 16C8.28333 16 8.52083 16.0958 8.7125 16.2875C8.90417 16.4792 9 16.7167 9 17C9 17.2833 8.90417 17.5208 8.7125 17.7125C8.52083 17.9042 8.28333 18 8 18ZM16 18C15.7167 18 15.4792 17.9042 15.2875 17.7125C15.0958 17.5208 15 17.2833 15 17C15 16.7167 15.0958 16.4792 15.2875 16.2875C15.4792 16.0958 15.7167 16 16 16C16.2833 16 16.5208 16.0958 16.7125 16.2875C16.9042 16.4792 17 16.7167 17 17C17 17.2833 16.9042 17.5208 16.7125 17.7125C16.5208 17.9042 16.2833 18 16 18Z" fill="white"/>
                                                        </g>
                                                    </svg>
                                                </div>
                                                {errors.sessionHours && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.sessionHours.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Skills, Domain, Level, Delivery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Skills Covered */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Skills Covered<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">List the skills creators will learn or practice.</p>
                                <Controller
                                    control={control}
                                    name="skillsCovered"
                                    render={({ field }) => (
                                        <div>
                                            <Select
                                                value=""
                                                disabled={isLoadingSkills}
                                                onValueChange={(value) => {
                                                    const skillId = parseInt(value);
                                                    const skill = skills.find(s => s.skill_id === skillId);
                                                    if (skill && !selectedSkills.some(s => s.skill_id === skillId)) {
                                                        const newSkills = [...selectedSkills, skill];
                                                        setSelectedSkills(newSkills);
                                                        field.onChange(newSkills.map(s => s.skill_id).join(','));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                    <SelectValue placeholder={isLoadingSkills ? "Loading skills..." : "Select skills"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {skills
                                                        .filter(skill => !selectedSkills.some(s => s.skill_id === skill.skill_id))
                                                        .sort((a, b) => a.skill_name.localeCompare(b.skill_name))
                                                        .map((skill) => (
                                                            <SelectItem key={skill.skill_id} value={skill.skill_id.toString()}>
                                                                {skill.skill_name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedSkills.map((skill) => (
                                                        <div
                                                            key={skill.skill_id}
                                                            className="bg-[#7FBC42] text-white px-3 py-1 rounded-md text-xs flex items-center gap-2"
                                                        >
                                                            {skill.skill_name}
                                                            <button
                                                                type="button"
                                                                className="hover:text-red-200"
                                                                onClick={() => {
                                                                    const newSkills = selectedSkills.filter(s => s.skill_id !== skill.skill_id);
                                                                    setSelectedSkills(newSkills);
                                                                    field.onChange(newSkills.map(s => s.skill_id).join(','));
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                                {errors.skillsCovered && (
                                    <p className="text-red-500 text-sm mt-1">{errors.skillsCovered.message}</p>
                                )}
                            </div>

                            {/* Functional Domain */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Functional Domain<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">Select the domain your event belongs to.</p>
                                <Controller
                                    control={control}
                                    name="functionalDomain"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            disabled={isLoadingDomains}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                <SelectValue placeholder={isLoadingDomains ? "Loading domains..." : "Select domain"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {functionalDomains
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((domain) => (
                                                        <SelectItem key={domain.id} value={domain.id.toString()}>
                                                            {domain.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.functionalDomain && (
                                    <p className="text-red-500 text-sm mt-1">{errors.functionalDomain.message}</p>
                                )}
                            </div>

                            {/* Creator Level */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Creator Level<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">Who is this event best suited for?</p>
                                <Controller
                                    control={control}
                                    name="creatorLevel"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="builder">Builder</SelectItem>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.creatorLevel && (
                                    <p className="text-red-500 text-sm mt-1">{errors.creatorLevel.message}</p>
                                )}
                            </div>

                            {/* Mode of Delivery */}
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Mode of Delivery<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">How will the session be hosted?</p>
                                <Controller
                                    control={control}
                                    name="modeOfDelivery"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="bg-[#3a3a3a] border-gray-600 text-white">
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="online">Remote</SelectItem>
                                                <SelectItem value="offline">On-site</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.modeOfDelivery && (
                                    <p className="text-red-500 text-sm mt-1">{errors.modeOfDelivery.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Venue - Show only when offline is selected */}
                        {control._formValues.modeOfDelivery === 'offline' && (
                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                <Label className="text-white text-base font-semibold mb-2 block">
                                    Venue Location<span className="text-red-500">*</span>
                                </Label>
                                <p className="text-gray-400 text-sm mb-4">Where will the on-site event take place?</p>
                                <Controller
                                    control={control}
                                    name="venue"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter venue address"
                                            className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500"
                                        />
                                    )}
                                />
                                {errors.venue && (
                                    <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </CardContent>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="bg-[#2a2a2a] border-gray-600">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl flex items-center gap-2">
                            <span>✅</span> Request Sent Successfully!
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-base mt-4">
                            Your event request has been submitted successfully. We will review it and get back to you soon.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-6">
                        <Button
                            className="bg-[#7FBC42] hover:bg-[#6da635] text-white"
                            onClick={() => setShowSuccessDialog(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default AddEvent