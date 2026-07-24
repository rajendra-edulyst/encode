import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, setMonth, startOfYear } from "date-fns";
import { CalendarEvent } from "../types/calendar";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (date: Date) => void;
}

export const YearView = ({ currentDate, events, onMonthClick }: YearViewProps) => {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => setMonth(yearStart, i));
  const today = new Date();

  const MiniMonth = ({ monthDate }: { monthDate: Date }) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    const hasEvents = (day: Date) => {
      return events.some((event) => isSameDay(new Date(event.startTime), day));
    };

    return (
      <div
        className="bg-card rounded-lg p-4 border dark:border-gray-700 hover:border-accent transition-colors cursor-pointer"
        onClick={() => onMonthClick(monthDate)}
      >
        <div className="text-center text-primary font-semibold mb-3 text-sm">
          {format(monthDate, "MMMM")}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, monthDate);
            const dayHasEvents = hasEvents(day);

            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center text-xs rounded ${
                  isToday
                    ? "bg-primary text-white"
                    : isCurrentMonth
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span>{format(day, "d")}</span>
                {dayHasEvents && isCurrentMonth && !isToday && (
                  <span className="w-1 h-1 bg-primary rounded-full mt-0.5"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      <div className="text-3xl font-bold mb-6 text-primary text-center">
        {format(currentDate, "yyyy")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((month, index) => (
          <MiniMonth key={index} monthDate={month} />
        ))}
      </div>
    </div>
  );
};
