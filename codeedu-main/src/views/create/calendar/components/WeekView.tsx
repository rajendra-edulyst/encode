/* eslint-disable prefer-const */
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  differenceInMinutes,
  isPast,
  isToday,
} from 'date-fns';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarEvent } from '../types/calendar';
import { useSessionUser } from '@/store/authStore';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
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
    return differenceInMinutes(new Date(b.endTime), new Date(b.startTime)) -
      differenceInMinutes(new Date(a.endTime), new Date(a.startTime));
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
    if (!placed) {
      lanes.push([event]);
    }
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

export const WeekView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: WeekViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const SLOT_HEIGHT = 120;
  const HEADER_HEIGHT = 90;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = 0;
  }, [currentDate]);

  const displayHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6];
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = displayHours;
  const today = new Date();
  const { profile: profileData } = useSessionUser();
  const userIsMentor = profileData === "mentor";

  const getEventsStartingOnDay = (day: Date) => {
    const dayEvents = events.filter((e) => isSameDay(new Date(e.startTime), day));

    // Group events by time slot to merge duplicates
    const groupedEvents = new Map<string, CalendarEvent[]>();
    dayEvents.forEach(event => {
      const key = `${new Date(event.startTime).toISOString()}-${new Date(event.endTime).toISOString()}`;
      if (!groupedEvents.has(key)) {
        groupedEvents.set(key, []);
      }
      groupedEvents.get(key)!.push(event);
    });

    const mergedEvents: CalendarEvent[] = [];
    groupedEvents.forEach((group) => {
      // Find "Real" events (not availability)
      // Note: meeting_status === 'booked' usually implies it is a placeholder from availability OR a booked slot.
      // If title is 'Available' and it is booked, it's a "Slot Booked".
      const realEvents = group.filter(e => !e.id.toString().startsWith('availability-') && e.title !== 'Available' && e.meeting_status !== 'booked');

      // Pending count aggregation:
      const totalPendingCount = group.reduce((acc, ev) => {
        const selfPending = ev.approval_status === 0 ? 1 : 0;
        const invitesPending = ev.invited_user?.filter(u => u.approval_status === 0).length || 0;
        return acc + Math.max(selfPending, invitesPending);
      }, 0);

      let primaryEvent: CalendarEvent;
      if (realEvents.length > 0) {
        // Sort real events: Accepted > Pending > Others
        primaryEvent = realEvents.sort((a, b) => {
          const score = (e: CalendarEvent) => {
            if (e.approval_status === 1) return 3;
            if (e.approval_status === 0) return 2;
            return 1;
          }
          return score(b) - score(a);
        })[0];
      } else {
        // No real events, so check for "Booked" availability
        const bookedAvailability = group.find(e => e.meeting_status === 'booked');
        if (bookedAvailability) {
          primaryEvent = bookedAvailability;
        } else {
          // Just available slots or others
          primaryEvent = group[0];
        }
      }

      // Attach specific custom property for badge count
      mergedEvents.push({ ...primaryEvent, _pendingCount: totalPendingCount } as any);
    });

    return mergedEvents;
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const hourIndex = displayHours.indexOf(startHour);
    const durationMinutes = Math.max(30, differenceInMinutes(end, start));

    return {
      top: hourIndex * SLOT_HEIGHT + (startMinute / 60) * SLOT_HEIGHT,
      height: (durationMinutes / 60) * SLOT_HEIGHT,
    };
  };

  const getEventCardClasses = (event: CalendarEvent) => {
    const isEventPast = isPast(new Date(event.endTime));
    const approvalStatus = event.approval_status;
    const isSlot = event.title === "Available" || event.id.toString().startsWith('availability-');

    const hasPendingInvite = event.invited_user?.some(u => u.approval_status === 0);

    if (isEventPast) {
      return 'bg-[#FFD105] text-black border-[#D4AE04]';
    }
    if (approvalStatus === 2) {
      return 'bg-[#BA4242]/90 text-white border-[#A33636]';
    }

    if (event.meeting_status === 'booked') {
      return 'bg-[#00A8E9] text-white border-[#0096D1] shadow-lg';
    }

    if (approvalStatus === 1) {
      return 'bg-[#00A8E9] text-white border-[#0096D1] shadow-lg';
    }

    if (hasPendingInvite) {
      return 'bg-[#5A5A5A] text-white border-[#444444]';
    }

    if (approvalStatus === 0 || isSlot) {
      return 'bg-[#5A5A5A] text-white border-[#444444]';
    }

    if (approvalStatus === 3) {
      return 'bg-[#BA4242]/90 text-white border-[#A33636] line-through';
    }


    switch (event.color) {
      case 'blue':
        return 'bg-[#00A8E9] text-white border-[#0096D1]';
      case 'orange':
        return 'bg-orange-500 text-white border-orange-600';
      case 'primary':
        return 'bg-primary text-white border-primary-foreground';
      default:
        return 'bg-[#5A5A5A] text-white border-[#444444]';
    }
  };

  const getStatusBadgeClass = (event: CalendarEvent) => {
    const isEventPast = isPast(new Date(event.endTime));

    if (isEventPast) {
      return 'bg-[#796F43] text-white cursor-pointer hover:bg-[#8a7c50] transition-colors';
    }

    const approvalStatus = event.approval_status ?? 0;

    switch (approvalStatus) {
      case 1: return 'bg-[#00A8E9] text-white cursor-pointer hover:bg-[#1eb8ff] transition-colors';
      case 2: return 'bg-[#BA4242] text-white cursor-pointer hover:bg-[#d45959] transition-colors';
      case 0: return 'bg-[#796F43] text-white cursor-pointer hover:bg-[#8a7c50] transition-colors';
      default: return 'bg-gray-600 text-white cursor-pointer hover:bg-gray-700 transition-colors';
    }
  };

  const handleBadgeClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const isEventPast = event ? isPast(new Date(event.endTime)) : false;

    if (event && (isEventPast || event.approval_status === 2)) {
      navigate(`/dashboard/mentor?tab=sessions_history&eventId=${eventId}`);
    } else {
      console.log('Navigating to event:', eventId);
      navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${eventId}`);
    }
  };



  const handleDayBadgeClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const dayEvents = getEventsStartingOnDay(day);
    const pendingEvents = dayEvents.filter(event => {
      const approvalStatus = event.approval_status ?? 0;
      return approvalStatus === 1 && !isPast(new Date(event.endTime));
    });

    if (pendingEvents.length > 0) {
      const sortedEvents = pendingEvents.sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      const firstEvent = sortedEvents[0];
      navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${firstEvent.id}`);
    }
  };

  const isDatePast = (date: Date) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date < startOfToday;
  };

  const getActivePendingEvents = (day: Date) => {
    const dayEvents = getEventsStartingOnDay(day);
    return dayEvents.filter(event => {
      const isEventPast = isPast(new Date(event.endTime));
      const hasActiveInvite = event.invited_user?.some(u => u.approval_status === 0);
      const isPending = event.approval_status === 0 || hasActiveInvite;
      return isPending && !isEventPast;
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#1D1D1D]">
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-950 min-h-0"
      >
        <div className="min-w-full lg:min-w-[900px]">
          <div
            className="grid sticky top-0 z-30 bg-[#5A5A5A] border-b border-gray-800"
            style={{ gridTemplateColumns: '5rem repeat(7, minmax(100px, 1fr)) 5rem' }}
          >
            <div className="sticky left-0 z-40 h-[90px] border-r border-gray-800 bg-[#1D1D1D]" />
            {days.map((day, idx) => {
              const activePendingEvents = getActivePendingEvents(day);
              const pendingCount = activePendingEvents.length;
              const isDayToday = isToday(day);
              const isDayPast = isDatePast(day);
              const hasActivePendingEvents = pendingCount > 0;
              return (
                <div
                  key={idx}
                  className={`relative h-[90px] p-4 flex flex-col justify-center border-gray-800 border-r
                    ${isDayToday ? 'bg-blue-950/30' : hasActivePendingEvents && !isDayPast ? 'bg-blue-950/10' : 'bg-[#323232]'}`}
                >
                  <div className="text-xs text-[#FFFFFF] uppercase font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-2xl font-bold text-[#FFFFFF]">
                    {format(day, 'dd')}
                  </div>

                  {!isDayPast && hasActivePendingEvents && userIsMentor && (
                    <div
                      className="absolute top-3 right-3 cursor-pointer z-[60]"
                      title={`${pendingCount} pending event${pendingCount !== 1 ? 's' : ''}`}
                      onClick={(e) => handleBadgeClick(activePendingEvents[0].id)}
                    >
                      <div className="relative">
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105">
                          {pendingCount}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}


            <div className="sticky right-0 z-40 h-[90px] border-l border-gray-800 bg-[#1D1D1D]" />
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: '5rem repeat(7, minmax(100px, 1fr)) 5rem' }}
          >

            <div className="sticky left-0 z-20 bg-[#1D1D1D] border-r border-gray-800">
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
            {days.map((day, dayIdx) => {
              const dayEvents = getEventsStartingOnDay(day);
              const positioned = assignOverlapColumns(dayEvents);
              const isDayToday = isToday(day);
              const isDayPast = isDatePast(day);
              const activePendingEvents = getActivePendingEvents(day);
              const hasActivePendingEvents = activePendingEvents.length > 0;

              return (
                <div
                  key={dayIdx}
                  className={`relative border-r border-gray-800 
                  ${isDayToday ? 'bg-blue-950/5' : ''}
                  ${hasActivePendingEvents && !isDayPast ? 'bg-blue-950/5' : ''}
                  ${isDayPast ? 'bg-gray-900/20' : ''}`}
                >
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

                  {hours.map((hour, hourIndex) => {
                    const slotEvents = dayEvents.filter(event => {
                      const eventStart = new Date(event.startTime);
                      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
                    });
                    const activePendingSlotEvents = slotEvents.filter(event => {
                      const approvalStatus = event.approval_status ?? 0;
                      return approvalStatus === 0 && !isPast(new Date(event.endTime));
                    });
                    const pendingCount = activePendingSlotEvents.length;

                    return (
                      <div
                        key={hour}
                        className={`relative group cursor-pointer transition-colors
                        ${isDayPast ? 'cursor-default hover:bg-transparent' : 'cursor-pointer hover:bg-gray-800/30'}
                        ${pendingCount > 0 && !isDayPast ? 'bg-blue-900/20' : ''}`}
                        style={{ height: `${SLOT_HEIGHT}px` }}
                        onClick={() => !isDayPast && onTimeSlotClick(day, hour)}
                      >
                        {hourIndex !== hours.length - 1 && (
                          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-800"></div>
                        )}
                      </div>
                    );
                  })}

                  {positioned.map((event) => {
                    const pos = calculateEventPosition(event);
                    const totalColumns = event.totalColumns;
                    const column = event.column;

                    const isStacked = totalColumns > 1;
                    const baseStackedHeight = pos.height / totalColumns;
                    const stackedHeight = isStacked ? baseStackedHeight + 2 : pos.height;
                    const stackedTop = isStacked ? pos.top + (column * baseStackedHeight) - (column * 2) : pos.top;
                    const classes = getEventCardClasses(event);
                    const badgeClass = getStatusBadgeClass(event);
                    const isEventPast = isPast(new Date(event.endTime));

                    return (

                      <div
                        key={event.id}
                        className={`absolute rounded-md border-l-4 p-2 text-xs shadow-md z-10 hover:z-20 transition-all ${classes} ${isEventPast ? 'opacity-70' : ''
                          }`}
                        style={{
                          top: `${stackedTop}px`,
                          marginTop: "20px",
                          height: `${Math.max(stackedHeight, isStacked ? 50 : 60)}px`,
                          left: `2%`,
                          width: `95%`,
                          minHeight: isStacked ? '50px' : '60px',
                          overflow: 'visible',

                        }}
                        onClick={(e) => handleBadgeClick(event.id)}
                      >
                        <div className={`text-[11px] font-medium mb-0.5 opacity-90 ${isEventPast || event.approval_status === 2 ? 'line-through' : ''}`}>
                          {format(new Date(event.startTime), 'hh:mm')} - {format(new Date(event.endTime), 'hh:mm a')}
                        </div>
                        <div className={`font-bold text-sm truncate leading-tight ${isEventPast || event.approval_status === 2 ? 'line-through' : ''}`}>
                          {event.meeting_status === 'booked' ? 'Slot Booked' : (event.title === "Available" ? "Slot Available" : event.title)}
                        </div>

                        {(event as any)._pendingCount > 0 && !isEventPast && event.approval_status !== 2 && userIsMentor && (
                          <div className="absolute -top-4 -right-2 z-50">
                            <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-lg border-2 border-[#1D1D1D]">
                              {(event as any)._pendingCount}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="sticky right-0 z-20 bg-[#1D1D1D] border-l border-gray-800">
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
          </div>
        </div>
      </div>
    </div>
  );
};