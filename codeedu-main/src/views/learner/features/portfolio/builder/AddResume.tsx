import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addResume } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/ShadcnButton";

// Validation Schema
const ResumeSchema = z.object({
    resume: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Resume file is required")
        .refine(
            (files) => ["application/pdf"].includes(files[0]?.type),
            "Only PDF files are allowed"
        ),
});

type ResumeFormData = z.infer<typeof ResumeSchema>;

interface AddResumeProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const AddResume: React.FC<AddResumeProps> = ({ show, onClose, onSuccess }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ResumeFormData>({
        resolver: zodResolver(ResumeSchema),
    });

    const onSubmit = async (data: ResumeFormData) => {
        try {
            const formData = new FormData();
            formData.append("file", data.resume[0]);
            await addResume(formData);
            reset();
            toast.success("Resume added successfully");
            onSuccess && onSuccess();
            onClose(false);
        } catch (error) {
            toast.error('Failed to add resume');
            console.log(error);
        }
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Certificate</DialogTitle>
                    <DialogDescription>Upload your certification details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="resume">
                                Resume
                            </Label>
                            <Input
                                type="file"
                                id="resume"
                                {...register("resume")}
                            />
                        </div>
                        <p className="text-gray-500 text-sm">
                            Accepted file type: PDF
                        </p>
                        <p className="text-red-500 text-sm">{errors.resume?.message}</p>
                        <div className="flex justify-end">
                            <Button className='text-white' type="submit">Upload Resume</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddResume