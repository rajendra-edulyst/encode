import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { addEducation } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/ShadcnButton";

const EducationSchema = z.object({
    institute: z.string().min(1, "Institute name is required"),
    study_field: z.string().min(1, "Field of study is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    grade: z.string().min(1, "Grade is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
});

type EducationFormData = z.infer<typeof EducationSchema>;

interface EducationProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const Education: React.FC<EducationProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EducationFormData>({
        resolver: zodResolver(EducationSchema),
    });

    const onSubmit = useCallback(async (data: EducationFormData) => {
        try {
            const newEducation = { ...data, activity_type: 'Education', title: data.study_field };
            await addEducation(newEducation);
            reset();
            onSuccess?.();
            onClose(false);
            toast.success("Education added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add education. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>Add your educational background</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="institute">Institute</Label>
                            <Input id="institute" {...register("institute")} placeholder="Enter institute name" />
                            <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                        </div>

                        <div>
                            <Label htmlFor="study_field">Field of Study</Label>
                            <Input id="study_field" {...register("study_field")} placeholder="Enter field of study" />
                            <p className="text-red-500 text-sm">{errors.study_field?.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" type="month" {...register("start_date")} />
                            <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                        </div>
                        <div>
                            <Label htmlFor="end_date">End Date (or expected)</Label>
                            <Input id="end_date" type="month" {...register("end_date")} />
                            <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Input id="grade" {...register("grade")} placeholder="Enter grade" />
                            <p className="text-red-500 text-sm">{errors.grade?.message}</p>
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register("location")} placeholder="Enter location" />
                            <p className="text-red-500 text-sm">{errors.location?.message}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} placeholder="Enter description" className="h-24" />
                        <p className="text-red-500 text-sm">{errors.description?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add Education</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Education;