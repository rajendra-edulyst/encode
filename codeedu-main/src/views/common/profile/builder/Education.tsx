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
import { Button } from "@/components/ui/ShadcnButton";

// ✅ Validation Schema
const EducationSchema = z.object({
    employment_type: z.string().min(1, "Degree is required"),
    institute: z.string().min(1, "Institute name is required"),
    study_field: z.string().min(1, "Field of study is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    grade: z.string().min(1, "Grade is required"),
    location: z.string().min(1, "Location is required"),
    certificate: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || ["application/pdf", "image/jpeg", "image/png"].includes(files[0]?.type), {
            message: "Only PDF, JPG, or PNG files are allowed",
        })
        .optional(),
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
            const formData = new FormData();
            formData.append("employment_type", data.employment_type);
            formData.append("institute", data.institute);
            formData.append("study_field", data.study_field);
            formData.append("start_date", data.start_date);
            formData.append("end_date", data.end_date);
            formData.append("grade", data.grade);
            formData.append("location", data.location);

            if (data.certificate && data.certificate.length > 0) {
                formData.append("certificate", data.certificate[0]);
            }
            formData.append("title", data.study_field);
            formData.append("activity_type", "Education");

            await addEducation(formData);
            reset();
            onSuccess?.();
            onClose(false);
            toast.success("Education added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add education. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>Add your educational background</DialogDescription>
                </DialogHeader>
                <form className="bg-white space-y-3" onSubmit={handleSubmit(onSubmit)}>

                    <div className="w-full ">
                        <Label htmlFor="employment_type">Degree / Qualification <span className='text-red-500'>*</span></Label>
                        <select required id="employment_type"  {...register("employment_type")} className="mt-1 w-full p-3 border-2 bg-gray-100 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Select...</option>
                            <option value="10th">10th</option>
                            <option value="12th">12th</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Under Graduate">Under Graduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                            <option value="PhD">PhD</option>
                            <option value="Post-Doc">Post Doc</option>
                        </select>
                        {errors.employment_type && (
                            <p className="text-red-500">
                                {errors.employment_type?.message}
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label htmlFor="study_field">Field of Study <span className='text-red-500'>*</span></Label>
                        <Input required id="study_field" {...register("study_field")} placeholder="Enter field of study" />
                        <p className="text-red-500 text-sm">{errors.study_field?.message}</p>
                    </div>
                    {/* Row 1: Institute + Study Field */}
                    <div className="w-full ">
                        <Label htmlFor="institute">Institution Name <span className='text-red-500'>*</span></Label>
                        <Input required id="institute" {...register("institute")} placeholder="Enter institute name" />
                        <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                    </div>



                    {/* Row 2: Start & End Dates */}
                    <div className="flex gap-3 ">
                        <div className="w-full">
                            <Label htmlFor="start_date">Start Date <span className='text-red-500'>*</span></Label>
                            <Input required id="start_date" type="month" {...register("start_date")} />
                            <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="end_date">End Date <span className='text-red-500'>*</span></Label>
                            <Input required id="end_date" type="month" {...register("end_date")} />
                            <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                        </div>
                    </div>

                    {/* Row 3: Grade + Location */}
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="grade">Grade <span className='text-red-500'>*</span></Label>
                            <Input required id="grade" {...register("grade")} placeholder="Enter grade" />
                            <p className="text-red-500 text-sm">{errors.grade?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="location">Location <span className='text-red-500'>*</span></Label>
                            <Input required id="location" {...register("location")} placeholder="Enter location" />
                            <p className="text-red-500 text-sm">{errors.location?.message}</p>
                        </div>
                    </div>

                    {/* Row 4: Certificate Upload */}
                    <div className="">
                        <Label className="mt-2" htmlFor="certificate">Upload Certificate (optional)</Label>
                        <input
                            id="certificate"
                            type="file"
                            {...register("certificate")}
                            accept=".pdf,.jpg,.png"
                            className="w-full border rounded-md p-2"
                        />
                        <p className="text-red-500 text-sm">{errors.certificate?.message}</p>
                    </div>

                    {/* Row 5: Description
                    <div className="">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Enter description"
                            className="h-24"
                        />
                        <p className="text-red-500 text-sm">{errors.description?.message}</p>
                    </div> */}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add Education</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Education;
