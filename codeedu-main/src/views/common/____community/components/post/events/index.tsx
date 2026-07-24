import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/ShadcnButton'
import EventCard from '@/views/common/community/components/EventCard'
import { Link } from 'react-router-dom';
import { useEvents } from '../../../@hooks/usePost';

const Events = () => {

    const { data:events = [], isLoading:loading, error } = useEvents();
    if(loading){
        return <Loading loading={loading} />
    }

    if(error && !events?.length) {
        return null;
    }


    // filter all events according running and upcoming events only
    if (!events || events.length === 0) {
        return <div className="text-center text-gray-500">No events available</div>;
    }

    const currentDate = new Date();
    const filteredEvents = events.filter(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        return startDate >= currentDate || endDate >= currentDate;
    });

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-cblack mr-2">Event &</h2>
                <h2 className="text-2xl font-bold text-cblue">Design Jams</h2>
            </div>
            <div className="space-y-4">
                {
                    filteredEvents && filteredEvents?.slice(0,3)?.map((event, index) => (
                        <Link key={event.id} to={`/event-activity/${event.id}`}>
                        <EventCard
                            key={event.id}
                            logo={event.image}
                            title={event.name}
                            company={event.organization_name || 'Unknown'}
                            date={event.start_date}
                            isLast={index === events.length - 1}
                        />
                    </Link>
                    ))
                }
                <div className="text-right">
                    <Button variant="link" className="text-blue-500 p-0 h-auto !rounded-button whitespace-nowrap">
                        <Link to="/events">View All</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Events