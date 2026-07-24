import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { updateModuleDetails } from '@/services/faculty/ProgramService'
import { memo, useEffect, useCallback, useState, useMemo } from 'react'
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore'
import { stripHtmlTags } from '@/utils/stripHtmlTags'
import { JoEditConfig } from '@/utils/joeditConfig'
import JoditEditor from 'jodit-react'



const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
});

type FormData = z.infer<typeof formSchema>;


const UpdateModule = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { program, setProgram, setSelectedModule, selectedModule } = useProgramDetailsStore();

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: selectedModule?.name || '',
            description: selectedModule?.description || '',
        },
    });

    const onSubmit = useCallback(async (data: FormData) => {
        if (isSubmitting) return;
        if (!selectedModule?.id) {
            toast.error('Module ID is missing. Please select a module to update.');
            return;
        }

        setIsSubmitting(true)
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('status', 'Active');
        formData.append('description', data.description);
        formData.append('id', selectedModule?.id?.toString());

        try {
            await updateModuleDetails(formData);
            toast.success('Module updated successfully!');
            // Update the module in the program state
            const updatedModules = program?.modules.map((mod) =>
                mod.id === selectedModule?.id ? { ...mod, name: data.name, description: data.description } : mod
            );

            if (!updatedModules) {
                throw new Error('No modules found in the program');
            }

            if (!program) {
                throw new Error('Program ID is missing');
            }

            setProgram({
                ...program,
                modules: updatedModules,
            });

            if (selectedModule?.id) {
                setSelectedModule({
                    ...selectedModule,
                    name: data.name,
                    description: data.description,
                });
            }
        } catch (error) {
            console.error('Error updating module:', error);
            toast.error('Failed to update module.');
        } finally {
            setIsSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitting, selectedModule]);


    useEffect(() => {
        if (selectedModule) {
            console.log('Selected Module:', selectedModule);
            reset({
                name: selectedModule?.name || '',
                description: selectedModule?.description || '',
            });
        }
    }, [selectedModule, reset]);

    return (
        <Collapsible>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader className='border-b'>
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                                <CardTitle className='text-lg'>{selectedModule?.name}</CardTitle>
                                <p className='text-sm text-gray-500'>
                                    {stripHtmlTags(selectedModule?.description || '')}
                                </p>
                            </div>
                            <div>
                                <CollapsibleTrigger className='text-gray-500 hover:text-gray-700 border p-1.5 rounded'>
                                    <Pencil size={16} />
                                </CollapsibleTrigger>
                            </div>
                        </div>
                    </CardHeader>
                    <CollapsibleContent>
                        <CardContent className='pt-4'>
                            <div>
                                <Label>Module Name</Label>
                                <Input placeholder='Module Name' className='mb-4' {...register('name')} />
                                {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                            </div>
                            <div>
                                <Label>Description</Label>
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
                                />                                {errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-end p-4 border-t'>
                            <Button size='sm' className='text-white' disabled={isSubmitting} type='submit'>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </CollapsibleContent>
                </Card>
            </form>
        </Collapsible>
    )
}

export default memo(UpdateModule)