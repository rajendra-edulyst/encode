import Breadcrumb from '@/components/breadcrumb';
import EventListing from './EventListing';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
function Events() {

    const breadcrumbItems = [
        { label: 'Events' },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <div className='flex items-center justify-between'>
                 <div className="flex items-center mb-3 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Events</h1>
                        <p className="text-sm text-gray-400">Check out All Events</p>
                    </div>     
                </div>

                <Link to="/manage-events/create"  >
                <Button className="bg-white text-gray-700 cursor-pointer border hover:bg-gray-100" variant="default" size="sm">
                    Create New Event
                </Button>

                </Link>
            </div>
            
            <EventListing></EventListing>

        </div>
    );
}

export default Events