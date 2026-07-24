import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import React, { useEffect } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Shadcnform"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui'
import { toast } from 'sonner'
import { connectMentor } from '@/services/learner/MentorListService'
import { Loader } from 'lucide-react'
import { fetchEvents } from '@/views/create/old_calendar/services/CalendarService'
import { Event } from '@/views/create/old_calendar/@types/calendar';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Mentor } from '@/@types/create/mentor'

interface ConnectMentorProps {
    open: boolean
    onClose: () => void
    mentor: Mentor | null
}

const connectMentorFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    purpose: z.string().min(1, { message: "Purpose is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    start_date: z.string().refine(value => {
        const date = Date.parse(value);
        return !isNaN(date);
    }, {
        message: "Invalid start date",
        path: ["start_date"],
    }),
    end_date: z.string().refine(value => {
        const date = Date.parse(value);
        return !isNaN(date);
    }, {
        message: "Invalid end date",
        path: ["end_date"],
    }),
    is_mentoring: z.number(),
    link: z.string().optional(),
}).refine(data => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return start <= end;
}, {
    message: "End date must be after start date",
    path: ["end_date"],
}).refine(data => {
    const now = new Date();
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return start >= now && end >= now;
}, {
    message: "Start and end dates must be in the future",
    path: ["start_date"],
});

const Connect: React.FC<ConnectMentorProps> = ({ open, onClose, mentor }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [events, setEvents] = React.useState<Event[]>([]);
    const CurrentMonth = moment().format('YYYY-MM');
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof connectMentorFormSchema>>({
        resolver: zodResolver(connectMentorFormSchema),
        defaultValues: {
            title: "",
            purpose: "",
            description: "",
            start_date: "",
            end_date: "",
            is_mentoring: 0,
            link: ""
        },
    })

    function onSubmit(data: z.infer<typeof connectMentorFormSchema>) {
        setLoading(true);
        // add mentor id to invited_user_ids
        const invited_user_ids = [mentor?.uniqueIdentifier ? Number(mentor.uniqueIdentifier) : null];
        if (!invited_user_ids) {
            toast.error("Mentor ID is required")
            return
        }

        // check if the event already exists
        const eventExists = events.some(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const newStart = new Date(data.start_date);
            const newEnd = new Date(data.end_date);
            return (newStart <= eventEnd && newEnd >= eventStart);
        });

        if (eventExists) {
            toast.error("Event already exists at this time")
            setLoading(false);
            return
        }

        const requestData = {
            ...data,
            invited_user_ids: invited_user_ids.filter((id): id is number => typeof id === "number"),
        }

        // if (selectedType === "Mentor") {
        requestData.is_mentoring = 1
        // }

        connectMentor(requestData).then(() => {
            toast.success("Mentor connected successfully");
            form.reset();
            onClose();
            navigate('/calendar')
        }).catch((error) => {
            console.error("Error connecting mentor:", error)
            toast.error("Failed to connect with mentor")
        }).finally(() => {
            setLoading(false);
            onClose();
        })
    }

    useEffect(() => {
        fetchEvents(CurrentMonth).then((res => {
            setEvents(Array.isArray(res) ? res : []);
        })).catch((error) => {
            console.error("Error fetching events:", error);
        });
    }, [CurrentMonth])

    // Watch description field to enable button
    const descriptionValue = form.watch("description");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Connect with Mentor
                    </DialogTitle>
                    <DialogDescription>
                        Please fill the form to connect with the Mentor.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form className="w-full space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title<span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Meeting Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purpose<span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Meeting Purpose" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date<span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date<span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description<span className='text-red-500'>*</span></FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                placeholder="Brief description"
                                                className="w-full h-24 p-2 border bg-gray-100 border-none rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meeting Link (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Meeting Link" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end pt-2 gap-3">
                                <Button type="button" variant="outline" onClick={() => {
                                    form.reset();
                                    onClose();
                                }}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className='text-white bg-pink-500 hover:bg-pink-600'
                                    disabled={loading || !descriptionValue}
                                >
                                    <Loader className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
                                    <span>{loading ? "Connecting..." : "Connect Now"}</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Connect