import React, { useMemo, useState, useEffect } from "react";
import moment, { Moment } from "moment";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSection from "@/components/LoadingSection";
import { useEvents } from "@/hooks/data/collaborate/useEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const SmallEventCard = ({ event }: { event: any }) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const activeDateStr = event?.event_datetime || event?.start_date;

    const eventTimeMs = !isNaN(Number(activeDateStr))
        ? Number(activeDateStr) * 1000
        : moment(activeDateStr).valueOf();

    const diffMs = eventTimeMs - now;

    // Join button disabled after 1 hour of the event time
    const canJoin = diffMs <= 10 * 60 * 1000 && diffMs >= -60 * 60 * 1000;

    let timeStr = "";
    if (activeDateStr) {
        if (!isNaN(Number(activeDateStr))) {
            timeStr = moment.unix(Number(activeDateStr)).format("D MMM YYYY h:mm A");
        } else {
            timeStr = moment(activeDateStr).format("D MMM YYYY h:mm A");
        }
    }

    let targetCategory = event?.event_category_name || 'Career Drive';
    if (event?.event_group_name === 'Must Attend') {
        const lower = targetCategory.toLowerCase();
        if (lower.includes('community meetup')) targetCategory = 'Creators Meetup';
        if (lower.includes('flagship event')) targetCategory = 'enCODE';
    }

    const eventLink = (event?.event_group_name === 'Must Attend')
        ? `/must-attend/details/${event.id}?category=${targetCategory}`
        : `/agenda/details/${event.id}?category=${targetCategory}`;

    const renderCountdown = () => {
        if (diffMs <= 0 || diffMs > 24 * 60 * 60 * 1000) return null;

        const diffSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSec / 3600);
        const mins = Math.floor((diffSec % 3600) / 60);
        const secs = diffSec % 60;

        return (
            <div className="flex gap-1.5 mt-3">
                <div className="flex flex-col items-center">
                    <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                        <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                        <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(hours).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Hours</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                        <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                        <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(mins).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Mins</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                        <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                        <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(secs).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Secs</span>
                </div>
            </div>
        );
    };

    return (
        <div className="relative block w-full p-4 mb-3 bg-[#1D1D1D] rounded-xl border border-gray-800 shadow-sm overflow-hidden group">
            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex justify-between items-start">
                    {event?.event_group_name ? (
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px] uppercase font-medium">
                            {event?.event_group_name}
                        </Badge>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-1 text-gray-300">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[10px] font-medium tracking-tight truncate max-w-[120px]">
                            {event?.vanue || 'Online'}
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <h5 className="text-sm font-bold text-white line-clamp-2 pr-4">
                            {event?.name || event?.title}
                        </h5>
                        <div className="text-xs text-gray-400 mt-1">
                            {timeStr}
                        </div>
                    </div>
                    <div className="shrink-0">
                        {canJoin ? (
                            <Link
                                to={eventLink}
                                className="bg-[#7FBC42] hover:bg-[#6da538] text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                                Join Now
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="bg-gray-600 text-gray-400 text-xs font-bold px-4 py-2 rounded-lg cursor-not-allowed"
                            >
                                Join
                            </button>
                        )}
                    </div>
                </div>

                {renderCountdown()}
            </div>
        </div>
    );
};
const ConnectWeeklyCalendar = () => {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [showEvents, setShowEvents] = useState<Moment | null>(moment());

    const startOfWeek = currentWeek.clone().startOf("week");
    const days = Array.from({ length: 7 }, (_, i) =>
        moment(startOfWeek).add(i, "days")
    );

    const handlePrevWeek = () => {
        const newWeek = currentWeek.clone().subtract(1, "week");
        setCurrentWeek(newWeek);
        if (showEvents) {
            setShowEvents(showEvents.clone().subtract(1, "week"));
        } else {
            setShowEvents(newWeek.clone().startOf("week"));
        }
    };

    const handleNextWeek = () => {
        const newWeek = currentWeek.clone().add(1, "week");
        setCurrentWeek(newWeek);
        if (showEvents) {
            setShowEvents(showEvents.clone().add(1, "week"));
        } else {
            setShowEvents(newWeek.clone().startOf("week"));
        }
    };

    const urlParams = useMemo(() => {
        return {
            is_assigned: "1",
        };
    }, []);

    const { data: events = [], isError, isLoading } = useEvents(
        urlParams ? new URLSearchParams(urlParams) : null
    );

    const upcomingEvents = events.filter((event: any) => {
        const contentType = String(event?.content_type || event?.comp_type || "").toLowerCase();
        const categoryName = String(event?.event_category_name || "").toLowerCase();

        const isEvent = contentType === "event" ||
            contentType === "workshop" ||
            contentType === "masterclass" ||
            categoryName === "masterclass";

        if (!isEvent) return false;

        if (showEvents) {
            const targetDate = event?.event_datetime || event?.start_date;
            if (!targetDate) return false;

            return moment(targetDate).isSame(showEvents, 'day');
        }

        return true;
    });

    return (
        <Card className="gap-0 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                    <span className="text-primary">Weekly</span> Calendar
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">

                    {/* Week Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            className="text-xl font-bold text-gray-700 dark:text-gray-200 hover:opacity-70"
                            onClick={handlePrevWeek}
                        >
                            <FaAngleLeft />
                        </button>

                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            {startOfWeek.format("MMM DD")} -{" "}
                            {startOfWeek.clone().endOf("week").format("DD MMM")}
                        </div>

                        <button
                            className="text-xl font-bold text-gray-700 dark:text-gray-200 hover:opacity-70"
                            onClick={handleNextWeek}
                        >
                            <FaAngleRight />
                        </button>
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day) => {
                            const isToday = day.isSame(moment(), "day");
                            const isSelected =
                                showEvents && showEvents.isSame(day, "day");

                            return (
                                <div
                                    key={day.format("YYYY-MM-DD")}
                                    onClick={() => setShowEvents(day)}
                                    className={`text-center text-xs rounded-lg cursor-pointer p-2 transition-all duration-200
                    ${isSelected
                                            ? "bg-yellow-500 text-white dark:bg-primary dark:text-white"
                                            : "text-gray-700 dark:text-gray-300"
                                        }
                    ${isToday && !isSelected
                                            ? "text-primary font-semibold"
                                            : ""
                                        }
                    hover:bg-gray-200 dark:hover:bg-gray-700
                  `}
                                >
                                    <div className="font-bold">{day.format("ddd")}</div>
                                    <div>{day.format("DD")}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Events Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        {upcomingEvents.length > 0 && (
                            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                Events on {showEvents?.format("MMM DD YYYY")}
                            </h4>
                        )}

                        {/* Event List */}
                        {upcomingEvents.map((event: any) => (
                            <SmallEventCard key={event?.id} event={event} />
                        ))}

                        {/* Loading */}
                        {isLoading && upcomingEvents.length === 0 && (
                            <LoadingSection
                                title="Activities"
                                description="Please wait..."
                                isLoading={isLoading}
                            />
                        )}

                        {/* Error */}
                        {isError && upcomingEvents.length === 0 && (
                            <p className="text-red-500 text-sm">
                                Something went wrong, try again later
                            </p>
                        )}

                        {/* Empty State */}
                        {upcomingEvents.length === 0 &&
                            !isLoading &&
                            !isError && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No Events found
                                </div>
                            )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ConnectWeeklyCalendar;