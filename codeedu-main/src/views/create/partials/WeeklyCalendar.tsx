import React, { useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import LoadingSection from '@/components/LoadingSection';
import { useEvents } from '@/hooks/data/collaborate/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchAllCalendarSessions } from '../old_calendar/services/CalendarService';
import ApiService from "@/services/ApiService";
import { toast } from "sonner";
import { fetchMentorLcLoad } from "@/services/learner/MyClassService";
import { Loader } from "lucide-react";

const LearnerWeeklyCalendar = () => {
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [showEvents, setShowEvents] = useState<Moment | null>(moment());
    const [joiningId, setJoiningId] = useState<number | string | null>(null);
    const startOfWeek = currentWeek.clone().startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => moment(startOfWeek).add(i, 'days'));
    const handlePrevWeek = () => setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
    const handleNextWeek = () => setCurrentWeek(currentWeek.clone().add(1, 'week'));
    const viewedMonth = startOfWeek.format('YYYY-MM');

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

    const { data: calendarData, isLoading: isCalendarLoading } = useQuery({
        queryKey: ['calendar-sessions', viewedMonth],
        queryFn: () => fetchAllCalendarSessions(viewedMonth)
    });

    const calendarSessions = useMemo(() => {
        if (!calendarData?.data || !showEvents) return [];
        return calendarData.data.filter((event) =>
            moment(event.start || event.start_date).isSame(showEvents, 'day')
        ).map(event => ({
            id: event.id,
            name: event.title,
            start_date: event.start || event.start_date,
            end_date: event.end || event.end_date,
            content_type: 'calendar_session',
            from_date: undefined,
            link: event.link,
            mentor_calendar_id: event.mentor_calendar_id
        }));
    }, [calendarData, showEvents]);

    const sessions = [
        ...events.filter(event => event?.content_type === 'zoomclass' || event?.content_type === 'offlineclass' || event?.content_type === 'liveclass'),
        ...calendarSessions
    ].filter(session => {
        const endTime = session.content_type === 'zoomclass'
            ? moment.unix(Number(session.end_date))
            : moment(session.end_date);
        return endTime.isAfter(moment());
    }).slice(0, 4);

    const isTotalLoading = isLoading || isCalendarLoading;

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
                            {startOfWeek.format('MMM DD')} -{' '}
                            {startOfWeek.clone().endOf('week').format('DD MMM')}
                        </div>

                        <button
                            className="text-xl font-bold text-gray-700 dark:text-gray-200 hover:opacity-70"
                            onClick={handleNextWeek}
                        >
                            <FaAngleRight />
                        </button>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 my-4">
                        {days.map((day) => {
                            const isToday = day.isSame(moment(), 'day');
                            const isSelected = showEvents && showEvents.isSame(day, 'day');

                            return (
                                <div key={day.format('YYYY-MM-DD')} className="flex items-center justify-center">
                                    <div
                                        onClick={() => setShowEvents(day)}
                                        className={`flex flex-col items-center justify-center text-[10px] sm:text-xs md:text-sm rounded-lg cursor-pointer py-1.5 px-1.5 sm:px-2 w-fit min-w-[28px] sm:min-w-[40px] transition-all duration-200
                                            ${isSelected
                                                ? 'bg-primary text-white dark:bg-primary dark:text-black shadow-sm'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }
                                            ${isToday && !isSelected ? 'text-primary font-semibold' : ''}
                                            hover:bg-gray-200 dark:hover:bg-gray-700
                                        `}
                                    >
                                        <div className="font-medium mb-1">{day.format('ddd')}</div>
                                        <div className="font-semibold">{day.format('DD')}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sessions Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                        {/* Loading */}
                        {isTotalLoading && events.length === 0 && (
                            <LoadingSection
                                title="Activities"
                                description="Please wait..."
                                isLoading={isTotalLoading}
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
                                    Sessions on {showEvents?.format('MMM DD YYYY')}
                                </h4>

                                {sessions.map((event: any) => {
                                    const isZoom = event.content_type === 'zoomclass';
                                    const joinLink = event.link;
                                    const startDate = isZoom
                                        ? moment.unix(Number(event.from_date))
                                        : moment(event.start_date);
                                    const endDate = isZoom
                                        ? moment.unix(Number(event.end_date))
                                        : moment(event.end_date);
                                    const diffInMinutes = startDate.diff(moment(), 'minutes');
                                    const isJoinEnabled = diffInMinutes <= 5;

                                    return (
                                        <div
                                            key={event.id}
                                            className="block p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:shadow-md transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {event.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                        {startDate.format('h:mm A')} – {endDate.format('h:mm A')}
                                                    </div>
                                                </div>
                                                {joinLink || event.mentor_calendar_id ? (
                                                    <button
                                                        disabled={!isJoinEnabled || joiningId === event.id}
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            if (!isJoinEnabled || joiningId === event.id) return;
                                                            setJoiningId(event.id);
                                                            try {
                                                                let navigateId = event.id;
                                                                if (!joinLink && event.mentor_calendar_id) {
                                                                    await ApiService.fetchDataWithAxios({
                                                                        url: `/create-calendar-zoom/${event.mentor_calendar_id}`,
                                                                        method: 'post',
                                                                        data: { calender_id: event.mentor_calendar_id }
                                                                    });
                                                                    await fetchMentorLcLoad(String(event.mentor_calendar_id));
                                                                    navigateId = event.mentor_calendar_id;
                                                                }
                                                                navigate(`/zoom/meeting/${navigateId}?is_mentoring=1`);
                                                            } catch (error) {
                                                                console.error("Error creating zoom meeting or lc load:", error);
                                                                toast.error("Failed to prepare session");
                                                            } finally {
                                                                setJoiningId(null);
                                                            }
                                                        }}
                                                        className={`flex items-center justify-center text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm ${isJoinEnabled
                                                            ? 'bg-primary hover:opacity-90 active:scale-95'
                                                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        {joiningId === event.id ? <Loader className="w-3 h-3 animate-spin" /> : "Join"}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to="/my-classes"
                                                        className="text-primary text-xs font-semibold underline"
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {/* Empty State */}
                        {sessions.length === 0 && !isTotalLoading && !isError && (
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

export default LearnerWeeklyCalendar;