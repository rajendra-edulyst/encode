import { format, isSameDay, isPast, isToday } from 'date-fns'
import { useEffect, useRef } from 'react'
import { CalendarEvent } from '../types/calendar'
import { useNavigate } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'

interface DayViewProps {
    currentDate: Date
    events: CalendarEvent[]
    onEventClick: (event: CalendarEvent) => void
    onTimeSlotClick: (date: Date, hour: number) => void
}

interface PositionedEvent extends CalendarEvent {
    column: number;
    totalColumns: number;
    columnOffset: number;
}

function assignOverlapColumns(dayEvents: CalendarEvent[]): PositionedEvent[] {
    if (dayEvents.length === 0) return [];

    const sorted = [...dayEvents].sort((a, b) => {
        const sa = new Date(a.startTime).getTime();
        const sb = new Date(b.startTime).getTime();
        if (sa !== sb) return sa - sb;
        const da = new Date(a.endTime).getTime() - sa;
        const db = new Date(b.endTime).getTime() - sb;
        return db - da; // longer first
    });

    const positioned: PositionedEvent[] = [];
    let cluster: CalendarEvent[] = [];
    let clusterEnd = 0;

    for (const event of sorted) {
        const start = new Date(event.startTime).getTime();
        if (start >= clusterEnd) {
            if (cluster.length > 0) calculateClusterLanes(cluster, positioned);
            cluster = [event];
            clusterEnd = new Date(event.endTime).getTime();
        } else {
            cluster.push(event);
            clusterEnd = Math.max(clusterEnd, new Date(event.endTime).getTime());
        }
    }
    if (cluster.length > 0) calculateClusterLanes(cluster, positioned);

    return positioned;
}

function calculateClusterLanes(cluster: CalendarEvent[], positioned: PositionedEvent[]) {
    const lanes: CalendarEvent[][] = [];
    for (const event of cluster) {
        const start = new Date(event.startTime).getTime();
        let placed = false;
        for (let i = 0; i < lanes.length; i++) {
            const lastInLane = lanes[i][lanes[i].length - 1];
            if (new Date(lastInLane.endTime).getTime() <= start) {
                lanes[i].push(event);
                placed = true;
                break;
            }
        }
        if (!placed) lanes.push([event]);
    }

    cluster.forEach((event) => {
        const laneIndex = lanes.findIndex((l) => l.includes(event));
        positioned.push({
            ...event,
            column: laneIndex,
            totalColumns: lanes.length,
            columnOffset: laneIndex * 2,
        });
    });
}

export const DayView = ({
    currentDate,
    events,
    onEventClick,
    onTimeSlotClick,
}: DayViewProps) => {
    const navigate = useNavigate()
    const today = new Date()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const displayHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6];
    const hours = displayHours
    const SLOT_HEIGHT = 120;

    // Check if a date is in the past (excluding today)
    const isDatePast = (date: Date) => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return date < startOfToday;
    };

    // Get events for the current day
    const getEventsForDay = (day: Date) => {
        return events
            .filter((e) => e.meeting_status !== 'booked')
            .filter((event) => isSameDay(new Date(event.startTime), day))
    }

    // Get pending events that are not expired
    const getActivePendingEvents = (day: Date) => {
        const dayEvents = getEventsForDay(day);
        return dayEvents.filter(event => {
            const isEventPast = isPast(new Date(event.endTime));
            const hasActiveInvite = event.invited_user?.some(u => u.approval_status === 0);
            const isPending = (event.approval_status === 0) || hasActiveInvite;
            return isPending && !isEventPast;
        });
    }

    // Get first active pending event of the day
    const getFirstActivePendingEventOfDay = (day: Date) => {
        const activePendingEvents = getActivePendingEvents(day);
        if (activePendingEvents.length === 0) return null;

        return activePendingEvents.sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )[0];
    }

    // Handle day clickable badge
    const handleDayBadgeClick = (e: React.MouseEvent, day: Date) => {
        e.stopPropagation()
        const isDayPast = isDatePast(day);
        if (isDayPast) return;

        const firstEvent = getFirstActivePendingEventOfDay(day)
        if (firstEvent) {
            navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${firstEvent.id}`)
        }
    }

    const handleBadgeClick = (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        const isEventPast = event ? isPast(new Date(event.endTime)) : false;

        if (event && (isEventPast || event.approval_status === 2)) {
            navigate(`/dashboard/mentor?tab=sessions_history&eventId=${eventId}`);
        } else {
            navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${eventId}`);
        }
    };

    // Auto-scroll to earliest event or current time
    useEffect(() => {
        if (!containerRef.current) return

        // Reset scroll to top (7 AM) when date changes
        containerRef.current.scrollTop = 0;
    }, [events, currentDate]);

    // Get events for a specific hour slot
    const getEventsForSlot = (hour: number) => {
        return events.filter((event) => {
            const eventStart = new Date(event.startTime)
            return (
                isSameDay(eventStart, currentDate) &&
                eventStart.getHours() === hour
            )
        })
    }

    // Calculate event height based on duration
    const getEventHeight = (event: CalendarEvent) => {
        const start = new Date(event.startTime)
        const end = new Date(event.endTime)
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return duration * 120
    }

    // Get total active pending events count for the day
    const getActivePendingEventsCount = (day: Date) => {
        return getActivePendingEvents(day).length;
    }

    // Determine event styling based on status
    const getEventClasses = (event: CalendarEvent) => {
        const isEventPast = isPast(new Date(event.endTime));
        const approvalStatus = 'approval_status' in event ? event.approval_status : undefined;
        const isSlot = event.title === "Available" || event.id.toString().startsWith('availability-');

        const hasPendingInvite = event.invited_user?.some(u => u.approval_status === 0);

        if (isEventPast) {
            return 'bg-[#FFD105] text-black border-l-4 border-[#D4AE04]'; // Expired / Status 2
        }
        if (approvalStatus === 2) {
            return 'bg-[#BA4242]/90 text-white border-[#A33636]';
        }


        if (event.meeting_status === 'booked') {
            return 'bg-[#00A8E9] text-white border-l-4 border-[#0088C2]'; // Booked Slot
        }

        if (approvalStatus === 1) {
            return 'bg-[#00A8E9] text-white border-l-4 border-[#0088C2]'; // Accepted
        }

        if (hasPendingInvite) {
            return 'bg-[#5A5A5A] text-white border-l-4 border-[#444444]'; // Pending (from invited user)
        }

        if (approvalStatus === 0 || isSlot) {
            return 'bg-[#5A5A5A] text-white border-l-4 border-[#444444]'; // Pending or Available Slot
        }

        if (approvalStatus === 3) {
            return 'bg-[#BA4242] text-white border-l-4 border-[#A03A3A] line-through'; // Rejected/Cancelled
        }

        // Fallback
        return 'bg-[#5A5A5A] text-white border-l-4 border-[#444444]';
    };

    const isDayToday = isToday(currentDate);
    const isDayPast = isDatePast(currentDate);
    const activePendingEventsCount = getActivePendingEventsCount(currentDate);
    const hasActivePendingEvents = activePendingEventsCount > 0;
    const { profile: profileData } = useSessionUser();
    const userIsMentor = profileData === "mentor";

    return (
        <div className="flex flex-col h-full min-h-0 bg-[#1D1D1D]">
            {/* Unified Scrollable Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-950 min-h-0"
            >
                {/* Day header */}
                <div
                    className="grid sticky top-0 z-30 dark:bg-[#5A5A5A] bg-gray-200 border-b border-gray-800"
                    style={{ gridTemplateColumns: '5rem 1fr' }}
                >
                    <div className="sticky left-0 z-40 p-4 dark:!bg-[#323232] bg-gray-200 border-r border-gray-800 flex items-center justify-center">
                        {/* Badge in header (top-left) - only show for future dates with pending events */}
                        {!isDayPast && hasActivePendingEvents && userIsMentor && (
                            <div
                                className="cursor-pointer"
                                title={`${activePendingEventsCount} pending event${activePendingEventsCount !== 1 ? 's' : ''}`}
                                onClick={(e) => handleDayBadgeClick(e, currentDate)}
                            >
                                <div className="relative">
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <div className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105">
                                        {activePendingEventsCount}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`p-4 text-left flex justify-start flex-col pt-2 ${isDayToday ? 'bg-blue-950/30' : isDayPast ? 'bg-gray-900/20' : 'bg-[#323232]'}`}>
                        <div className={`text-xs uppercase font-medium ${isDayPast ? 'text-gray-500' : 'text-[#FFFFFF]'}`}>
                            {format(currentDate, 'EEEE')}
                        </div>
                        <div className={`text-2xl font-bold ${isDayToday ? 'text-[#FFFFFF]' : isDayPast ? 'text-gray-500' : 'text-[#FFFFFF]'}`}>
                            {format(currentDate, 'dd')}
                        </div>
                        <div className={`text-sm mt-1 font-medium ${isDayPast ? 'text-gray-500' : 'text-gray-400'}`}>
                            {format(currentDate, 'MMMM yyyy')}
                        </div>
                    </div>
                </div>

                {/* Grid Body */}
                <div className="grid relative" style={{ gridTemplateColumns: '5rem 1fr' }}>
                    {/* Time labels (Sticky Left) */}
                    <div className="sticky left-0 z-20 dark:bg-[#1D1D1D] bg-gray-200 border-r border-gray-800">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="flex items-center justify-center text-sm text-gray-500 font-medium"
                                style={{ height: `${SLOT_HEIGHT}px` }}
                            >
                                {format(new Date(2000, 0, 1, hour), 'h a')}
                            </div>
                        ))}
                    </div>

                    {/* Day column */}
                    <div
                        className={`relative ${isDayToday ? 'bg-blue-950/5' : isDayPast ? 'bg-gray-900/20' : ''}`}
                    >
                        {/* Current time indicator - only for today */}
                        {isDayToday && (
                            <div
                                className="absolute left-0 right-0 h-0.5 bg-blue-500 z-20"
                                style={{
                                    top: `${displayHours.indexOf(today.getHours()) * SLOT_HEIGHT + (today.getMinutes() / 60) * SLOT_HEIGHT}px`,
                                }}
                            >
                                <div className="absolute left-0 -top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                        )}

                        {/* Time slots */}
                        {hours.map((hour) => {
                            const dayEvents = getEventsForDay(currentDate);
                            const positioned = assignOverlapColumns(dayEvents);
                            const slotEvents = positioned.filter(e => new Date(e.startTime).getHours() === hour);

                            const activePendingSlotEvents = slotEvents.filter(event => {
                                const isEventPast = isPast(new Date(event.endTime));
                                const isPending = 'approval_status' in event ? event.approval_status === 0 :
                                    'isPendingInvite' in event ? event.isPendingInvite : false;
                                return isPending && !isEventPast;
                            });
                            const pendingCountInSlot = activePendingSlotEvents.length;

                            return (
                                <div
                                    key={hour}
                                    className={`relative border-b border-gray-800 transition-colors ${isDayPast ? 'cursor-default' : 'cursor-pointer hover:bg-gray-800/30'}`}
                                    style={{ height: `${SLOT_HEIGHT}px` }}
                                    onClick={() => !isDayPast && onTimeSlotClick(currentDate, hour)}
                                >
                                    {/* Highlight slot if it has pending events */}
                                    {pendingCountInSlot > 0 && !isDayPast && (
                                        <div className="absolute inset-0 bg-blue-900/20 pointer-events-none"></div>
                                    )}

                                    {slotEvents.map((event) => {
                                        const isEventPast = isPast(new Date(event.endTime));
                                        const eventClasses = getEventClasses(event);
                                        const approvalStatus = 'approval_status' in event ? event.approval_status : undefined;

                                        const totalColumns = event.totalColumns;
                                        const column = event.column;
                                        const isStacked = totalColumns > 1;

                                        const baseHeight = getEventHeight(event);
                                        const baseStackedHeight = baseHeight / totalColumns;
                                        const stackedHeight = isStacked ? baseStackedHeight + 2 : baseHeight;
                                        const stackedTop = isStacked
                                            ? (displayHours.indexOf(new Date(event.startTime).getHours()) * SLOT_HEIGHT + (new Date(event.startTime).getMinutes() / 60) * SLOT_HEIGHT) + (column * baseStackedHeight) - (column * 2)
                                            : (displayHours.indexOf(new Date(event.startTime).getHours()) * SLOT_HEIGHT + (new Date(event.startTime).getMinutes() / 60) * SLOT_HEIGHT);

                                        return (
                                            <div
                                                key={event.id}
                                                className={`absolute left-2 right-2 rounded-md border-l-4 p-3 text-xs shadow-md z-10 hover:z-20 transition-all ${eventClasses} ${isEventPast ? 'opacity-70' : ''}`}
                                                style={{
                                                    height: `${Math.max(stackedHeight, isStacked ? 50 : 60)}px`,
                                                    top: `${stackedTop}px`,
                                                    zIndex: 15,
                                                    minHeight: isStacked ? '50px' : '60px',
                                                    overflow: 'visible'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBadgeClick(event.id);
                                                }}
                                            >
                                                <div className={`text-[11px] font-medium mb-1 opacity-90 ${isEventPast || approvalStatus === 2 ? 'line-through' : ''}`}>
                                                    {format(new Date(event.startTime), 'hh:mm')} - {format(new Date(event.endTime), 'hh:mm a')}
                                                </div>
                                                <div className={`font-bold text-sm truncate leading-tight ${isEventPast || approvalStatus === 2 ? 'line-through' : ''}`}>
                                                    {event.meeting_status === 'booked' ? 'Slot Booked' : (event.title === "Available" ? "Slot Available" : event.title)}
                                                </div>

                                                {(event as any)._pendingCount > 0 && !isEventPast && approvalStatus !== 2 && (
                                                    <div className="absolute -top-4 -right-2 z-50">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-lg border-2 border-[#1D1D1D]">
                                                            {(event as any)._pendingCount}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
