import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@/components/ui/ShadcnButton';
import { uploadeAssignment } from '@/services/learner/assignmentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { Controller } from 'react-hook-form';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { saveCourseTimespan } from '@/services/learner/CourseService';



interface UploadAssignmentProps {
    show: boolean;
    onClose: () => void;
    content_id: number;
}

const getAssignmentSchema = (cci: string | null) => z.object({
    file: cci === '2' 
        ? z.any().optional() 
        : z.any()
            .refine((files) => files?.length > 0, "File is required")
            .refine(
                (files) => files?.[0]?.type === "application/pdf",
                "Only PDF files are allowed"
            ),
    note: cci === '1' ? z.string().optional() : z.string().min(1, "Note is required"),
});

type AssignmentFormData = {
    file: any;
    note?: string;
};


function UploadAssignment({ show, onClose, content_id }: UploadAssignmentProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const cci = searchParams.get('cci');



    const queryClient = useQueryClient();
    const schema = React.useMemo(() => getAssignmentSchema(cci), [cci]);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AssignmentFormData>({
        resolver: zodResolver(schema),
    });



    const uploadAssignmentMutation = useMutation({
        mutationFn: uploadeAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learnerSubmittedAssignments', content_id] });
            queryClient.invalidateQueries({ queryKey: ['courseModule'] });
            toast.success('Assignment uploaded successfully')
            onClose()
            reset();

            const match = window.location.pathname.match(/\/courses\/(\d+)\/modules\/(\d+)/);
            if (match) {
                saveCourseTimespan({
                    program_id: parseInt(match[1]),
                    module_id: parseInt(match[2]),
                    content_id: Number(content_id),
                    timestamp: Math.floor(Date.now() / 1000),
                    flag: 1
                }).catch(err => console.error("Error saving timespan flag 1", err));
            }

            if (cci === '1' || cci === '2') {
                navigate('/cci-stage-3');
            }
        },
        onError: (error) => {
            toast.error('Failed to upload assignment, please try again');
            console.log(error);
        }
    })


    const onSubmit = (data: AssignmentFormData) => {
        const formData = new FormData()
        if (data.file && data.file.length > 0) {
            formData.append('file', data.file[0])
        }
        formData.append('user_notes', data.note || "")

        formData.append('content_id', content_id.toString())
        uploadAssignmentMutation.mutate(formData);
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Upload Assignment
                    </DialogTitle>
                    <DialogDescription>
                        Upload your assignment here
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                        {/* description */}
                        {cci !== '2' && (
                            <div>
                                <Label>Upload</Label>
                                <Input type='file' accept=".pdf" {...register("file")} />
                                <p className='text-xs text-gray-500'>Only PDF files are allowed</p>
                                {errors.file && <p className='text-red-500 text-sm'>{errors.file?.message as string}</p>}
                            </div>
                        )}
                        {/* note */}
                        {cci !== '1' && (
                            <div>
                                <Label>{cci === '2' ? 'Your Response' : 'Note'}</Label>
                                {cci === '2' ? (
                                    <Controller
                                        name="note"
                                        control={control}
                                        render={({ field }) => (
                                            <RichTextEditor
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                ) : (
                                    <Textarea {...register("note")} />
                                )}
                                {errors.note && <p className='text-red-500 text-sm'>{errors.note?.message}</p>}
                            </div>
                        )}

                        <Button className='text-white' type='submit'>
                            {
                                uploadAssignmentMutation.isPending && <Loader size={16} className="mr-2 animate-spin" />
                            }
                            {/* Submit */}
                            {
                                uploadAssignmentMutation.isPending ? 'Uploading...' : 'Upload'
                            }
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UploadAssignment