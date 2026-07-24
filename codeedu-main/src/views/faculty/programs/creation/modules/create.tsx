import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'
import { createProgram } from '@/services/faculty/ProgramService'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreateProgramData } from '@/@types/faculty/program'
import { X } from 'lucide-react'
import JoditEditor from 'jodit-react'
import { JoEditConfig } from '@/utils/joeditConfig'
import { memo, useMemo } from 'react'


const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
});

type FormData = z.infer<typeof formSchema>;


interface CreateModuleProps {
    skill_id: string;
    program_id: number;
    fetchProgramDetails?: (id: string, forceUpdate?: boolean) => void;
    handleModuleCreated: (newModule: CreateProgramData) => void;
    setAddModule?: (value: boolean) => void;
}

const CreateModule = ({ skill_id, program_id, fetchProgramDetails, handleModuleCreated, setAddModule }: CreateModuleProps) => {

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        // Add a default level value
        formData.append('level', '3');
        formData.append('status', 'Active');
        formData.append('description', data.description);
        formData.append('parent_id', skill_id);

        // Call the createProgram function with the form data
        createProgram(formData).then((res) => {
            toast.success('Program created successfully!');
            fetchProgramDetails?.(program_id.toString(), false);
            handleModuleCreated(res);
        }).catch((error) => {
            console.error('Error creating program:', error);
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader className='border-b'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle className='text-lg'>Add Module</CardTitle>
                            <p className='text-sm text-gray-500'>Create a new module for your program. You can add contents to this module after creation.</p>
                        </div>
                        <Button variant={"ghost"} size='icon' onClick={() => setAddModule?.(false)}>
                            <X />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='pt-4'>
                    <div>
                        <Label>Module Name</Label>
                        <Input placeholder='Module Name' className='mb-4' {...register('name')} />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
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
                            <p className="text-red-500 text-sm">Description is required</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className='flex justify-end p-4 border-t'>
                    <Button size='sm' className='text-white'>
                        Add Module
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default memo(CreateModule)