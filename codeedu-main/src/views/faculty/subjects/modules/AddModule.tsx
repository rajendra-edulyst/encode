import { ProgramDetails } from '@/@types/faculty/program';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import { Textarea } from '@/components/ui/textarea';
import { createProgram } from '@/services/faculty/ProgramService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface AddModuleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    program: ProgramDetails;
}


const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, "Description is required"),
});

type FormRequestData = z.infer<typeof formSchema>;

const AddModule = ({ open, onOpenChange, program }: AddModuleProps) => {

    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });


    const createModuleMutation = useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            toast.success("Content created successfully!");
            queryClient.invalidateQueries({ queryKey: ['program-details'] });
            reset();
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(`Something went wrong: ${error}`);
        }
    });


    const onSubmit = (data: FormRequestData) => {
        console.log("Submitting form data:", data);
        const formData = new FormData();
        formData.append('name', data.name);
        // Add a default level value
        formData.append('level', '3');
        formData.append('status', 'Active');
        formData.append('description', data.description);
        formData.append('parent_id', program.skill_id);
        createModuleMutation.mutate(formData);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add Module</DialogTitle>
                        <DialogDescription>Create a new module for your program. You can add contents to this module after creation.</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 mt-4'>
                        <div>
                            <Label>Module Name</Label>
                            <Input placeholder='Module Name' className='mb-4' {...register('name')} />
                            {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Enter Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">Description is required</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" size="sm" className="text-white mt-3 w-full" disabled={createModuleMutation.isPending}>
                            {
                                createModuleMutation.isPending ? 'Creating...' : 'Create Module'
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddModule