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

import { addCertificate } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/ShadcnButton";

// Validation Schema
const CertificateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    institute: z.string().min(1, "Institute is required"),
    start_date: z.string().min(1, "Start Date is required"),
    end_date: z.string().nullable(),
    certificate: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Certificate file is required")
        .refine(
            (files) => ["application/pdf", "image/jpeg", "image/png"].includes(files[0]?.type),
            "Only PDF, JPG, or PNG files are allowed"
        ),
});

type CertificateFormData = z.infer<typeof CertificateSchema>;

interface CertificateProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CertificateFormData>({
        resolver: zodResolver(CertificateSchema),
    });

    const onSubmit = useCallback(async (data: CertificateFormData) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("institute", data.institute);
            formData.append("start_date", data.start_date);
            formData.append("end_date", data.end_date || "")
            formData.append("certificate", data.certificate[0]);
            formData.append("activity_type", "Certificate");
            await addCertificate(formData);
            reset();
            onSuccess && onSuccess();
            onClose(false);
            toast.success("Certificate added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add certificate. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Certificate</DialogTitle>
                    <DialogDescription>Upload your certification details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Label htmlFor="title">Certificate Title</Label>
                        <Input id="title" {...register("title")} placeholder="Enter certificate title" />
                        <p className="text-red-500 text-sm">{errors.title?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="institute">Institute</Label>
                        <Input id="institute" {...register("institute")} placeholder="Enter institute name" />
                        <p className="text-red-500 text-sm">{errors.institute?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" type="month" {...register("start_date")} />
                        <p className="text-red-500 text-sm">{errors.start_date?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                            id="end_date"
                            type="month"
                            {...register("end_date")}
                        />
                        <p className="text-red-500 text-sm">{errors.end_date?.message}</p>
                    </div>

                    <div className="mb-3">
                        <Label htmlFor="certificate">Upload Certificate</Label>
                        <input
                            id="certificate"
                            type="file"
                            {...register("certificate")}
                            accept=".pdf,.jpg,.png"
                            className="w-full border rounded-md p-2"
                        />
                        <p className="text-red-500 text-sm">{errors.certificate?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add Certificate</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Certificate;
