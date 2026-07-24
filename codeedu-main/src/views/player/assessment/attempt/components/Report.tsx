import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/ShadcnButton'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from '@/components/ui/textarea';

interface ReportProps {
    show: boolean
    onClose: (value: boolean) => void
    question: number
}

const ReportSchema = z.object({
    message: z.string().min(1, "Reason is required"),
});

type ReportFormData = z.infer<typeof ReportSchema>;

const Report: React.FC<ReportProps> = ({ show, onClose, question }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReportFormData>({
        resolver: zodResolver(ReportSchema),
    });

    const onSubmit = async (data: ReportFormData) => {
        try {
            toast.success("Question reported successfully");
            console.log(data, question)
            reset();
            onClose(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to add education. Please try again.");
        }
    }

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label>Reason for reporting</Label>
                            <Textarea
                                className="w-full p-2 border rounded-md"
                                rows={4}
                                placeholder="Please describe the issue with this question..."
                                {...register("message")}
                            />
                            <p className="text-sm text-red-500">{errors.message?.message}</p>
                        </div>
                        <Button className="w-full text-white">Submit Report</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Report