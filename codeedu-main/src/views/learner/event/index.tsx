import { useEffect } from 'react';
import { useEventStore } from '@/store/learner/EventStore';
import { fetchEvent } from '@/services/learner/EventService';
import { Link } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

export default function EventListing() {
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-start text-primary dark:text-primary">My Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events?.length > 0 &&
                    events?.map((eventItem, index) => (
                        <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer
              ${new Date(eventItem.end_date) < new Date() ? '' : 'border border-primary dark:border-primary'}
              `}>
                            <Link to={`/event-activity/${eventItem.id}`} >
                                <div className="relative">
                                    <img src={eventItem.image} alt="event" className="h-48 w-full object-cover" />
                                </div>
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
                                    <div className="flex flex-col">
                                        <h6 className={`font-bold text-sm ${new Date(eventItem.end_date) < new Date() ? 'text-gray-800 dark:text-white' : 'text-primary dark:text-darkPrimary'}`}> {eventItem.name}</h6>
                                        <div className="flex items-center justify-start">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{eventItem.start_date?.split(' ')[0]} - </span>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{eventItem.end_date?.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4"
                                            dangerouslySetInnerHTML={{ __html: eventItem.description }}>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
            {
                events?.length === 0 && <div className="text-center text-gray-600 dark:text-gray-400 p-3 rounded border bg-white text-lg">No events available</div>
            }
        </div>
    );
}