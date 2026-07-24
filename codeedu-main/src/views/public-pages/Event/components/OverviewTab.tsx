import React from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { EventDetails } from '@/@types/collaborate/events'

dayjs.extend(advancedFormat)

interface OverviewTabProps {
    details: EventDetails['competitions_details']
}

const OverviewTab: React.FC<OverviewTabProps> = ({ details }) => {
    const { program } = details
    const { event_details, user_registered_count } = program

    // Format Date & Time
    const targetDateForTime = program.contents?.[0]?.start_date || program.start_date;
    const formattedDate = program.start_date ? dayjs(program.start_date).format('dddd, MMMM D, YYYY') : 'TBA'
    const formattedTime = targetDateForTime ? dayjs(targetDateForTime).format('hh:mm A') : 'TBA'

    // Calculate attendee text
    const attendeesText = `${user_registered_count || 0} registered`

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - About Event */}
            <div className="lg:col-span-2 bg-[#222222] rounded-2xl p-6 md:p-8 shadow-sm border border-white/5">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">About Event</h2>
                
                <div 
                    className="prose prose-invert prose-cyan max-w-none 
                               prose-p:text-gray-300 prose-p:leading-relaxed 
                               prose-headings:text-white prose-headings:font-semibold
                               prose-a:text-cyan-400 hover:prose-a:text-cyan-300
                               prose-li:text-gray-300 prose-ul:list-disc
                               prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: program.description || 'No description available.' }}
                />
            </div>

            {/* Right Column - Event Detail Card */}
            <div className="lg:col-span-1">
                <div className="bg-[#222222] rounded-2xl p-6 md:p-8 shadow-sm border border-white/5 sticky top-[120px]">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Event Detail</h2>
                    
                    <div className="space-y-6">
                        {/* Date */}
                        <div className="flex items-start gap-4">
                            <div className="bg-cyan-500/20 p-3 rounded-xl shrink-0">
                                <CalendarIcon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Date</p>
                                <p className="text-gray-400 text-sm">{formattedDate}</p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-start gap-4">
                            <div className="bg-pink-500/20 p-3 rounded-xl shrink-0">
                                <ClockIcon className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Time</p>
                                <p className="text-gray-400 text-sm">{formattedTime}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-500/20 p-3 rounded-xl shrink-0">
                                <MapPinIcon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Location</p>
                                <p className="text-gray-400 text-sm">{event_details?.venue || 'Online'}</p>
                            </div>
                        </div>

                        {/* Attendees */}
                        <div className="flex items-start gap-4">
                            <div className="bg-green-500/20 p-3 rounded-xl shrink-0">
                                <UsersIcon className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Attendees</p>
                                <p className="text-gray-400 text-sm">{attendeesText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverviewTab
