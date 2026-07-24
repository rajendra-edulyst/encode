import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addExtraActivity } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/ShadcnButton";
import {

Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog";

// Validation Schema
const ExtraActivitySchema = z.object({
title: z.string().min(1, "Title is required"),
description: z.string().min(1, "Description is required"),
start_date: z.string().min(1, "Start date is required"),
end_date: z.string().min(1, "End date is required"),
institute: z.string().min(1, "Institute is required"),
location: z.string().min(1, "Location is required"),
});

type ExtraActivityFormData = z.infer<typeof ExtraActivitySchema>;

interface ExtraActivityProps {
show: boolean;
onClose: (show: boolean) => void;
onSuccess?: () => void;
}

const ExtraActivity: React.FC<ExtraActivityProps> = ({ show, onClose, onSuccess }) => {
const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
} = useForm<ExtraActivityFormData>({
    resolver: zodResolver(ExtraActivitySchema),
});

const onSubmit = useCallback(async (data: ExtraActivityFormData) => {
    try {
        await addExtraActivity({ ...data, activity_type: "Extra" });
        reset();
        onSuccess && onSuccess();
        onClose(false);
        toast.success("Extra Activity added successfully");
    } catch (error) {
        console.error(error);
        toast.error("Failed to add extra activity. Please try again.");
    }
}, [reset, onSuccess, onClose]);

return (
    <Dialog open={show} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Extra Activity</DialogTitle>
                <DialogDescription>Upload your extra activity details</DialogDescription>
            </DialogHeader>
            <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} placeholder="Enter activity title" />
                    <p className="text-red-500 text-sm">{errors.title?.message}</p>
                </div>
                <div className="mb-3">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...register("description")} placeholder="Enter description" />
                    <p className="text-red-500 text-sm">{errors.description?.message}</p>
                </div>
                <div className="mb-3">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" type="month" {...register("start_date")} />
                    <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                </div>
                <div className="mb-3">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" type="month" {...register("end_date")} />
                    <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                </div>
                <div className="mb-3">
                    <Label htmlFor="institute">Institute</Label>
                    <Input id="institute" {...register("institute")} placeholder="Enter institute name" />
                    <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                </div>
                <div className="mb-3">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register("location")} placeholder="Enter location" />
                    <p className="text-red-500 text-sm">{errors.location?.message}</p>
                </div>
                <div className="flex justify-end">
                    <Button className="text-white" type="submit">Add Activity</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
);
};

export default ExtraActivity;