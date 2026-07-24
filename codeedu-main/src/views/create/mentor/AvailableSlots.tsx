import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getAllMyAvailabilities, removeUserAvailability, UserAvailability } from '@/views/create/calendar/services/CalendarService';
import { format, isAfter, isToday, parseISO } from 'date-fns';
import LoadingSection from '@/components/LoadingSection';
import Breadcrumb from '@/components/breadcrumb';

const AvailableSlots = () => {
    const navigate = useNavigate();
    const [availabilities, setAvailabilities] = useState<UserAvailability[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const parseTimeStr = (dateStr: string, timeStr: string) => {
        try {
            const [timePart, modifier] = timeStr.split(' ');
            let [h, m] = timePart.split(':').map(Number);
            if (modifier === 'PM' && h !== 12) h += 12;
            if (modifier === 'AM' && h === 12) h = 0;
            return new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
        } catch (e) {
            return new Date(0);
        }
    };

    const loadAvailabilities = async () => {
        setIsLoading(true);
        try {
            const res = await getAllMyAvailabilities();
            if (res.data) {
                const allData = Array.isArray(res.data) ? res.data : [res.data];
                const now = new Date();

                // Filter and sort upcoming slots
                const upcomingSlots = (allData as UserAvailability[])
                    .filter(slot => {
                        const slotEndDateTime = parseTimeStr(slot.available_date, slot.end_time);
                        return isAfter(slotEndDateTime, now);
                    })
                    .sort((a, b) => {
                        const dateA = parseTimeStr(a.available_date, a.start_time).getTime();
                        const dateB = parseTimeStr(b.available_date, b.start_time).getTime();
                        return dateA - dateB;
                    });

                setAvailabilities(upcomingSlots);
            }
        } catch (error) {
            toast.error("Failed to load availabilities");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAvailabilities();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this availability slot?")) return;
        try {
            const res = await removeUserAvailability(id);
            if (res.status === 1) {
                toast.success("Availability slot removed");
                loadAvailabilities();
            } else {
                toast.error((res.error?.message as string) || "Failed to remove slot");
            }
        } catch (error) {
            toast.error("An error occurred while removing the slot");
        }
    };

    const breadcrumbItems = [{ label: 'Calendar', path: '/calendar' }, { label: 'My Available Slots' }];

    const calculateDuration = (start: string, end: string) => {
        try {
            const parseTime = (timeStr: string) => {
                const parts = timeStr.split(' ');
                if (parts.length !== 2) return 0;
                const [time, modifier] = parts;
                let [hours, minutes] = time.split(':').map(Number);
                if (modifier === 'PM' && hours !== 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                return hours * 60 + minutes;
            };
            const startMin = parseTime(start);
            const endMin = parseTime(end);
            const diff = endMin - startMin;
            if (diff <= 0) return "N/A";
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            return (h > 0 ? `${h}h ` : "") + (m > 0 ? `${m}m` : "");
        } catch (e) {
            return "N/A";
        }
    };

    return (
        <div className="p-4">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between mb-6 mt-4">
                <div className="flex items-center gap-3">

                    <h1 className="text-2xl font-bold dark:text-white">My Available Slots</h1>
                </div>
            </div>

            {isLoading ? (
                <LoadingSection isLoading={true} title="Loading Slots" description="Please wait while we fetch your available slots." />
            ) : availabilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {availabilities.map((slot: UserAvailability) => (
                        <Card key={slot.id} className="dark:bg-[#2A2A2A] bg-white border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-primary dark:text-codeblue">
                                        <Calendar size={18} />
                                        <span className="font-bold">
                                            {isToday(parseISO(slot.available_date))
                                                ? "Today"
                                                : format(parseISO(slot.available_date), "EEE, MMM dd, yyyy")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${slot.meeting_status === 'booked'
                                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                                : "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                            }`}>
                                            {slot.meeting_status === 'booked' ? "Booked" : "Available"}
                                        </span>
                                        {slot.meeting_status !== 'booked' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                                                onClick={() => handleDelete(slot.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Clock size={18} className="text-gray-400" />
                                        <span className="text-sm font-medium">
                                            {slot.start_time} - {slot.end_time}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-7">
                                        Duration: {calculateDuration(slot.start_time, slot.end_time)}
                                    </div>
                                </div>

                                {/* <div className="flex items-center justify-end gap-3 border-t pt-4 dark:border-gray-700 border-gray-100">
                                    <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-primary dark:hover:text-codeblue" onClick={() => {
                                        toast.info("Edit functionality coming soon");
                                    }}>
                                        <Edit2 size={14} className="mr-1.5" /> Edit
                                    </Button>
                                </div> */}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-[#2A2A2A] p-4 rounded-full shadow-sm mb-4">
                        <Calendar size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">No available slots found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">
                        You don't have any future availability slots scheduled.
                    </p>
                    <Button className="mt-6 bg-codeblue text-white hover:bg-codeblue/90" onClick={() => navigate('/calendar')}>
                        Go to Calendar
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AvailableSlots;
