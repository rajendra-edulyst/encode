import React, { useCallback, useState } from "react";
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

import { addExperience } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/ShadcnButton";
import { Checkbox } from "@/components/ui/checkbox";

const JobTypeEnum = z.enum(["Full Time", "Part Time", "Contract", "Internship"]);
const ExperienceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    institute: z.string().min(1, "Company is required"),
    employment_type: z.union([
        JobTypeEnum,
        z.string().min(1, "Custom job type is required").max(100),
    ]),
    location: z.string().min(1, "Location is required"),
    start_date: z.string().min(1, "Start Date is required"),
    end_date: z.string().or(z.literal("")).optional(),
    description: z.string().min(1, "Description is required"),
});

type ExperienceFormData = z.infer<typeof ExperienceSchema>;

interface ExperienceProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const AddExperience: React.FC<ExperienceProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(ExperienceSchema),
    });

    const [currentlyWorking, setCurrentlyWorking] = useState(false);

    const onSubmit = useCallback(async (data: ExperienceFormData) => {
        try {
            const newExperience = { ...data, activity_type: "Experience" };
            await addExperience(newExperience);
            reset();
            onSuccess && onSuccess();
            onClose(false);
            toast.success("Experience added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add experience. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[30vh] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Add Experience</DialogTitle>
                    <DialogDescription>Share your professional experience</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" {...register("title")} placeholder="Enter job title" />
                            <p className="text-red-500 text-sm">{errors.title?.message}</p>
                        </div>

                        <div className="w-full">
                            <Label htmlFor="institute">Company</Label>
                            <Input id="institute" {...register("institute")} placeholder="Enter company name" />
                            <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="employment_type">Employment Type</Label>
                            <select
                                id="employment_type"
                                {...register("employment_type")}
                                className="w-full bg-gray-100 border border-gray-100 rounded-lg p-3"
                            >
                                <option value="">Select employment type</option>
                                {JobTypeEnum.options.map((job) => (
                                    <option key={job} value={job}>
                                        {job}
                                    </option>
                                ))}
                            </select>
                            <p className="text-red-500 text-sm">{errors.employment_type?.message}</p>
                        </div>

                        <div className="w-full">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register("location")} placeholder="Enter location" />
                            <p className="text-red-500 text-sm">{errors.location?.message}</p>
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <div className="mb-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" type="month" {...register("start_date")} />
                            <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 mb-3">
                            <Checkbox id="terms"
                                checked={currentlyWorking}
                                className="text-white"
                                onCheckedChange={() => setCurrentlyWorking(!currentlyWorking)}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I currently work here
                            </label>
                        </div>
                        {
                            !currentlyWorking && (
                                <div>
                                    <Label htmlFor="end_date">End Date (or expected)</Label>
                                    <Input id="end_date" type="month" {...register("end_date")}
                                        disabled={currentlyWorking}
                                    />
                                    <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                                </div>
                            )
                        }
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea className="bg-gray-100 border border-gray-100 h-24 mt-1" id="description" {...register("description")} placeholder="Describe your role and achievements"  />
                        <p className="text-red-500 text-sm">{errors.description?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Submit</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddExperience;