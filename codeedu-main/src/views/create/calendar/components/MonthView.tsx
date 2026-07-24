import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isPast,
  isToday
} from "date-fns";
import { CalendarEvent } from "../types/calendar";
import { useNavigate } from "react-router-dom";
import { useSessionUser } from "@/store/authStore";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

export const MonthView = ({ currentDate, events, onEventClick, onDayClick }: MonthViewProps) => {
  const navigate = useNavigate();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { profile: profileData } = useSessionUser();
  const userIsMentor = profileData === "mentor";

  const getEventsForDay = (day: Date) => {
    return events
      .filter((e) => e.meeting_status !== 'booked')
      .filter((event) => isSameDay(new Date(event.startTime), day));
  };

  // Check if a date is in the past (excluding today)
  const isDatePast = (date: Date) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date < startOfToday;
  };

  // Get pending events that are not expired
  const getActivePendingEvents = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    return dayEvents.filter(event => {
      const isEventPast = isPast(new Date(event.endTime));
      const hasActiveInvite = event.invited_user?.some(u => u.approval_status === 0);
      const isPending = (event.approval_status === 0) || hasActiveInvite;
      return isPending && !isEventPast;
    });
  };

  const getFirstActivePendingEventOfDay = (day: Date) => {
    const activePendingEvents = getActivePendingEvents(day);
    if (activePendingEvents.length === 0) return null;

    return activePendingEvents.sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )[0];
  };

  const handleDayBadgeClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const isDayPast = isDatePast(day);
    if (isDayPast) return;
    if (!userIsMentor) return;

    const firstEvent = getFirstActivePendingEventOfDay(day);
    if (firstEvent) {
      navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${firstEvent.id}`);
      onEventClick(firstEvent);
    }
  };

  const handleBadgeClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const isEventPast = event ? isPast(new Date(event.endTime)) : false;

    if (event && (isEventPast || event.approval_status === 2)) {
      navigate(`/dashboard/mentor?tab=sessions_history&eventId=${eventId}`);
    } else {
      navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${eventId}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week day headers - use WeekView header style for consistency */}
      <div className="grid dark:bg-[#5A5A5A] bg-gray-200 sticky top-0 z-10" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center text-sm uppercase dark:text-white">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-auto">
        {days.map((day, index) => {
          const isDayToday = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayPast = isDatePast(day);
          const dayEvents = getEventsForDay(day);
          const activePendingEvents = getActivePendingEvents(day);
          const hasActivePendingEvents = activePendingEvents.length > 0;
          const pendingCount = activePendingEvents.length;

          // Calculate positions for border logic
          const isFirstColumn = index % 7 === 0;
          const isLastRow = index >= days.length - 7;

          return (
            <div
              key={index}
              className={`p-2 min-h-[120px] cursor-pointer hover:bg-muted/30 transition-colors relative
                ${!isCurrentMonth ? "bg-muted/20" : ""}
                ${isDayToday ? "bg-accent/5" : ""}
                ${hasActivePendingEvents && !isDayPast ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}
                ${!isFirstColumn ? "border-l dark:border-white" : ""}
                ${!isLastRow ? "border-b dark:border-white" : ""}`}
              onClick={() => onDayClick(day)}
            >
              {/* Event badge - top right corner (same as WeekView) - only show for future dates with pending events */}
              {!isDayPast && hasActivePendingEvents && (
                <div
                  className="absolute top-1 right-1 cursor-pointer z-10"
                  title={`${pendingCount} pending event${pendingCount !== 1 ? 's' : ''}`}
                  onClick={(e) => handleDayBadgeClick(day, e)}
                >
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105">
                      {pendingCount}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-semibold ${isDayToday
                    ? "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                    : !isCurrentMonth
                      ? "text-white"
                      : isDayPast
                        ? "text-gray-500 dark:text-gray-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const isEventPast = isPast(new Date(event.endTime));
                  const hasPendingInvite = event.invited_user?.some(u => u.approval_status === 0);
                  const isPending = (('approval_status' in event ? event.approval_status === 0 :
                    'isPendingInvite' in event ? event.isPendingInvite : false) || hasPendingInvite) && event.approval_status !== 1;
                  const isActivePending = isPending && !isEventPast;

                  return (
                    <div
                      key={event.id}
                      className={`text-[10px] leading-tight px-1.5 py-1 rounded-md mb-1 truncate flex items-center shadow-sm ${
                        // Determine event styling based on status
                        isEventPast ? 'bg-[#FFD105] text-black'
                          : event.approval_status === 2
                            ? 'bg-[#BA4242]/90 text-white'
                            : event.approval_status === 1
                              ? 'bg-[#00A8E9] text-white'
                              : event.invited_user?.some(u => u.approval_status === 0)
                                ? 'bg-[#5A5A5A] text-white'
                                : event.approval_status === 0 || event.title === "Available" || event.id.toString().startsWith('availability-')
                                  ? 'bg-[#5A5A5A] text-white'
                                  : event.approval_status === 3
                                    ? 'bg-[#BA4242] text-white line-through'
                                    : event.color === "blue"
                                      ? "bg-[#00A8E9] text-white"
                                      : event.color === "orange"
                                        ? "bg-orange-500 text-white"
                                        : event.color === "primary"
                                          ? "bg-primary text-white"
                                          : "bg-[#5A5A5A] text-white"
                        } ${isEventPast ? 'cursor-default' : 'cursor-pointer hover:brightness-110 transition-all'}`}

                      onClick={(e) => {
                        e.stopPropagation();
                        // if (!isEventPast) {
                        //   onEventClick(event);
                        //   if (event.approval_status !== undefined) {
                        //     navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${event.id}`);
                        //   }
                        // }
                        handleBadgeClick(event.id);
                      }}
                    >
                      <span className={`font-bold mr-1 ${isEventPast || event.approval_status === 2 ? 'line-through' : ''}`}>
                        {format(new Date(event.startTime), "h:mm")}
                      </span>
                      <span className={`truncate ${isEventPast || event.approval_status === 2 ? 'line-through' : ''}`}>{event.title === "Available" ? "Slot Available" : event.title}</span>
                      {isActivePending && (
                        <span className="ml-1 text-[8px] bg-yellow-400 text-black px-1 rounded-sm font-bold">
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div >
  );
};
