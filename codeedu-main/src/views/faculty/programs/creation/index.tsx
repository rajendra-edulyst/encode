import React, { memo, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import JoditEditor from 'jodit-react';
import Breadcrumb from '@/components/breadcrumb';
import { useProgramCategoryStore } from '@/store/faculty/ProgramStore';
import { createProgram } from '@/services/faculty/ProgramService';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { SelectSearch } from '@/components/SelectSearch';
import { JoEditConfig } from '@/utils/joeditConfig';

// Define the form schema using Zod
const formSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    shortCode: z.string().optional(),
    subscriptionType: z.enum(['paid', 'free'], { required_error: 'Subscription type is required' }).optional(),
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date({ required_error: 'End date is required' }).optional(),
    image: z.instanceof(File).optional().refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: 'Image size must be less than 5MB',
    }),
    weightage: z.string().min(0, 'Weightage must be a positive number').max(100, 'Weightage cannot exceed 100').optional(),
    learning_score: z.string().min(0, 'Learning score must be a positive number').max(100, 'Learning score cannot exceed 100').optional(),
    status: z.enum(['Active', 'Inactive', 'Suspended', 'Draft']).default('Active'),
});

// Define form data type
type FormData = z.infer<typeof formSchema>;

const ProgramForm: React.FC = () => {
    const navigate = useNavigate();
    const { programCategory, fetchProgramCategoryList } = useProgramCategoryStore();
    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250,
    }), []);

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            name: '',
            description: '',
            shortCode: '',
            subscriptionType: 'free',
            startDate: undefined,
            endDate: undefined,
            image: undefined,
            weightage: undefined,
            learning_score: undefined,
            status: 'Active',
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('category', data.category);
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('shortCode', data.shortCode || '');
        formData.append('subscriptionType', data.subscriptionType || 'free');
        formData.append('start_date', data.startDate.toISOString());
        if (data.endDate) {
            formData.append('end_date', data.endDate.toISOString());
        }
        if (data.image) {
            formData.append('file', data.image);
        }

        if (!data.image) {
            formData.append('image', `${window.location.origin}/img/courses/default.png`);
        }

        if (data.weightage !== undefined) {
            formData.append('Weightage', data.weightage.toString());
        }
        if (data.learning_score !== undefined) {
            formData.append('g_score', data.learning_score.toString());
        }
        formData.append('level', '1');
        formData.append('status', data.status);

        createProgram(formData)
            .then((res) => {
                toast.success('Program created successfully!');
                navigate(`/programs/${res.id}/modules`, {
                    state: { program: res },
                });
            })
            .catch((error) => {
                console.error('Error creating program:', error);
                toast.error('Failed to create program. Please try again.');
            });
    };

    // Fetch program categories when the component mounts
    React.useEffect(() => {
        fetchProgramCategoryList();
    }, [fetchProgramCategoryList]);

    const breadcrumbItems = [
        { label: 'Subjects', path: '/subjects' },
        { label: 'Create Subject', path: '/programs/create' },
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">Create Course/Subject</h1>
            </div>
            <form className="space-y-6 bg-white p-3 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='col-span-1 sm:col-span-2'>
                        <div className='grid grid-cols-1 sm:grid-cols-2'>
                            <div>
                                {/* Category */}
                                <div className='flex items-center justify-between'>
                                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                    <Button asChild variant="link" type='button' className='text-blue-500 hover:underline'>
                                        <Link to="/program/categories/create" className='flex'><Plus /> Add Category</Link>
                                    </Button>
                                </div>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <SelectSearch
                                                title="Select category"
                                                value={field.value?.toString()}
                                                className={cn(errors.category && "border-red-500 w-full")}
                                                options={
                                                    programCategory.map((category) => ({
                                                        value: category.id.toString(),
                                                        label: category.name,
                                                    }))
                                                }
                                                onChange={field.onChange}
                                            />
                                            {errors.category && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.category.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>
                    {/* Name */}
                    <div className='space-y-2'>
                        <Label htmlFor="name">Course/Subject Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            {...register('name')}
                            className={cn(errors.name && 'border-red-500')}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    {/* Short Code */}
                    <div className='space-y-2'>
                        <Label htmlFor="shortCode">Short Code <span className="text-red-500">*</span></Label>
                        <Input
                            id="shortCode"
                            {...register('shortCode')}
                            className={cn(errors.shortCode && 'border-red-500')}
                        />
                        {errors.shortCode && <p className="text-red-500 text-sm mt-1">{errors.shortCode.message}</p>}
                    </div>
                    {/* Subscription Type */}
                    <div className='space-y-2'>
                        <Label htmlFor="subscriptionType">Subscription Type <span className="text-red-500">*</span></Label>
                        <Controller
                            name="subscriptionType"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={cn(errors.subscriptionType && 'border-red-500')}>
                                        <SelectValue placeholder="Select subscription type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="free">Free</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.subscriptionType && <p className="text-red-500 text-sm mt-1">{errors.subscriptionType.message}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Start Date */}
                    <div className='space-y-2'>
                        <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground',
                                                errors.startDate && 'border-red-500'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            initialFocus
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                    {/* End Date */}
                    <div className='space-y-2'>
                        <Label htmlFor="endDate">End Date</Label>
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground',
                                                errors.endDate && 'border-red-500'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            initialFocus
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>

                {/* Description (Jodit Editor) */}
                <div className='space-y-2'>
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <JoditEditor
                                value={field.value || ""}
                                config={editorConfig}
                                onBlur={(newValue) => field.onChange(newValue)}
                                onChange={(newValue) => field.onChange(newValue)}
                            />
                        )}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Image Upload */}
                <div className='space-y-2'>
                    <Label htmlFor="image">Image</Label>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                className={cn(errors.image && 'border-red-500')}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file); // Update form state with the file
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setPreviewImage(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        field.onChange(null); // Clear the field if no file is selected
                                        setPreviewImage(null);
                                    }
                                }}
                            />
                        )}
                    />
                    {previewImage && (
                        <div className="mt-2">
                            <img src={previewImage} alt="Preview" className="max-w-xs rounded" />
                        </div>
                    )}
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                {/* Advanced Settings */}
                <div className='space-y-2'>
                    <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className='space-y-2'>
                            <Label htmlFor="weightage">Weightage</Label>
                            <Input
                                id="weightage"
                                type="number"
                                {...register('weightage')}
                                className={cn(errors.weightage && 'border-red-500')}
                            />
                            {errors.weightage && <p className="text-red-500 text-sm mt-1">{errors.weightage.message}</p>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="learning_score">Learning Score</Label>
                            <Input
                                id="learning_score"
                                type="number"
                                {...register('learning_score')}
                                className={cn(errors.learning_score && 'border-red-500')}
                            />
                            {errors.learning_score && <p className="text-red-500 text-sm mt-1">{errors.learning_score.message}</p>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="status">Status</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={cn(errors.status && 'border-red-500')}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" className='text-white'>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default memo(ProgramForm);