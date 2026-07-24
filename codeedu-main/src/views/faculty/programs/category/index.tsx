import Breadcrumb from '@/components/breadcrumb';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import { createCategory } from '@/services/faculty/ProgramService';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    status: z.enum(['Active', 'Inactive', 'Suspended', 'Draft']).default('Active'),
});

type FormData = z.infer<typeof formSchema>;


const CategoryCreate = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            status: 'Active',
        },
    });

    const breadcrumbItems = [
        { label: 'Programs', path: '/subjects' },
        { label: 'Categories', path: '' },
    ];


    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('status', data.status);
        // Call the API to create the category
        createCategory(formData).then(() => {
            toast.success('Category created successfully');
            navigate('/programs/create');
        }).catch(error => {
            toast.error(`Error creating category: ${error}`);
        });
    };

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">Create Course/Subject Category</h1>
                <form className="space-y-6 bg-white p-3 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1 sm:col-span-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" {...register('description')} />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <Label htmlFor="status">Status</Label>
                            <Select {...register('status')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                        </div>
                    </div>
                    <Button type="submit" className='text-white'>Create</Button>
                </form>
            </div>
        </div>
    )
}

export default CategoryCreate