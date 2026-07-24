import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form, FormItem } from "@/components/ui/Form";
import { RxCross1 } from "react-icons/rx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: { start: Date; end: Date; title: string; description?: string; link?: string };
    onSave: (data: Event) => void;
    onDelete?: () => void;
}

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    link?: string;
}

const validationSchema = z.object({
    title: z.string().nonempty("Please enter a title."),
    start: z.date(),
    end: z.date(),
    description: z.string().optional(),
    link: z.string()
        .optional()
        .refine((value) => value === "" || value === undefined || /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\:[0-9]{1,5})?$/i.test(value), {
            message: "Please enter a valid URL.",
        }),
});

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, defaultValues, onDelete }) => {
    const { handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Event>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            start: defaultValues?.start || new Date(),
            end: defaultValues?.end || new Date(),
            description: defaultValues?.description || "",
            link: defaultValues?.link || "",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const onSubmit = async (data: Event) => {
        try {
            onSave(data);
            onClose();
        } catch (error) {
            console.error("Error saving event", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-primary text-1xl"
                >
                    <RxCross1 />
                </button>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label="Title" invalid={!!errors.title} errorMessage={errors.title?.message}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Enter event title" />}
                        />
                    </FormItem>
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem
                            label="Start Date & Time"
                            invalid={!!errors.start}
                            errorMessage={errors.start?.message}
                        >
                            <Controller
                                name="start"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value?.toISOString().slice(0, 16)}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="End Date & Time"
                            invalid={!!errors.end}
                            errorMessage={errors.end?.message}
                        >
                            <Controller
                                name="end"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value?.toISOString().slice(0, 16)}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <FormItem label="Description" invalid={!!errors.description}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input textArea {...field} placeholder="Enter description (optional)" />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Meeting Link" invalid={!!errors.link} errorMessage={errors.link?.message}>
                        <Controller
                            name="link"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Enter meeting link (optional)" />}
                        />
                    </FormItem>
                    <Button
                        variant="solid" className="text-ac-dark"
                        type="submit" block loading={isSubmitting}>
                        Save Event
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Modal;