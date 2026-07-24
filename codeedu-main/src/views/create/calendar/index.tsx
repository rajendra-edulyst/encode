import { useState, useEffect, useMemo, useRef } from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { MonthView } from "./components/MonthView";
import { YearView } from "./components/YearView";
import { MiniCalendar } from "./components/MiniCalendar";
import { ScheduledSessions } from "./components/ScheduledSessions";
import { EventDialog } from "./components/EventDialog";
import { CalendarEvent } from "./types/calendar";
import { addWeeks, subWeeks, addDays, subDays, addMonths, subMonths, addYears, subYears } from "date-fns";
import { toast } from "sonner";
import { createServerEvent, deleteServerEvent, updateServerEvent, getAllMyAvailabilities } from './services/CalendarService';
import { fetchInvitedUsers } from '../old_calendar/services/CalendarService';
import { useCalendarStore } from './store/CalendarStore';
import { useMentoringSessions, usePendingInvites } from '@/hooks/data/faculty/useMentor';
import type { Event as ServerEvent } from '../old_calendar/@types/calendar';
import Breadcrumb from '@/components/breadcrumb'
import { useAuth } from '@/auth';
import { Link, useNavigate } from "react-router-dom";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"day" | "week" | "month" | "year">("week");
  // keep local UI state but also back it by a small store
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mentoringEvents, setMentoringEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<CalendarEvent[]>([]);
  const { setEvents: setStoreEvents, addEvent, updateEvent, removeEvent } = useCalendarStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogDate, setDialogDate] = useState<Date | undefined>();
  const [dialogHour, setDialogHour] = useState<number | undefined>();

  const breadcrumbItems = [
    { label: 'Calendar' },
  ]

  // Load events from localStorage or server
  useEffect(() => {
    // First try store saved events
    const stored = localStorage.getItem("calendar-events");
    if (stored) {
      const parsed = JSON.parse(stored) as CalendarEvent[];
      setEvents(parsed);
      setStoreEvents(parsed);
      return;
    }

    // Otherwise try loading from server
    (async () => {
      try {
        // const month = undefined; // optionally compute from currentDate
        // const res = await fetchCalendarEvents(month);
        // setEvents(res.events);
        // setStoreEvents(res.events);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const trackedPageView = useRef(false);
  useEffect(() => {
    if (!trackedPageView.current) {
      mixpanelService.track("Calendar Page Viewed");
      trackedPageView.current = true;
    }
  }, []);

  // Fetch mentoring sessions for the sidebar (uses old_calendar hook)
  const { data: mentoringRes } = useMentoringSessions();
  const { data: pendingInvites = [] } = usePendingInvites();
  useEffect(() => {
    if (!mentoringRes || !mentoringRes.data) {
      setMentoringEvents([]);
      return;
    }

    const parseDate = (s?: string) => {
      if (!s) return new Date().toISOString();
      const iso = s.replace(' ', 'T');
      const d = new Date(iso);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    const mapped: CalendarEvent[] = (mentoringRes.data || []).map((e: ServerEvent) => {
      const approval = e.approval_status;
      const isMent = e.is_mentoring;
      const color = approval === 1 ? 'primary' : approval === 0 ? 'gray' : isMent ? 'orange' : 'blue';

      // determine if current user has a pending invite for this session
      const hasPendingInvite = Array.isArray(pendingInvites) && pendingInvites.some((p: unknown) => {
        const pid = (p as Record<string, unknown>)?.id;
        return typeof pid !== 'undefined' && Number(pid) === Number(e.id);
      });

      return {
        id: String(e.id),
        title: e.title || 'Untitled',
        startTime: parseDate(String(e.start || e.start_date)),
        endTime: parseDate(String(e.end || e.end_date)),
        // normalize possible link fields
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

    setMentoringEvents(mapped);
  }, [mentoringRes, pendingInvites, user]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const res = await getAllMyAvailabilities();
        if (res.data) {
          const data = Array.isArray(res.data) ? res.data : [res.data];

          const convertTo24Hour = (time12: string): string => {
            if (!time12 || time12 === "--:-- --") return "00:00:00";
            const [time, modifier] = time12.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
            return `${hours.padStart(2, '0')}:${minutes}:00`;
          };

          const mapped = data.map((av: any) => {
            const dateStr = av.available_date;
            const startTime24 = convertTo24Hour(av.start_time);
            const endTime24 = convertTo24Hour(av.end_time);

            return {
              id: `availability-${av.id}`,
              title: "Available",
              startTime: new Date(`${dateStr}T${startTime24}`).toISOString(),
              endTime: new Date(`${dateStr}T${endTime24}`).toISOString(),
              color: 'blue',
              originalId: av.id,
              meeting_status: av.meeting_status,
            } as CalendarEvent;
          });
          setAvailabilities(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch availabilities", err);
      }
    };

    fetchAvailabilities();
  }, [user]);

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }

    // Navigate based on current view
    switch (currentView) {
      case "day":
        setCurrentDate(direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(direction === "prev" ? subYears(currentDate, 1) : addYears(currentDate, 1));
        break;
    }
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    // Navigate to the create page for empty slots. Include date and hour as query params
    // so the create page can prefill the selected time if desired.
    const iso = date.toISOString();
    mixpanelService.track("Calendar Time Slot Clicked", { date: iso, hour });
    navigate(`/calendar/create?date=${encodeURIComponent(iso)}&hour=${hour}`);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCurrentView("day");
    mixpanelService.track("Calendar View Changed", { view_type: "day" });
  };

  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    setCurrentView("month");
    mixpanelService.track("Calendar View Changed", { view_type: "month" });
  };

  const handleEventClick = (event: CalendarEvent) => {
    const bookingId = event.originalId ?? event.id;
    mixpanelService.track("Calendar Event Clicked", { event_id: bookingId, event_title: event.title });
    if (bookingId) {
      const isEventPast = new Date(event.endTime) < new Date();
      if (isEventPast || event.approval_status === 2) {
        navigate(`/dashboard/mentor?tab=sessions_history&eventId=${bookingId}`);
      } else {
        navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${bookingId}`);
      }
      return;
    }
    navigate('/calendar/create');
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    (async () => {
      try {
        const toServerFormat = (iso?: string) => {
          if (!iso) return undefined;
          // "2025-11-12T14:00:00.000Z" -> "2025-11-12 14:00"
          const d = new Date(iso);
          if (isNaN(d.getTime())) return undefined;
          const pad = (n: number) => String(n).padStart(2, '0');
          const y = d.getFullYear();
          const m = pad(d.getMonth() + 1);
          const day = pad(d.getDate());
          const hh = pad(d.getHours());
          const mm = pad(d.getMinutes());
          return `${y}-${m}-${day} ${hh}:${mm}`;
        };

        if (selectedEvent) {
          // Update
          await updateServerEvent(selectedEvent.id, {
            title: eventData.title,
            start_date: toServerFormat(eventData.startTime),
            end_date: toServerFormat(eventData.endTime),
          });
          const updated: CalendarEvent = { ...(selectedEvent as CalendarEvent), ...(eventData as CalendarEvent) };
          setEvents(events.map((e) => (e.id === selectedEvent.id ? updated : e)));
          updateEvent(updated);
          toast.success('Event updated');
        } else {
          // Create
          const serverPayload = {
            title: eventData.title || 'Untitled',
            start_date: toServerFormat(eventData.startTime),
            end_date: toServerFormat(eventData.endTime),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
          await createServerEvent(serverPayload);
          const created: CalendarEvent = (eventData as CalendarEvent);
          setEvents([...events, created]);
          addEvent(created);
          toast.success('Event created');
        }
      } catch (err) {
        console.error('Failed to save event', err);
        toast.error('Failed to save event');
      } finally {
        setDialogDate(undefined);
        setDialogHour(undefined);
      }
    })();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      (async () => {
        try {
          await deleteServerEvent(selectedEvent.id);
          setEvents(events.filter((e) => e.id !== selectedEvent.id));
          removeEvent(selectedEvent.id);
          toast.success('Event deleted');
        } catch (err) {
          console.error('Failed to delete event', err);
          toast.error('Failed to delete event');
        }
      })();
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={combinedEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={combinedEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={combinedEvents}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        );
      case "year":
        return (
          <YearView
            currentDate={currentDate}
            events={combinedEvents}
            onMonthClick={handleMonthClick}
          />
        );
    }
  };

  const combinedEvents = useMemo(() => {
    const combinedMap = new Map<string, CalendarEvent>();
    events.forEach((e) => combinedMap.set(e.id, e));
    mentoringEvents.forEach((e) => {
      if (!combinedMap.has(e.id)) combinedMap.set(e.id, e);
    });
    availabilities.forEach((e) => {
      if (!combinedMap.has(e.id)) combinedMap.set(e.id, e);
    });
    return Array.from(combinedMap.values());
  }, [events, mentoringEvents, availabilities]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[800px] overflow-hidden">


      <div className="flex flex-wrap mb-6 justify-between gap-4">
        {/* <div>
          <Breadcrumb items={breadcrumbItems} />
          <p className="text-base font-normal dark:text-white">Prioritize and block dedicated time slots for mentoring sessions.</p>
        </div> */}
        <div className="flex flex-wrap items-center justify-between gap-4 flex-1 min-w-0">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <p className="text-base font-normal dark:text-white">
              Prioritize and block dedicated time slots for mentoring sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#00A8E9]" />
              <span className="dark:text-white">Accepted / Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FFD105]" />
              <span className="dark:text-white">Expired / Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#BA4242]" />
              <span className="dark:text-white">Cancelled / Rejected</span>
            </div>


          </div>
        </div>



        <div className="flex gap-2">

          <Link
            to="/calendar/sessions"
            className="relative bg-primary border max-w-24 text-center text-wrap justify-center flex items-center text-gray-800 p-3 py-4 rounded-md"
          >
            Mentoring Sessions

          </Link>

          {/* {!user?.is_mentor && (
            <Link
              to="/become-mentor"
              className="relative bg-primary border max-w-24 text-center text-wrap justify-center flex items-center text-gray-800 p-3 py-4 rounded-md"
            >
              Be a Mentor
            </Link>
          )} */}



          {/* <Link
            to="/calendar/create"
            className="relative bg-primary border max-w-24 text-center text-gray-800 justify-center flex items-center p-3 py-4 rounded-md"
          >
            Add New Meeting
          </Link> */}

        </div>
      </div>

      <div className="flex bg-card rounded-2xl flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="border-r border-border p-4 overflow-y-auto hidden md:block w-80 flex-shrink-0">
          <MiniCalendar selectedDate={currentDate} events={combinedEvents} onDateSelect={setCurrentDate} />
          <ScheduledSessions events={combinedEvents} onEventClick={(e) => {
              mixpanelService.track("Calendar Event Clicked", { event_id: e.id });
              handleEventClick(e);
            }} />
        </div>

        {/* Main Calendar */}
        <div className="flex-1 flex flex-col rounded-r-2xl dark:bg-[#323232] overflow-hidden">
          <CalendarHeader
            currentView={currentView}
            currentDate={currentDate}
            onViewChange={(view) => {
              setCurrentView(view);
              mixpanelService.track("Calendar View Changed", { view_type: view });
            }}
            onNavigate={handleNavigate}
          />

          <div className="flex-1 mr-4 dark:bg-[#1D1D1D] flex flex-col min-h-0 overflow-hidden">
            {renderView()}
          </div>
        </div>

        {/* Event Dialog */}
        <EventDialog
          open={dialogOpen}
          event={selectedEvent}
          defaultDate={dialogDate}
          defaultHour={dialogHour}
          onClose={() => {
            setDialogOpen(false);
            setSelectedEvent(null);
            setDialogDate(undefined);
            setDialogHour(undefined);
          }}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
        />
      </div>

    </div>

  );
};

export default Index;
