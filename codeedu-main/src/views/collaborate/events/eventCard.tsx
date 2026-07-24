import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { formatedApiDate } from '@/utils/dateFormat'
import { stripHtmlTags } from '@/utils/stripHtmlTags'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

interface EventCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any
    categoryName: string
    isPast: boolean
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    categoryName,

}) => {
    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Masterclass':
                return 'bg-codeblue text-white'
            case 'Workshops':
                return 'bg-codepink text-white'
            case 'Industry Visits':
                return 'bg-codegreen text-white'
            case 'Competitions':
                return 'bg-codeyellow text-white'
            default:
                return 'bg-[#7FBC42] text-[#323232]'
        }
    }
    const isPastEvent = (endDate: string) => {
        const today = new Date();
        const eventEndDate = new Date(endDate);
        return eventEndDate < today;
    }
    const handleEventClick = () => {
    mixpanelService.track('Event Viewed', {
        entity_id: event.id,
        entity_name: event.name,
        category: categoryName,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
    });
};

    return (
        <Card className="hover:shadow-md bg-[#323232] transition-shadow duration-300 rounded-lg overflow-hidden py-0 h-full">
            {/* Banner */}
            <CardHeader className="p-0 relative">
                <div
                    className="h-48 bg-cover bg-center w-full"
                    style={{
                        backgroundImage: `url(${event.image || '/img/default.png'})`,
                    }}
                >
                    <div className="absolute top-0 -right-1">
                        <span
                            className={`px-3 py-1 ${getBadgeColor(
                                categoryName
                            )} text-sm font-medium rounded-md`}
                        >
                            {categoryName}
                        </span>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-4 flex flex-col h-full">
                <h4 className="text-xl font-bold text-white mb-2 leading-tight line-clamp-2">
                    {event.name}
                </h4>

                <p className="text-white text-sm mb-3 line-clamp-3">
                    {stripHtmlTags(event.description)}
                </p>

                <div className="text-white text-xs mb-4 space-y-1">
                    <p>Mode: {event.vanue ?? 'Online'}</p>
                    <p>
                        Date: {formatedApiDate(event.start_date)} –{' '}
                        {formatedApiDate(event.end_date)}
                    </p>
                </div>


                <div className="flex justify-end pt-2 gap-2">
                    <Link to={`/collaborate/events/${event.id}`}
                     onClick={handleEventClick}>
                        {isPastEvent(event.end_date) ? (
                            <div className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-8 py-6 rounded-lg text-base shadow-lg transition-all">
                                View Details
                            </div>
                        ) : (
                            <div className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-8 py-6 rounded-lg text-base shadow-lg transition-all">
                                Register
                            </div>
                        )}
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventCard
