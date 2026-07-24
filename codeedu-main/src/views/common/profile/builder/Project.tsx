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

import { addProject } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/ShadcnButton";
import { Textarea } from "@/components/ui/textarea";

// Validation Schema
const ProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    employment_type: z.string().min(1, "Project type is required"),
    description: z.string().min(1, "Description is required"),
    institute: z.string().min(1, "Institute is required"),
    start_date: z.string().min(1, "Start Date is required"),
    end_date: z.string().nullable().optional(),
    project_link: z.string().url("Invalid URL").optional(),
    project_file: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Project file is required")
        .refine(
            (files) => ["application/pdf", "image/jpeg", "image/png"].includes(files[0]?.type),
            "Only PDF, JPG, or PNG files are allowed"
        ),
});

type ProjectFormData = z.infer<typeof ProjectSchema>;

interface ProjectProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const Project: React.FC<ProjectProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(ProjectSchema),
    });

    const onSubmit = useCallback(async (data: ProjectFormData) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("employment_type", data.employment_type);
            formData.append("description", data.description);
            formData.append("institute", data.institute);
            formData.append("start_date", data.start_date);
            formData.append("end_date", data.end_date || "");
            formData.append("action", data.project_link || "");
            formData.append("certificate", data.project_file[0]);
            formData.append("activity_type", "Project");
            await addProject(formData);
            reset();
            onSuccess && onSuccess();
            onClose(false);
            toast.success("Project added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add project. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[30vh] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>Upload your project details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                        <Input id="title" {...register("title")} placeholder="Enter project title" />
                        <p className="text-red-500 text-sm">{errors.title?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="employment_type">Project Type<span className="text-red-500">*</span></Label>
                        <select
                            id="employment_type"
                            {...register("employment_type")}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="internship">Internship</option>
                            <option value="job">Job</option>
                        </select>

                        <p className="text-red-500 text-sm">{errors.employment_type?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="description">About Project <span className="text-red-500">*</span></Label>
                        <Textarea id="description" {...register("description")} placeholder="Enter project description" />
                        <p className="text-red-500 text-sm">{errors.description?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="institute">Institute/Company <span className="text-red-500">*</span></Label>
                        <Input id="institute" {...register("institute")} placeholder="Enter institute name" />
                        <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-3">
                            <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                            <Input id="start_date" type="month" {...register("start_date")} />
                            <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" type="month" {...register("end_date")} />
                            <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="project_link">Project Link (Optional)</Label>
                        <Input id="project_link" {...register("project_link")} placeholder="Enter project URL" />
                        <p className="text-red-500 text-sm">{errors.project_link?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="project_file">Upload Project File <span className="text-red-500">*</span></Label>
                        <input
                            id="project_file"
                            type="file"
                            {...register("project_file")}
                            accept=".pdf,.jpg,.png"
                            className="w-full border rounded-md p-2"
                        />
                        <p className="text-red-500 text-sm">{errors.project_file?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add Project</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Project;