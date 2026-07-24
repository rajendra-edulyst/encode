
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { isToday, isSameMonth, parseISO } from "date-fns";
import { MiniCalendar } from "../../../create/calendar/components/MiniCalendar";
import { saveUserAvailabilities, removeUserAvailability, getAllMyAvailabilities } from "../../../create/calendar/services/CalendarService";
import { Button } from "@/components/ui/ShadcnButton";
import { toast } from "sonner";
import { X, Check, CalendarCheck2, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useMentoringSessions, usePendingInvites } from "@/hooks/data/faculty/useMentor";
import { CalendarEvent } from "@/views/create/calendar/types/calendar";
import { useAuth } from "@/auth";
import { Event as ServerEvent, PendingInvites, InvitedUsers } from "@/views/create/old_calendar/@types/calendar";
import { fetchInvitedUsers } from "@/views/create/old_calendar/services/CalendarService";
import { ScheduledSessions } from "@/views/create/calendar/components/ScheduledSessions";
import { fetchSettings } from "@/services/SettingsService";
import { Settings } from "@/@types/settings";

type Props = {
    open: boolean;
    onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

type TemporarySlot = {
    id: string;
    start_time: string;
    end_time: string;
    date: string;
};

const isValidTime = (time: string): boolean => {
    return time !== "--:-- --" && time !== "_ _:_ _";
};

const convertTo24HourForComparison = (time12: string): string => {
    if (!time12 || time12 === "--:-- --" || time12 === "_ _:_ _") {
        return "00:00:00";
    }

    const parts = time12.split(' ');
    if (parts.length < 2) return "00:00:00";

    const [time, modifier] = parts;
    const timeParts = time.split(':');
    if (timeParts.length < 2) return "00:00:00";

    let [hours, minutes] = timeParts;

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};

const isTimeInPast = (selectedDate: Date, time: string): boolean => {
    if (time === "--:-- --") return false;

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);


    const selectedDay = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (selectedDay < today) {
        return true;
    }


    if (selectedDay > today) {
        return false;
    }


    const time24 = convertTo24HourForComparison(time);
    const [hours, minutes] = time24.split(':').map(Number);

    const timeDate = new Date(now);
    timeDate.setHours(hours, minutes, 0, 0);

    return timeDate < now;
};

const SLOT_DURATION_OPTIONS_MINUTES = [45, 60] as const;

const toTotalMinutes = (time12: string): number => {
    const time24 = convertTo24HourForComparison(time12);
    const [hours, minutes] = time24.split(':').map(Number);
    return hours * 60 + minutes;
};


const ALL_TIME_OPTIONS = [
    "--:-- --",
    "07:00 AM", "07:15 AM", "07:30 AM", "07:45 AM",
    "08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM",
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
    "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
    "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
    "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
    "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
    "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM",
    "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM",
    "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
    "08:00 PM", "08:15 PM", "08:30 PM", "08:45 PM",
    "09:00 PM", "09:15 PM", "09:30 PM", "09:45 PM",
    "10:00 PM", "10:15 PM", "10:30 PM", "10:45 PM",
    "11:00 PM",
];

const AVAILABLE_END_MINUTES = new Set(
    ALL_TIME_OPTIONS.filter(time => time !== "--:-- --").map(toTotalMinutes)
);

export default function AvailabilityPopup({ open, onClose }: Props) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allAvailabilities, setAllAvailabilities] = useState<any[]>([]);
    const [slotsForDate, setSlotsForDate] = useState<any[]>([]);
    const [startTime, setStartTime] = useState("--:-- --");
    const [endTime, setEndTime] = useState("--:-- --");
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [temporarySlots, setTemporarySlots] = useState<TemporarySlot[]>([]);
    const { data: mentoringRes } = useMentoringSessions(open);
    const { data: pendingInvites = [] } = usePendingInvites();
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings | null>(null);

    const MONTHLY_LIMIT_MINUTES = 120;

    const getDurationInMinutes = (startStr: string, endStr: string) => {
        const start24 = convertTo24HourForComparison(startStr);
        const end24 = convertTo24HourForComparison(endStr);
        const [sH, sM] = start24.split(':').map(Number);
        const [eH, eM] = end24.split(':').map(Number);
        return (eH * 60 + eM) - (sH * 60 + sM);
    };

    const getTotalMinutesForMonth = (date: Date) => {
        const savedDuration = allAvailabilities.reduce((acc, av) => {
            if (isSameMonth(parseISO(av.available_date), date)) {
                return acc + getDurationInMinutes(av.start_time, av.end_time);
            }
            return acc;
        }, 0);

        const tempDuration = temporarySlots.reduce((acc, slot) => {
            if (isSameMonth(parseISO(slot.date), date)) {
                return acc + getDurationInMinutes(slot.start_time, slot.end_time);
            }
            return acc;
        }, 0);

        return savedDuration + tempDuration;
    };


    const getFilteredStartTimeOptions = useMemo(() => {
        return ALL_TIME_OPTIONS.filter(time => {
            if (time === "--:-- --") return true;
            if (isTimeInPast(selectedDate, time)) return false;

            const startTotalMinutes = toTotalMinutes(time);
            return SLOT_DURATION_OPTIONS_MINUTES.some(duration =>
                AVAILABLE_END_MINUTES.has(startTotalMinutes + duration)
            );
        });
    }, [selectedDate]);

    const getFilteredEndTimeOptions = useMemo(() => {
        if (startTime === "--:-- --") {
            return ALL_TIME_OPTIONS;
        }

        const startTotalMinutes = toTotalMinutes(startTime);
        const allowedEndMinutes = new Set(
            SLOT_DURATION_OPTIONS_MINUTES.map(duration => startTotalMinutes + duration)
        );

        const filtered = ALL_TIME_OPTIONS.filter(time => {
            if (time === "--:-- --") return true;
            if (isTimeInPast(selectedDate, time)) return false;
            return allowedEndMinutes.has(toTotalMinutes(time));
        });

        // Keep placeholder when no valid end options exist for selected start.
        return filtered.length > 1 ? filtered : ["--:-- --"];
    }, [selectedDate, startTime]);

    const buildAvailabilityEvents = () => {
        const allSlots = [...allAvailabilities, ...temporarySlots];
        return allSlots.map(av => {
            const dateStr = av.available_date || av.date;
            if (!dateStr || !av.start_time || !av.end_time) return null;

            const start24 = convertTo24HourForComparison(av.start_time);
            const end24 = convertTo24HourForComparison(av.end_time);

            const startDate = new Date(`${dateStr}T${start24}`);
            const endDate = new Date(`${dateStr}T${end24}`);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return null;
            }

            return {
                id: String(av.id),
                title: "Available",
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                slot_available_date: dateStr,
            } as CalendarEvent & { slot_available_date?: string };
        }).filter(ev => ev !== null) as (CalendarEvent & { slot_available_date?: string })[];
    };

    const isoDate = (d: Date) => {
        const y = d.getFullYear();
        const m = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        return `${y}-${m}-${day}`;
    };

    const loadAvailabilities = async () => {
        try {
            const res = await getAllMyAvailabilities();
            if (res.data) {
                setAllAvailabilities(Array.isArray(res.data) ? res.data : [res.data]);
            }
        } catch (error) {
            toast.error("Failed to load availabilities");
        }
    };

    const loadMentoringSessions = async () => {
        if (!mentoringRes || !mentoringRes.data) {
            setEvents([]);
            return;
        }

        const parseDate = (s?: string) => {
            if (!s) return new Date().toISOString();

            if (s.includes('T')) {
                const d = new Date(s);
                return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
            }

            if (s.includes(' ')) {
                const d = new Date(s);
                return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
            }

            const d = new Date(s + 'T00:00:00');
            return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
        };

        const mapped: CalendarEvent[] = (mentoringRes.data || []).map((e: ServerEvent) => {
            const approval = e.approval_status;
            const isMent = e.is_mentoring;
            const color = approval === 1 ? 'primary' : approval === 0 ? 'gray' : isMent ? 'orange' : 'blue';

            const hasPendingInvite = Array.isArray(pendingInvites) && pendingInvites.some((p: PendingInvites) => {
                const pid = p?.id;
                return typeof pid !== 'undefined' && Number(pid) === Number(e.id);
            });

            return {
                id: String(e.id),
                title: e.title || 'Untitled',
                startTime: parseDate(String(e.start || e.start_date)),
                endTime: parseDate(String(e.end || e.end_date)),
                start_date: e.start_date || e.start,
                end_date: e.end_date || e.end,
                link: (() => {
                    const r = e as unknown as Record<string, unknown>;
                    const v = r.link ?? r.event_link ?? r.meeting_link;
                    return typeof v === 'string' ? v : undefined;
                })(),
                isPendingInvite: !!hasPendingInvite,
                approval_status: approval,
                is_mentoring: isMent,
                originalId: e.id,
                color,
            } as CalendarEvent;
        });

        try {
            const updated = await Promise.all(
                mapped.map(async (ev) => {
                    if (!ev.is_mentoring) return ev;
                    try {
                        const res = await fetchInvitedUsers(Number(ev.originalId || ev.id));
                        const invited = res.data?.invited_user || [];
                        const hasPending = (invited as InvitedUsers[]).some((u: InvitedUsers) => {
                            const ap = u?.approval_status;
                            if (typeof ap !== 'undefined' && Number(ap) === 0) return true;
                            const uid = u?.user_id ?? (u as unknown as Record<string, unknown>)?.userId ?? u?.id;
                            return (
                                typeof ap !== 'undefined' &&
                                Number(ap) === 0 &&
                                typeof uid !== 'undefined' &&
                                typeof user !== 'undefined' &&
                                user !== null &&
                                Number(uid) === Number((user as unknown as { id?: number })?.id)
                            );
                        });
                        return { ...ev, isPendingInvite: hasPending } as CalendarEvent;
                    } catch {
                        return ev;
                    }
                })
            );
            setEvents(updated);
        } catch {
            setEvents(mapped);
        }
    };

    const getAvailabilitySlots = (): (CalendarEvent & { slot_available_date?: string; isTemporary?: boolean })[] => {
        const availabilityEvents = allAvailabilities.map(av => {
            const dateStr = av.available_date;
            if (!dateStr || !av.start_time || !av.end_time) return null;

            const start24 = convertTo24HourForComparison(av.start_time);
            const end24 = convertTo24HourForComparison(av.end_time);

            const startDate = new Date(`${dateStr}T${start24}`);
            const endDate = new Date(`${dateStr}T${end24}`);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return null;
            }

            return {
                id: `availability-${av.id}`,
                title: "Available",
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                color: "blue",
                originalId: av.id,
                slot_available_date: dateStr,
            } as CalendarEvent & { slot_available_date?: string };
        }).filter(ev => ev !== null) as (CalendarEvent & { slot_available_date?: string })[];

        const temporaryEvents = temporarySlots.map(slot => {
            const dateStr = slot.date;
            if (!dateStr || !slot.start_time || !slot.end_time) return null;

            const start24 = convertTo24HourForComparison(slot.start_time);
            const end24 = convertTo24HourForComparison(slot.end_time);

            const startDate = new Date(`${dateStr}T${start24}`);
            const endDate = new Date(`${dateStr}T${end24}`);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return null;
            }

            return {
                id: slot.id,
                title: "Available",
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                color: "blue",
                originalId: slot.id,
                slot_available_date: dateStr,
                isTemporary: true,
            } as CalendarEvent & { slot_available_date?: string; isTemporary?: boolean };
        }).filter(ev => ev !== null) as (CalendarEvent & { slot_available_date?: string; isTemporary?: boolean })[];

        return [...availabilityEvents, ...temporaryEvents];
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await fetchSettings();
                setSettings(data);
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        };

        if (open) {
            loadAvailabilities();
            loadMentoringSessions();
            loadSettings();
            setTemporarySlots([]);

            setStartTime("--:-- --");
            setEndTime("--:-- --");
        }
    }, [open, mentoringRes, pendingInvites, user]);

    useEffect(() => {
        const date = isoDate(selectedDate);
        const savedSlots = allAvailabilities.filter(s => s.available_date === date);
        const tempSlots = temporarySlots.filter(s => s.date === date);
        setSlotsForDate([...savedSlots, ...tempSlots]);
    }, [selectedDate, allAvailabilities, temporarySlots]);


    useEffect(() => {
        if (startTime === "--:-- --") {
            setEndTime("--:-- --");
        }
    }, [startTime]);

    const handlePlusAdd = () => {

        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            toast.error("Please select both start and end times");
            return;
        }

        const date = isoDate(selectedDate);
        const startTime24 = convertTo24HourForComparison(startTime);
        const endTime24 = convertTo24HourForComparison(endTime);

        const newSlotStart = new Date(`${date}T${startTime24}`);
        const newSlotEnd = new Date(`${date}T${endTime24}`);

        if (newSlotEnd <= newSlotStart) {
            toast.error("End time must be after start time");
            return;
        }

        const selectedDuration = getDurationInMinutes(startTime, endTime);
        if (!SLOT_DURATION_OPTIONS_MINUTES.includes(selectedDuration as 45 | 60)) {
            toast.error("Please select an end time that creates either a 45-minute or 1-hour slot.");
            return;
        }


        if (isTimeInPast(selectedDate, startTime)) {
            toast.error("Start time cannot be in the past");
            return;
        }


        if (isTimeInPast(selectedDate, endTime)) {
            toast.error("End time cannot be in the past");
            return;
        }

        const allSavedSlots = allAvailabilities.filter(s => s.available_date === date);
        const hasConflictWithSaved = allSavedSlots.some(slot => {
            const slotStart24 = convertTo24HourForComparison(slot.start_time);
            const slotEnd24 = convertTo24HourForComparison(slot.end_time);

            const slotStart = new Date(`${date}T${slotStart24}`);
            const slotEnd = new Date(`${date}T${slotEnd24}`);

            return (
                (newSlotStart < slotEnd && newSlotEnd > slotStart) ||
                (slotStart < newSlotEnd && slotEnd > newSlotStart)
            );
        });

        if (hasConflictWithSaved) {
            toast.error("This time slot conflicts with an existing saved availability");
            return;
        }

        const tempSlotsForDate = temporarySlots.filter(s => s.date === date);
        const hasConflictWithTemp = tempSlotsForDate.some(slot => {
            const slotStart24 = convertTo24HourForComparison(slot.start_time);
            const slotEnd24 = convertTo24HourForComparison(slot.end_time);

            const slotStart = new Date(`${date}T${slotStart24}`);
            const slotEnd = new Date(`${date}T${slotEnd24}`);

            return (
                (newSlotStart < slotEnd && newSlotEnd > slotStart) ||
                (slotStart < newSlotEnd && slotEnd > newSlotStart)
            );
        });

        if (hasConflictWithTemp) {
            toast.error("This time slot conflicts with another temporary slot");
            return;
        }

        const checkLimit = settings?.configuration?.unlimited_mentor_slot === 0;

        if (checkLimit) {
            const currentMonthTotal = getTotalMinutesForMonth(selectedDate);
            const newSlotDuration = getDurationInMinutes(startTime, endTime);

            if (currentMonthTotal + newSlotDuration > MONTHLY_LIMIT_MINUTES) {
                const remaining = MONTHLY_LIMIT_MINUTES - currentMonthTotal;
                toast.error(`Monthly limit exceeded. You can only add ${remaining > 0 ? remaining : 0} more minutes for this month.`);
                return;
            }
        }

        const newTemporarySlot: TemporarySlot = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            start_time: startTime,
            end_time: endTime,
            date: date,
        };

        setTemporarySlots(prev => [...prev, newTemporarySlot]);

        setStartTime("--:-- --");
        setEndTime("--:-- --");
        toast.success("Time slot added locally. Click 'Save Availability' to save.");
    };

    const handleSaveAvailability = async () => {
        if (temporarySlots.length === 0) {
            toast.info("No new time slots to save");
            return;
        }

        try {
            for (const slot of temporarySlots) {
                const payload = {
                    date: slot.date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                };

                const res = await saveUserAvailabilities(payload);

                if (res.status !== 1) {
                    const errorMessage = typeof res.error === 'string' ? res.error : `Failed to save slot ${slot.start_time}-${slot.end_time}`;
                    throw new Error(errorMessage);
                }
            }

            toast.success(`${temporarySlots.length} availability slot(s) saved successfully`);
            setTemporarySlots([]);
            await loadAvailabilities();

        } catch (err: any) {
            toast.error(err.message || "Failed to save availability slots");
        }
    };

    const removeExistingSlot = async (slot: any) => {
        try {
            if (slot.id && slot.id.toString().startsWith('temp-')) {
                setTemporarySlots(prev => prev.filter(s => s.id !== slot.id));
                toast.success("Temporary slot removed");
                return;
            }

            const res = await removeUserAvailability(slot.id);

            if (res.status !== 1) {
                const errorMessage = typeof res.error === 'string' ? res.error : "Unknown error";
                throw new Error(errorMessage);
            }

            toast.success("Slot removed successfully");
            await loadAvailabilities();

        } catch (err: any) {
            toast.error(err.message || "Failed to remove slot");
        }
    };

    const handleDeleteSlot = (slotId: string) => {
        if (slotId.toString().startsWith('temp-')) {
            setTemporarySlots(prev => prev.filter(s => s.id !== slotId));
            toast.success("Unsaved slot removed");
        } else if (slotId.toString().startsWith('availability-')) {
            const actualId = slotId.replace('availability-', '');
            removeExistingSlot({ id: actualId });
        }
    };

    if (!open) return null;

    const currentDate = isoDate(selectedDate);
    const savedSlotsForDate = allAvailabilities.filter(s => s.available_date === currentDate);
    const tempSlotsForDate = temporarySlots.filter(s => s.date === currentDate);
    const allSlotsForDate = [...savedSlotsForDate, ...tempSlotsForDate];
    const availabilitySlots = getAvailabilitySlots();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#1E1E1E] border-2 border-[#686868] text-white rounded-xl w-full max-w-4xl p-6 shadow-xl">
                <div className="flex gap-6">
                    <MiniCalendar
                        selectedDate={selectedDate}
                        events={buildAvailabilityEvents()}
                        onDateSelect={setSelectedDate}
                    />

                    <div className="flex flex-col w-full justify-between items-end">
                        <button className="text-gray-300 hover:text-white" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="w-full flex flex-col items-end justify-end space-y-6">
                            <div className="flex gap-4">

                                <Link to="/calendar/sessions">
                                    <Button className="bg-codeblue flex flex-col text-wrap text-black h-fit max-w-24 mt-6 py-3">
                                        <CalendarCheck2 />
                                        Upcoming Sessions
                                    </Button>
                                </Link>

                                <Button
                                    className="bg-codeblue flex flex-col text-wrap text-black h-fit max-w-24 mt-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={temporarySlots.length === 0}
                                    onClick={handleSaveAvailability}
                                >
                                    <Check className="border-b" />
                                    Save Availability
                                    {temporarySlots.length > 0 && (
                                        <span className="text-xs mt-1">
                                            ({temporarySlots.length} new)
                                        </span>
                                    )}
                                </Button>
                            </div>

                            <div className="bg-[#2A2A2A] w-full rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">Choose Your Time</h3>
                                    {settings?.configuration?.unlimited_mentor_slot === 0 ? (
                                        <div className="text-sm font-medium text-gray-400">
                                            Monthly Quota: {getTotalMinutesForMonth(selectedDate)} / {MONTHLY_LIMIT_MINUTES} mins
                                        </div>
                                    ) : (
                                        <div className="text-sm font-medium text-green-400">
                                            Unlimited Booking Available
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#5A5A5A] rounded-lg p-4 space-y-4">
                                    <div className="flex items-center justify-between rounded-lg">
                                        <div className="flex flex-wrap items-center">
                                            <Check size={24} className="bg-codeblue p-1 rounded text-white" />
                                            <span className="w-28 ml-2 font-medium">
                                                {isToday(selectedDate)
                                                    ? "Today"
                                                    : selectedDate.toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                    })}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-3">
                                                <select
                                                    className="p-1 px-2 bg-[#323232] text-white rounded w-28"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                >
                                                    {getFilteredStartTimeOptions.map(t => (
                                                        <option key={t} value={t}>
                                                            {t}
                                                        </option>
                                                    ))}
                                                </select>

                                                <span className="px-2 !m-0">-</span>

                                                <select
                                                    className="p-1 px-2 !m-0 bg-[#323232] text-white rounded w-28"
                                                    value={endTime}
                                                    disabled={startTime === "--:-- --"}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                >
                                                    {getFilteredEndTimeOptions.map(t => (
                                                        <option key={t} value={t}>
                                                            {t}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                disabled={!isValidTime(startTime) || !isValidTime(endTime)}
                                                className={`text-white transition-colors ${isValidTime(startTime) && isValidTime(endTime) ? 'hover:text-codeblue' : 'opacity-50 cursor-not-allowed'}`}
                                                title={
                                                    isValidTime(startTime) && isValidTime(endTime)
                                                        ? "Add time slot locally"
                                                        : "Please select both start and end times"
                                                }
                                                onClick={handlePlusAdd}
                                            >
                                                <CirclePlus size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {availabilitySlots.length > 0 ? (
                        <ScheduledSessions
                            events={availabilitySlots}
                            horizontal={true}
                            showAllEvents={false}
                            selectedDate={""}
                            onEventClick={() => {
                                onClose();
                                toast.info("This is an availability slot");
                            }}
                            onDeleteSlot={handleDeleteSlot}
                        />
                    ) : (
                        <div className="text-center py-4 text-gray-400 italic">
                            No availability slots scheduled
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}