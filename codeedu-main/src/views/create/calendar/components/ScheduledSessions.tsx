
import { useRef } from 'react';
import { format, isSameDay, isAfter } from "date-fns";
import { MoveLeft, MoveRight, X } from "lucide-react";
import { IoIosVideocam } from "react-icons/io";
import { CalendarEvent } from "@/views/create/calendar/types/calendar";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSessionUser } from '@/store/authStore';
import ApiService from "@/services/ApiService";
import { fetchMentorLcLoad } from "@/services/learner/MyClassService";

interface ScheduledSessionsProps {
  events: (CalendarEvent & { slot_available_date?: string; isTemporary?: boolean })[];
  onEventClick: (event: CalendarEvent) => void;
  horizontal?: boolean;
  showAllEvents?: boolean;
  selectedDate?: string;
  onDeleteSlot?: (eventId: string) => void;
}

export const ScheduledSessions = ({
  events,
  onEventClick,
  horizontal = false,
  showAllEvents = false,
  selectedDate = "",
  onDeleteSlot
}: ScheduledSessionsProps) => {
  const navigate = useNavigate();
  const now = new Date();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { profile } = useSessionUser();
  const isMentor = profile === 'mentor';

  const filteredEvents = events.filter((event) => {
    try {

      if (!horizontal) {

        const isSlot = event.title === "Available" || event.id.toString().startsWith('availability-');
        const isPastSession = new Date(event.endTime) < now;

        if (isSlot || event.approval_status !== 1 || isPastSession) {
          return false;
        }
      }

      if (selectedDate && event.slot_available_date) {
        return event.slot_available_date === selectedDate;
      }

      if (showAllEvents) {
        return true;
      }

      const eventStart = new Date(event.startTime);
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return isAfter(eventStart, startOfToday) || isSameDay(eventStart, startOfToday);
    } catch (error) {
      console.error("Error parsing event date:", error, event);
      return false;
    }
  });

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    try {
      const eventStart = new Date(event.startTime);
      const dateKey = format(eventStart, "yyyy-MM-dd");
      const displayDateKey = format(eventStart, "EEEE MMM dd, yyyy");

      if (!acc[dateKey]) {
        acc[dateKey] = {
          events: [],
          displayDate: displayDateKey
        };
      }
      acc[dateKey].events.push(event);
      return acc;
    } catch (error) {
      console.error("Error grouping event:", error, event);
      return acc;
    }
  }, {} as Record<string, { events: (CalendarEvent & { slot_available_date?: string; isTemporary?: boolean })[], displayDate: string }>);

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const formatToDisplay = (dateStr: string): string => {
    const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    return format(date, "EEEE MMM dd, yyyy");
  };

  const handleDelete = (event: CalendarEvent & { slot_available_date?: string; isTemporary?: boolean }, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteSlot) {
      onDeleteSlot(event.id);
    }
  };

  if (!horizontal) {
    return (
      <div className="rounded-lg mt-4 font-bold">
        <h2 className="text-xl font-bold dark:text-white">
          Scheduled Sessions (Upcoming)
        </h2>

        <div className="space-y-4">
          {sortedDates.map((dateKey) => {
            try {
              const date = new Date(`${dateKey}T00:00:00`);
              const { events: dayEvents, displayDate } = groupedEvents[dateKey];
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={dateKey}
                  className="dark:bg-[#5A5A5A] rounded-lg p-3 space-y-2"
                >
                  <div className={`text-sm text-center font-bold uppercase ${isToday ? "text-codeblue" : "text-codeblue"}`}>
                    {displayDate}
                  </div>

                  {dayEvents.map((event) => {
                    const isExpired = new Date(event.endTime) < now || event.approval_status === 2;
                    const isAccepted = event.approval_status === 1;
                    const isRejected = event.approval_status === 3;
                    const isPending = event.approval_status === 0 || event.title === "Available" || event.id.toString().startsWith('availability-');

                    let colorClass = 'bg-[#5A5A5A]'; // Grey
                    if (isExpired) colorClass = 'bg-[#FFD105]';
                    else if (isAccepted) colorClass = 'bg-[#00A8E9]';
                    else if (isRejected) colorClass = 'bg-[#BA4242]';

                    return (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 cursor-pointer p-2 rounded transition-colors hover:bg-muted/30`}
                        onClick={() => onEventClick(event)}
                      >
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${colorClass}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center font-medium gap-2 text-sm text-muted-foreground">
                            <span className={isExpired ? 'line-through opacity-70' : ''}>
                              {format(new Date(event.startTime), "hh:mm a")} - {format(new Date(event.endTime), "hh:mm a")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <div className={`text-lg line-clamp-1 font-bold ${isExpired ? 'text-[#FFD105] line-through opacity-70' : 'dark:text-white'}`}>
                              {event.title}
                            </div>
                            {!isExpired && (event.link || event.approval_status === 1) && (
                              <button
                                disabled={!(isMentor || (new Date(event.startTime).getTime() - now.getTime()) / 60000 <= 5)}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const actualId = event.id.toString().replace('availability-', '');

                                  if (!event.link) {
                                    try {
                                      await ApiService.fetchDataWithAxios({
                                        url: `/create-calendar-zoom/${actualId}`,
                                        method: 'post',
                                        data: { calender_id: actualId }
                                      });
                                      await fetchMentorLcLoad(String(actualId));
                                    } catch (err) {
                                      toast.error("Failed to prepare session");
                                      return;
                                    }
                                  }
                                  navigate(`/zoom/meeting/${actualId}?is_mentoring=1`);
                                }}
                                className={`text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors shadow-sm ml-2 ${isMentor || (new Date(event.startTime).getTime() - now.getTime()) / 60000 <= 5
                                  ? 'bg-[#00A8E9] hover:bg-[#0088C2]'
                                  : 'bg-gray-400 cursor-not-allowed opacity-50'
                                  }`}
                              >
                                Join
                              </button>
                            )}
                          </div>

                          {isExpired && (
                            <div className="text-xs text-[#FFD105] mt-1 font-semibold">Expired</div>
                          )}
                          {((event.isTemporary || isPending) && !isExpired && onDeleteSlot) && (
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-yellow-500 mt-1">
                                {event.isTemporary ? 'Unsaved' : (event.meeting_status === 'booked' ? 'Booked' : 'Available')}
                              </div>
                              {event.meeting_status !== 'booked' && (
                                <button
                                  onClick={(e) => handleDelete(event, e)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                  title="Delete slot"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            } catch (error) {
              console.error("Error rendering date group:", error);
              return null;
            }
          })}

          {sortedDates.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {selectedDate
                ? `No scheduled sessions found for ${formatToDisplay(selectedDate)}`
                : "No upcoming scheduled sessions found"}
            </div>
          )}
        </div>
      </div>
    );
  }

  const scrollBy = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'right' ? delta : -delta, behavior: 'smooth' });
  };

  const shouldShowArrows = sortedDates.length > 0;

  return (
    <div className="mt-4 bg-[#323232] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">
          Available slots
        </h2>
        <div className="text-sm text-gray-300">
          {events.filter(e => e.isTemporary).length > 0 ? `${events.filter(e => e.isTemporary).length} unsaved slot(s)` : <Link to="/calendar/available-slots" className='text-primary'>
            View all slots
          </Link>}
        </div>
      </div>

      {shouldShowArrows && (
        <div className="flex relative items-center top-14 gap-2">
          <button
            className="p-2 absolute -left-8 rounded-full border border-codeblue bg-gray-200 dark:bg-[#2A2A2A] z-10"
            onClick={() => scrollBy('left')}
          >
            <MoveLeft size={14} className="text-codeblue" />
          </button>
          <button
            className="p-2 absolute -right-8 rounded-full border border-codeblue bg-gray-200 dark:bg-[#2A2A2A] z-10"
            onClick={() => scrollBy('right')}
          >
            <MoveRight size={14} className="text-codeblue" />
          </button>
        </div>
      )}

      <div ref={containerRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {sortedDates.length === 0 ? (
          <div className="text-center text-muted-foreground w-full py-8">
            {selectedDate
              ? `No availability slots found for ${formatToDisplay(selectedDate)}`
              : "No availability slots found"}
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            try {
              const date = new Date(`${dateKey}T00:00:00`);
              const { events: dayEvents } = groupedEvents[dateKey];
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={dateKey}
                  className="min-w-[300px] max-w-[300px] p-4 rounded-lg bg-[#F3F4F6] dark:bg-[#5A5A5A]"
                >
                  <div className="flex gap-2 text-sm font-bold justify-start items-center mb-2">
                    <span className="text-codeblue uppercase">
                      {isToday ? "TODAY" : format(date, "EEEE")}
                    </span>
                    <span className="font-medium text-gray-400">
                      {format(date, "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dayEvents.map((event) => {
                      const eventStart = new Date(event.startTime);
                      const eventEnd = new Date(event.endTime);
                      const isExpired = eventEnd < now || event.approval_status === 2;
                      const isAccepted = event.approval_status === 1;
                      const isPending = event.approval_status === 0 || event.title === "Available" || event.id.toString().startsWith('availability-');
                      const isRejected = event.approval_status === 3;

                      let colorClass = 'bg-codeblue'; // Default to primary blue
                      if (isExpired) colorClass = 'bg-[#FFD105]';
                      else if (isRejected) colorClass = 'bg-[#BA4242]';
                      else if (isAccepted) colorClass = 'bg-codeblue';

                      return (
                        <div
                          key={event.id}
                          className="flex gap-3 cursor-pointer p-0 rounded transition-colors hover:bg-muted/30"
                          onClick={() => onEventClick(event)}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${colorClass}`}></div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                                <span className={isExpired ? 'line-through opacity-70' : ''}>
                                  {format(eventStart, 'hh:mm a')} - {format(eventEnd, 'hh:mm a')}
                                </span>
                                {(event.link || event.approval_status === 1) && (
                                  <span className="inline-flex items-center justify-center bg-[#A1A1AA] rounded-full p-0.5 w-4 h-4">
                                    <IoIosVideocam size={10} className="text-black" />
                                  </span>
                                )}
                              </div>
                              {((event.isTemporary || isPending) && !isExpired && event.meeting_status !== 'booked' && onDeleteSlot) && (
                                <button
                                  onClick={(e) => handleDelete(event, e)}
                                  className="text-red-400 hover:text-red-600 transition-colors ml-2"
                                  title="Delete slot"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-0.5">
                              <div className={`text-sm font-bold line-clamp-1 ${isExpired ? 'text-[#FFD105] line-through opacity-70' : 'dark:text-white'}`}>
                                {event.title}
                              </div>
                              {!isExpired && (event.link || event.approval_status === 1) && (
                                <button
                                  disabled={!(isMentor || (new Date(event.startTime).getTime() - now.getTime()) / 60000 <= 5)}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const actualId = event.id.toString().replace('availability-', '');

                                    if (!event.link) {
                                      try {
                                        await ApiService.fetchDataWithAxios({
                                          url: `/create-calendar-zoom/${actualId}`,
                                          method: 'post',
                                          data: { calender_id: actualId }
                                        });
                                        await fetchMentorLcLoad(String(actualId));
                                      } catch (err) {
                                        toast.error("Failed to prepare session");
                                        return;
                                      }
                                    }
                                    navigate(`/zoom/meeting/${actualId}?is_mentoring=${isMentor ? 1 : 0}`);
                                  }}
                                  className={`text-white px-3 py-1 rounded-md text-xs font-bold transition-colors shadow-sm ml-2 shrink-0 ${isMentor || (new Date(event.startTime).getTime() - now.getTime()) / 60000 <= 5
                                    ? 'bg-[#00A8E9] hover:bg-[#0088C2]'
                                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                  Join
                                </button>
                              )}
                            </div>

                            {isExpired && (
                              <div className="text-xs text-[#FFD105] mt-1 font-semibold">Expired</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } catch (error) {
              console.error("Error rendering date group:", error);
              return null;
            }
          })
        )}
      </div>
    </div>
  );
};