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

import { addSocialLinks } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/ShadcnButton";

const SocialMediaSchema = z.object({
    linkedin: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    facebook: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    twitter: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    site_url: z.string().url("Invalid URL").or(z.literal("")).optional(),
    bee: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    dribble: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    insta: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
    pinterest: z.string()
        .url("Invalid URL")
        .or(z.literal("")).optional(),
});

type SocialMediaFormData = z.infer<typeof SocialMediaSchema>;

interface SocialMediaProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
    socialMedia?: SocialMediaFormData;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ show, onClose, onSuccess, socialMedia }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SocialMediaFormData>({
        resolver: zodResolver(SocialMediaSchema),
        defaultValues: socialMedia || {},
    });



    const onSubmit = useCallback(async (data: SocialMediaFormData) => {
        try {
            const res = await addSocialLinks(data);
            if (res === 1) {
                reset();
                onSuccess && onSuccess();
                onClose(false);
                toast.success("Social media information added successfully");
            }
            else {
                toast.error("Failed to add social media information. Please try again.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add social media information. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[30vh] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Add Social Media</DialogTitle>
                    <DialogDescription>Enter your social media details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input className="mt-2" id="linkedin" {...register("linkedin")} placeholder="Enter LinkedIn URL" />
                            <p className="text-red-500 text-sm">{errors.linkedin?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input className="mt-2" id="facebook" {...register("facebook")} placeholder="Enter Facebook URL" />
                            <p className="text-red-500 text-sm">{errors.facebook?.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input className="mt-2" id="twitter" {...register("twitter")} placeholder="Enter Twitter URL" />
                            <p className="text-red-500 text-sm">{errors.twitter?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="site_url">Website</Label>
                            <Input className="mt-2" id="site_url" {...register("site_url")} placeholder="Enter website URL" />
                            <p className="text-red-500 text-sm">{errors.site_url?.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="bee">Bee</Label>
                            <Input className="mt-2" id="bee" {...register("bee")} placeholder="Enter Bee URL" />
                            <p className="text-red-500 text-sm">{errors.bee?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="dribble">Dribbble</Label>
                            <Input className="mt-2" id="dribble" {...register("dribble")} placeholder="Enter Dribbble URL" />
                            <p className="text-red-500 text-sm">{errors.dribble?.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="insta">Instagram</Label>
                            <Input className="mt-2" id="insta" {...register("insta")} placeholder="Enter Instagram URL" />
                            <p className="text-red-500 text-sm">{errors.insta?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="pinterest">Pinterest</Label>
                            <Input className="mt-2" id="pinterest" {...register("pinterest")} placeholder="Enter Pinterest URL" />
                            <p className="text-red-500 text-sm">{errors.pinterest?.message}</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SocialMedia;
