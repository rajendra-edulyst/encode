import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addPublication } from "@/services/learner/PortfolioService";
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

// Updated Validation Schema
const PublicationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    publisher: z.string(),
    publication_date: z.string().min(1, "Publication Date is required"),
    publication_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    publication_fieldofstudy: z.string().optional(),
});

type PublicationFormData = z.infer<typeof PublicationSchema>;

interface PublicationProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const Publication: React.FC<PublicationProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PublicationFormData>({
        resolver: zodResolver(PublicationSchema),
    });

    const onSubmit = useCallback(async (data: PublicationFormData) => {
        try {
            const activity = {
                title: data.title,
                institute: data.publisher,
                start_date: data.publication_date,
                edit_url_professional: data.publication_url || "",
                study_field: data.publication_fieldofstudy || "",
                activity_type: "Publication"
            };
            await addPublication(activity);
            reset();
            onSuccess && onSuccess();
            onClose(false);
            toast.success("Publication added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add publication. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[30vh] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Add Publication</DialogTitle>
                    <DialogDescription>Upload your publication details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Label htmlFor="title">Publication Title</Label>
                        <Input id="title" {...register("title")} placeholder="Enter publication title" />
                        <p className="text-red-500 text-sm">{errors.title?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="publisher">Publisher</Label>
                        <Input id="publisher" {...register("publisher")} placeholder="Enter publisher name" />
                        <p className="text-red-500 text-sm">{errors.publisher?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="publication_date">Publication Date</Label>
                        <Input id="publication_date" type="month" {...register("publication_date")} />
                        <p className="text-red-500 text-sm">{errors.publication_date?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="publication_url">URL (optional)</Label>
                        <Input id="publication_url" {...register("publication_url")} placeholder="Enter publication URL" />
                        <p className="text-red-500 text-sm">{errors.publication_url?.message}</p>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="publication_fieldofstudy">Field of Study (optional)</Label>
                        <Input id="publication_fieldofstudy" {...register("publication_fieldofstudy")} placeholder="Enter field of study" />
                        <p className="text-red-500 text-sm">{errors.publication_fieldofstudy?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add Publication</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Publication;
