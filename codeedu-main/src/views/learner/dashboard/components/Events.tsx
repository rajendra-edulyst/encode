import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import React, { useEffect } from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { fetchEvent } from '@/services/learner/EventService';
import { useEventStore } from '@/store/learner/EventStore';


const Event: React.FC = () => {

    const { events, setEvents, loading, setLoading, error, setError } = useEventStore();

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchEvent().then((eventData) => { setEvents(eventData) }).catch((error) => {
            setError('Failed to fetch events');
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [setEvents, setLoading, setError]);



    if (loading) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Alert title={error} type="danger" />;
    }



    return (
        <div className="grid grid-cols-1 gap-4 mt-4 bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Events / Design Jams</h3>
                <Link to="/events" className="text-primary text-sm">View All</Link>
            </div>
            {events && events?.map((event) => (
                <Link key={event.id} to={`/event-activity/${event?.id}`} className="flex bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-100 w-20"
                    >
                        <img src={event?.image} alt={event?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                        <h6 className="font-bold mb-1 text-sm">{event?.name}</h6>
                        <div className="flex items-center text-gray-600 text-sm">
                            <BsCalendarDate className="fas fa-calendar-alt w-5" />
                            <span className="ml-2">{
                                new Date(event?.start_date).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }</span>
                        </div>
                    </div>
                </Link>
            ))}
            {events.length === 0 && <div className="flex items-center justify-center text-gray-500">No events available</div>}
        </div>
    );
};
export default Event;
