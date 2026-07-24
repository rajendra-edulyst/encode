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

import { updatePortfolioInfo } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/ShadcnButton";
import { useAuth } from "@/auth";

const PersonalInfoSchema = z.object({
    name: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    headline: z.string().nonempty({ message: "Address is required" }),
    city: z.string().nonempty({ message: "City is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    country: z.string().nonempty({ message: "Country is required" }),
    about_me: z.string().nonempty({ message: "About is required" }),
});

type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;

interface PersonalInfoProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
    portfolio: PersonalInfoFormData | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ show, onClose, onSuccess, portfolio }) => {

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(PersonalInfoSchema),
        defaultValues: {
            name: portfolio?.name || user?.name?.split(" ")[0] || "",
            lastName: portfolio?.lastName || user?.name?.split(" ")[1] || "",
            email: portfolio?.email || user.email || "",
            phone: portfolio?.phone || (user?.mobile_no != null ? String(user.mobile_no) : ""),
            headline: portfolio?.headline || "",
            city: portfolio?.city || "",
            state: portfolio?.state || "",
            country: portfolio?.country || "",
            about_me: portfolio?.about_me || "",
        },
    });

    const onSubmit = useCallback(async (data: PersonalInfoFormData) => {
        try {
            await updatePortfolioInfo(data);
            reset();
            onSuccess?.();
            onClose(false);
            toast.success("Personal information updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update personal information. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[30vh] md:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Personal Information</DialogTitle>
                    <DialogDescription>Update your personal details</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="name">First Name</Label>
                            <Input id="name" {...register("name")} placeholder="Enter first name" />
                            <p className="text-red-500 text-sm">{errors.name?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} placeholder="Enter last name" />
                            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="Enter email" />
                            <p className="text-red-500 text-sm">{errors.email?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="number"
                                {...register("phone")}
                                placeholder="Enter phone number"
                            />
                            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="headline">Address</Label>
                            <Input id="headline" {...register("headline")} placeholder="Enter address" />
                            <p className="text-red-500 text-sm">{errors.headline?.message}</p>
                        </div >
                        <div className="w-full">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...register("city")} placeholder="Enter city" />
                            <p className="text-red-500 text-sm">{errors.city?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div className="w-full">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" {...register("state")} placeholder="Enter state" />
                            <p className="text-red-500 text-sm">{errors.state?.message}</p>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...register("country")} placeholder="Enter country" />
                            <p className="text-red-500 text-sm">{errors.country?.message}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="about_me">About Me</Label>
                        <Textarea id="about_me" {...register("about_me")} placeholder="Tell us about yourself" className="h-24" />
                        <p className="text-red-500 text-sm">{errors.about_me?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PersonalInfo;
