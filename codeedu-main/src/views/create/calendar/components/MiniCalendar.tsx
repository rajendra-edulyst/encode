import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/ShadcnButton";
import type { CalendarEvent } from "../types/calendar";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events?: CalendarEvent[];
}

export const MiniCalendar = ({ selectedDate, onDateSelect, events = [] }: MiniCalendarProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = new Date();

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="dark:bg-[#5A5A5A] min-w-72 max-w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl dark:text-white font-bold">
          {format(selectedDate, "MMMM")} <span className="text-codeblue">{format(selectedDate, "yyyy")}</span>
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 dark:text-white"
            onClick={() => onDateSelect(subMonths(selectedDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 dark:text-white"
            onClick={() => onDateSelect(addMonths(selectedDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-codeblue font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          // find events for this day (match by startTime date)
          const eventsForDay = events
            .filter((ev) => ev.meeting_status !== 'booked')
            .filter((ev) => {
              if (!ev?.startTime) return false;
              try {
                return isSameDay(new Date(ev.startTime), day);
              } catch {
                return false;
              }
            });

          return (
            <button
              key={index}
              className={`relative aspect-square flex flex-col items-center justify-center text-sm !rounded-full transition-colors p-1 ${isSelected
                ? "bg-codeblue !rounded-full text-background font-bold"
                : isToday
                  ? "border border-codeblue text-codeblue font-semibold"
                  : isCurrentMonth
                    ? "hover:bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              onClick={() => onDateSelect(day)}
            >
              <div className="pointer-events-none">{format(day, "d")}</div>

              {/* event dots */}
              {eventsForDay.length > 0 && (
                <div className="absolute bottom-2 -mb-0.5 flex gap-1">
                  {eventsForDay.slice(0, 3).map((ev, i) => {
                    // all dots should be codeblue; when date is selected show white dots for contrast
                    const cls = isSelected ? "bg-white" : "bg-codeblue";

                    return <span key={i} className={`${cls} h-1 w-1 rounded-full`} />;
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
