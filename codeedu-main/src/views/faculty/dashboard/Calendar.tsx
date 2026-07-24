import React, { useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import LoadingSection from '@/components/LoadingSection';
import { useEvents } from '@/hooks/data/collaborate/useEvents';

const WeeklyCalendar = () => {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [showEvents, setShowEvents] = useState<Moment | null>(moment());

    const startOfWeek = currentWeek.clone().startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => moment(startOfWeek).add(i, 'days'));

    const handlePrevWeek = () => setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
    const handleNextWeek = () => setCurrentWeek(currentWeek.clone().add(1, 'week'));

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

    const sessions = events.filter(event => event?.content_type === 'zoomclass' || event?.content_type === 'offlineclass' || event?.content_type === 'liveclass');

    return (
        <div className="grid grid-cols-1 gap-4 bg-white dark:bg-card p-3 rounded-lg border">
            <div className="flex items-center justify-between">
                <h3 className="text-lg"> <span className='text-cpink'>My</span> Planner</h3>
            </div>
            <div className="flex justify-between items-center">
                <button className="text-xl font-bold" onClick={handlePrevWeek}><FaAngleLeft /></button>
                <div className="text-sm">
                    {startOfWeek.format('MMM DD')} - {startOfWeek.clone().endOf('week').format('DD MMM')}
                </div>
                <button className="text-xl font-bold" onClick={handleNextWeek}><FaAngleRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                    <div key={day.format('YYYY-MM-DD')} className={`text-center text-xs rounded-lg cursor-pointer
                        ${day.isSame(moment(), 'day') ? 'text-primary' : ''}
                        ${showEvents && showEvents.isSame(day, 'day') ? 'text-yellow-600' : ''}`}
                        onClick={() => setShowEvents(day)}>
                        <div className="font-bold">{day.format('ddd')}</div>
                        <div>{day.format('DD')}</div>
                    </div>
                ))}
            </div>
            {sessions && sessions.length > 0 && (
                <div className='border-t py-2'>
                    <h4 className='font-semibold my-2'>Sessions on {showEvents?.format('MMM DD YYYY')}</h4>
                    <div>
                        {sessions && sessions?.map((event) => (
                            <Link key={event?.id} to={`/my-classes`} className="block p-2 my-2 bg-gray-100 rounded-lg">
                                <div className="font-semibold">{event?.name}</div>
                                {event?.content_type === 'zoomclass' ? (
                                    <div className="text-xs text-gray-700">
                                        {moment.unix(Number(event?.from_date)).format('D MMM YYYY')} - {moment.unix(Number(event?.end_date)).format('D MMM YYYY')}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-700">
                                        {moment(event?.start_date).format('D MMM YYYY')} - {moment(event?.end_date).format('D MMM YYYY')}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                    {
                        (isError && events?.length == 0) && <p>Something went wrong, try again later</p>
                    }
                </div>
            )}
            {
                (isLoading && events?.length == 0) && <LoadingSection title='Sessions' description={`please wait we are fetching your sessions on date ${showEvents?.format('MMM DD YYYY')}`} isLoading={isLoading} />
            }
            {
                sessions && sessions?.length == 0 && !isLoading && !isError && <div className='border-t py-2'>
                    <h6>No Sessions found</h6>
                    <p className='text-gray-500'>On {showEvents?.format('MMM DD YYYY')} No Sessions found</p>
                </div>
            }
        </div>
    );
};

export default WeeklyCalendar;