import LoadingSection from '@/components/LoadingSection';
import { useEvents } from '@/hooks/data/collaborate/useEvents';
import { formatedApiDate } from '@/utils/dateFormat';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { MapPin, Calendar } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/ShadcnButton';
import { Card, CardContent } from '@/components/ui/card';

const ImmersionIndustries = () => {
    const params = new URLSearchParams();
    params.append("event_category_id", "9");

    const { data: events, isLoading, isError } = useEvents(params);

    return (
        <Card>
            <CardContent className='pt-4'>
                {/* Header with two-color design */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold line-clamp-1 dark:text-white">
                        <span className="text-white font-bold text-xl">Immersion</span>
                        <span className="text-primary font-bold text-xl"> Industries</span>
                    </h2>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {events?.slice(0, 3).map((event, index) => (
                        <EventCard
                            key={event.id}
                            icon={event?.image || `https://ui-avatars.com/api/?name=${event.name || 'Immersion Program'}&background=44BBA4&color=ffffff`}
                            title={event.name || 'Immersion Program'}
                            organization={stripHtmlTags(event.description || 'No description available')}
                            date={event.start_date}
                            venue={event.vanue || 'Online'}
                            isLast={index === events.length - 1}
                            id={event.id}
                        />
                    ))}

                    {/* Empty State */}
                    {events && events?.length === 0 && !isLoading && !isError && (
                        <div className="text-gray-500 text-center py-4">No immersion programs found</div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="mt-4">
                        <LoadingSection
                            title='Loading immersion programs...'
                            isLoading={isLoading}
                            description='Please wait while we fetch the latest industry immersion programs.'
                        />
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center text-red-500 py-4">
                        Failed to load immersion programs. Please try again later.
                    </div>
                )}

                {/* See All Button */}
                {/* {events && events.length > 0 && (
                    <div className="text-right mt-4">
                       <Link to={`/collaborate/agenda?category=${'ImmersionPrograms'}`}>
                        <Button
                            variant="link"
                            className="text-[#44BBA4] p-0 h-auto !rounded-button whitespace-nowrap"
                        >
                            See All
                        </Button></Link>
                    </div>
                )} */}
            </CardContent>
        </Card>
    )
}

interface EventCardProps {
    icon: string;
    title: string;
    organization: string;
    date: string | number | Date | null;
    venue: string;
    isLast?: boolean;
    id?: number;
}

const EventCard: React.FC<EventCardProps> = ({
    icon, title, organization, date, venue, isLast = false, id
}) => {
    return (
        <div className={`grid grid-cols-5 gap-3 mb-3 last:mb-0 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
            <Link to={`/event-activity/${id}`} className="col-span-4">
                <div className="flex flex-row gap-2 mb-1">
                    <img src={icon} alt={title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-cblack dark:text-white mb-[2px] line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-xs text-cblack dark:text-gray-300 line-clamp-1 mb-1">
                            {organization}
                        </p>
                        <div className="flex items-center text-xs text-cblack dark:text-gray-400 mb-1">
                            <MapPin strokeWidth={1.5} size={14} className="mr-1" />
                            <span className="line-clamp-1">{venue}</span>
                        </div>
                        <div className="flex items-center text-xs text-cblack dark:text-gray-400">
                            <Calendar strokeWidth={1.5} size={14} className="mr-1" />
                            <span>{date && formatedApiDate(date.toString())}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <div className='flex justify-end col-span-1'>
                {/* Optional: You can add an icon here similar to the Pin icon */}
                {/* <MapPin size={20} strokeWidth={1.5} className="text-[#44BBA4]" /> */}
            </div>
        </div>
    );
};

export default ImmersionIndustries;