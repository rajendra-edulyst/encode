import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSection from "@/components/LoadingSection";
import { useEvents } from "@/hooks/data/collaborate/useEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeeklyCalendar = () => {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [showEvents, setShowEvents] = useState<Moment | null>(moment());

    const startOfWeek = currentWeek.clone().startOf("week");
    const days = Array.from({ length: 7 }, (_, i) =>
        moment(startOfWeek).add(i, "days")
    );

    const handlePrevWeek = () =>
        setCurrentWeek(currentWeek.clone().subtract(1, "week"));

    const handleNextWeek = () =>
        setCurrentWeek(currentWeek.clone().add(1, "week"));

    const urlParams = useMemo(() => {
        if (!showEvents) return undefined;
        return {
            ongoing_date: showEvents.format("YYYY-MM-DD"),
            is_assigned: "1",
        };
    }, [showEvents]);

    const { data: events = [], isError, isLoading } = useEvents(
        urlParams ? new URLSearchParams(urlParams) : undefined
    );

    const sessions = events.filter(
        (event: any) =>
            event?.content_type === "zoomclass" ||
            event?.content_type === "offlineclass" ||
            event?.content_type === "liveclass"
    );

    return (
        <Card className="gap-0 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                    <span className="text-primary">Weekly</span> Calendar
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">

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

                    {/* Days Grid */}
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
                                            ? "bg-primary text-white dark:bg-primary dark:text-black"
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

                    {/* Sessions Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                        {/* Loading */}
                        {isLoading && events.length === 0 && (
                            <LoadingSection
                                title="Activities"
                                description="Please wait..."
                                isLoading={isLoading}
                            />
                        )}

                        {/* Error */}
                        {isError && events.length === 0 && (
                            <p className="text-red-500 text-sm">
                                Something went wrong, try again later
                            </p>
                        )}

                        {/* Sessions List */}
                        {sessions.length > 0 && (
                            <>
                                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                    Sessions on {showEvents?.format("MMM DD YYYY")}
                                </h4>

                                {sessions.map((event: any) => (
                                    <Link
                                        key={event?.id}
                                        to="/my-classes"
                                        className="block p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:shadow-md transition"
                                    >
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {event?.name}
                                        </div>

                                        {event?.content_type === "zoomclass" ? (
                                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                                {moment
                                                    .unix(Number(event?.from_date))
                                                    .format("D MMM YYYY")}{" "}
                                                -{" "}
                                                {moment
                                                    .unix(Number(event?.end_date))
                                                    .format("D MMM YYYY")}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                                {moment(event?.start_date).format("D MMM YYYY")} -{" "}
                                                {moment(event?.end_date).format("D MMM YYYY")}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </>
                        )}

                        {/* Empty State */}
                        {sessions.length === 0 && !isLoading && !isError && (
                            <div className="text-sm text-gray-500 text-center dark:text-gray-400">
                                No sessions are scheduled
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyCalendar;