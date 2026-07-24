import Loading from '@/components/shared/Loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CommunityLayout from '@/views/common/community/layouts'
import { useEventStore } from '@/views/common/community/store/communityStore';
import { CalendarClock, MapPin, SlidersHorizontal } from 'lucide-react'
import { lazy, useEffect } from 'react';
import Pined from '../pined';
import { formatApiDate } from '@/views/common/community/utils/dateFormat';
import { Badge } from '@/components/ui/badge';
import WeeklyCalendar from '@/views/learner/dashboard/components/Calendar';
import Cat from '../cat';

const OpinionPoll = lazy(() => import('../../../pages/wall/poll/index'));

const ViewAllEvents = () => {

    const { events, fetchEvents, loading, error } = useEventStore();

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (loading) {
        return <Loading loading={loading} />
    }

    if (error && !events?.length) {
        return null;
    }

    return (
        <CommunityLayout>
            <div className="w-full flex flex-col md:flex-row py-6 gap-5">
                <div className="w-full md:w-[70%]">
                    <div className='flex justify-between items-center mb-3'>
                        <div className="flex items-center">
                            <h2 className="text-lg font-semibold text-cblack mr-2">Event &</h2>
                            <h2 className="text-2xl font-bold text-cgreen">Design Jams</h2>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='flex justify-center gap-2 border px-3 py-1 rounded-lg '><SlidersHorizontal size={20} strokeWidth={1.5} className='text-cblack' /> Filter</DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40' side='left' align='start'>
                                <DropdownMenuItem>All</DropdownMenuItem>
                                <DropdownMenuItem>Events</DropdownMenuItem>
                                <DropdownMenuItem>Industries</DropdownMenuItem>
                                <DropdownMenuItem>Workshops</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                events && events.map((event) => (
                                    <div key={event.id} className="mb-4">
                                        <Card className='p-0'>
                                            <CardHeader className='p-0'>
                                                <img src={event.image} alt={event.name} className="w-full h-48 object-cover rounded-t-lg" />
                                            </CardHeader>
                                            <CardContent className='p-3 min-h-48'>
                                                <h3 className="text-base font-semibold line-clamp-2">{event.name}</h3>
                                                <p className="text-sm text-gray-500">{event?.organized_by || 'Unknown'}</p>
                                                <div className='flex items-center gap-1 text-cblack mt-2 text-nowrap'>
                                                    <CalendarClock size={20} strokeWidth={1.5} className='text-cblack' />
                                                    <span>
                                                        {event?.start_date && <span>{formatApiDate(event.start_date, "created_at", {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}</span>}
                                                    </span>
                                                    <span className="mx-1">-</span>
                                                    <span>{event?.end_date && <span>{formatApiDate(event.end_date, "created_at", {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}</span>}</span>
                                                    <span className="mx-1">|</span>
                                                    <span>{event?.start_date && <span>{new Date(event?.start_date).toLocaleString(
                                                        'en-IN',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}</span>}</span>
                                                    <span className="mx-1">-</span>
                                                    <span>{event?.end_date && <span>{new Date(event?.end_date).toLocaleString(
                                                        'en-IN',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}</span>}</span>
                                                </div>
                                                <div className='flex items-center gap-1 text-cblack mt-2'>
                                                    <MapPin strokeWidth={1.5} size={20} className='text-cblack' />
                                                    <span className="text-sm">{event?.location || 'Online'}</span>
                                                </div>
                                                <div>
                                                    {/* <span className="text-sm">{event?.com_status?.program_status}</span> */}
                                                    <Badge className={`mt-2 ${event?.com_status?.program_status === 'Upcoming' ? 'bg-cgreen text-orange-500' : event?.com_status?.program_status === 'Ongoing' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {event?.com_status?.program_status}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[30%]">
                    <div className='sticky top-0 space-y-5'>
                        <WeeklyCalendar />
                        <OpinionPoll />
                        <Pined />
                        {/* <Cat /> */}
                    </div>
                </div>
            </div>
        </CommunityLayout>
    )
}

export default ViewAllEvents