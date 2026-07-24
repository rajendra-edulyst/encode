import React from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '@/hooks/data/collaborate/useEvents'
import { EventDetails } from '@/@types/collaborate/events'
import { formatedApiDate } from '@/utils/dateFormat'

interface OtherEventsProps {
    currentEventId: string
    categoryId?: string
    categoryName?: string
}

const OtherEvents: React.FC<OtherEventsProps> = ({ currentEventId, categoryId, categoryName }) => {
    // Fetch other events using the category ID if available
    const params = new URLSearchParams()
    if (categoryId) {
        params.append('event_category_id', categoryId)
    }
    params.append('type', 'event')

    const { data: events, isLoading } = useEvents(params)

    if (isLoading) {
        return <div className="mt-16 text-center text-gray-400 animate-pulse">Loading other events...</div>
    }

    // Filter out the current event and get a max of 3 for the related section
    const otherEvents = (events || [])
        .filter(event => String(event.id) !== String(currentEventId))
        .slice(0, 3)

    if (otherEvents.length === 0) return null

    return (
        <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Other Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherEvents.map(event => (
                    <Link 
                        key={event.id}
                        to={`/event/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${event.id}${categoryName ? `?category=${categoryName}` : ''}`}
                        className="group flex flex-col bg-[#222222] rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        {/* Card Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-[#1a1a1a]">
                            <img 
                                src={event.image || '/img/default.png'} 
                                alt={event.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {categoryName && (
                                <div className="absolute top-4 right-4 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    {categoryName}
                                </div>
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                {event.name}
                            </h3>
                            
                            <div className="mt-auto pt-4 space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    <span>{event.vanue || 'Online'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                                    <span>
                                        {event.start_date ? formatedApiDate(event.start_date) : 'TBA'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default OtherEvents
