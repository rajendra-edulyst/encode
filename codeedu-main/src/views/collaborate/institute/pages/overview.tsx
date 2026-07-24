import React from 'react'
import { TrendingUp, TrendingDown, SquarePen } from 'lucide-react'
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Link, useNavigate } from 'react-router-dom'
import { useEvents } from '@/hooks/data/collaborate/useEvents'
import { useInstituteOverview, useJobOpportunityDashboardStats } from '@/hooks/data/collaborate/useJobs'
import { LicensesChart } from './licenseCard'
import CoursesPerDepartment from './CoursesPerDepartment'


/* ---------------- Metric Card ---------------- */

interface MetricCardProps {
    title: string
    value: string | number


}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,

}) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">{title}</div>

        <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{value}</div>


        </div>
    </div>
)

/* ---------------- Overview ---------------- */

interface OverviewProps {
    filter?: string
}

const Overview: React.FC<OverviewProps> = ({ filter = 'yearly' }) => {
    const navigate = useNavigate()

    const { data: jobStats } = useInstituteOverview(filter)
    const { data: events = [] } = useEvents()

    return (
        <div className="min-h-screen bg-black text-white">
            {/* ---------------- Metrics ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard title="Jobs Posted" value={jobStats?.jobs_posted ?? 0} />
                <MetricCard title="Applicants Received" value={jobStats?.applications_received ?? 0} />
                {/* <MetricCard title="Placements %" value={0}  /> */}
                <MetricCard title="Masterclasses" value={jobStats?.masterclasses ?? 0} />
                <MetricCard title="Total Participants" value={jobStats?.total_participants ?? 0} />
                {/* <MetricCard title="Mentor Slots Booked" value={jobStats?.mentor_slots_booked ?? 0}  />
                <MetricCard title="Opinion Polls Conducted" value={jobStats?.opinion_polls_conducted ?? 0}  /> */}
            </div>

            {/* ---------------- Charts ---------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Licenses Chart */}
                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">

                    <LicensesChart filter={filter} />
                </div>

                {/* Courses Bar Chart */}
                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">

                    <CoursesPerDepartment filter={filter} />
                </div>
            </div>

            {/* ---------------- Events ---------------- */}
            {events.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Scheduled Events</CardTitle>
                        <CardAction>
                            <Link to="/collaborate/agenda" className="text-sm text-primary hover:underline">
                                View All
                            </Link>
                        </CardAction>
                    </CardHeader>

                    <CardContent className="overflow-hidden px-0">
                        <div className="relative px-6">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {events.map(event => (
                                        <CarouselItem
                                            key={event.id}
                                            className="md:basis-1/2 h-96 cursor-pointer"
                                            onClick={() => navigate('/collaborate/agenda')}
                                        >
                                            <div
                                                className="h-full w-full rounded-[20px] bg-cover bg-center flex flex-col justify-end p-4 bg-gray-800/40 hover:bg-gray-800/25 transition"
                                                style={{ backgroundImage: `url('${event.image}')` }}
                                            >
                                                <div
                                                    className="bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-2"
                                                    onClick={e => {
                                                        e.stopPropagation()
                                                        navigate(`/collaborate/events/${event.id}/edit`)
                                                    }}
                                                >
                                                    <SquarePen size={14} className="text-black" />
                                                    <p className="text-[10px] mt-1 text-black">Update Event</p>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious className="left-2 text-primary" />
                                <CarouselNext className="right-2 text-primary" />
                            </Carousel>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Overview
