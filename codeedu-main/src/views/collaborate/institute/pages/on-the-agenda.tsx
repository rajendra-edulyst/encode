import React from 'react'
import { TrendingUp, TrendingDown, SquarePen, List, Plus, User } from 'lucide-react'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Link, useNavigate } from 'react-router-dom'
import { useEvents } from '@/hooks/data/collaborate/useEvents'
import { useSessionUser } from '@/store/authStore'
import { useInstituteAgendaStats } from '@/hooks/data/collaborate/useJobs'
import { BsPersonVcard } from "react-icons/bs";

interface MetricCardProps {
    title: string
    value: string | number
    change?: number
    trend?: 'up' | 'down'
}

interface OnTheAgendaProps {
    filter?: string
}

const OnTheAgenda: React.FC<OnTheAgendaProps> = ({ filter }) => {

    const navigate = useNavigate();

    const user = useSessionUser((state) => state.user);
    const userOrgId = user?.organization_id;

    const { data: agendaStats = [] } = useInstituteAgendaStats(filter || 'yearly');

    const params = React.useMemo(() => {
        const p = new URLSearchParams()
        if (userOrgId) {
            p.append('organization_id', userOrgId.toString())
        }

        const categoryIds = agendaStats.map(stat => stat.event_cat_id).filter(id => id).join(',')
        if (categoryIds) {
            p.append('event_category_id', categoryIds)
        }

        return p
    }, [userOrgId, agendaStats]);

    // Sample data for events
    const { data: events = [] } = useEvents(params);

    const getStatValue = (name: string) => {
        return agendaStats?.find(item => item.name.toLowerCase().includes(name.toLowerCase()))?.count || 0;
    }

    const eventCards = [
        {
            title: 'Masterclass',
            icon: <BsPersonVcard className='text-white' />,
            listingLabel: 'Events Listing',
            addLabel: 'Add Masterclass',
            listingRoute: '/collaborate/events?category=Masterclass',
            createRoute: '/collaborate/events/create?category=Masterclass',
        },
        {
            title: 'Workshop',
            icon: <User className='text-white' />,
            listingLabel: 'Workshop Listing',
            addLabel: 'Add Workshop',
            listingRoute: '/collaborate/events?category=Workshop',
            createRoute: '/collaborate/events/create?category=Workshop',
        },
        {
            title: 'Industry Visit',
            icon: <User className='text-white' />,
            listingLabel: 'Industry Listing',
            addLabel: 'Add Visit',
            listingRoute: '/collaborate/events?category=Industry Visit',
            createRoute: '/collaborate/events/create?category=Industry Visit',
        },
        {
            title: 'Competitions',
            icon: <User className='text-white' />,
            listingLabel: 'Competitions Listing',
            addLabel: 'Add Competition',
            listingRoute: '/collaborate/events?category=Competitions',
            createRoute: '/collaborate/events/create?category=Competitions',
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    title="Master Class"
                    value={getStatValue('Masterclass')}
                />
                <MetricCard
                    title="Workshop"
                    value={getStatValue('Workshop')}
                />
                <MetricCard
                    title="Industry Visit"
                    value={getStatValue('Industry Visits')}
                />
                <MetricCard
                    title="Competitions"
                    value={getStatValue('Competitions')}
                />
            </div>
            {/* Scheduled Events Section */}
            <div className="relative">
                {(events && events.length !== 0) && <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-white text-2xl'>Scheduled Events</CardTitle>
                            <CardAction>
                                <Link to="/collaborate/agenda" className="text-sm text-primary hover:underline">
                                    View All
                                </Link>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="overflow-hidden px-0">
                            <div className="relative px-6">
                                <Carousel className="w-full">
                                    <CarouselContent className="pb-5 md:pb-0">
                                        {events && events?.map(item => (
                                            <CarouselItem key={item.type} className="md:basis-1/2 h-96 lg:basis-1/2 2xl:basis-1/2 pb-4 bg-center bg-cover overflow-hidden relative cursor-pointer" onClick={() => navigate('/collaborate/agenda')}>
                                                <div className='h-full w-full bg-gray-800/40 hover:bg-gray-800/25 transition flex flex-col justify-end p-4 rounded-[20px] bg-cover bg-center bg-no-repeat flex justify-end items-end bg-white' style={{ backgroundImage: `url('${item.image}')` }}>
                                                    <div className='bg-primary w-[64px] h-[64px] rounded-lg flex flex-col items-center justify-center text-center p-3 cursor-pointer mb-2' onClick={() => navigate(`/collaborate/events/${item.id}/edit`)}>
                                                        <div>
                                                            <SquarePen className='text-black' size={13} />
                                                        </div>
                                                        <p className='text-black text-[10px] mt-1'>Update Event</p>
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="absolute left-2 z-10 text-primary" />
                                    <CarouselNext className="absolute right-2 z-10 text-primary" />
                                </Carousel>
                            </div>
                        </CardContent>
                    </Card>
                </div>}
                <Card>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
                            {eventCards.map((card, index) => (
                                <Card key={index} className='bg-[#323232] p-2 flex flex-col h-full'>
                                    <CardContent className='p-2 flex-1 pb-0'>
                                        <div className='bg-[#5A5A5A] w-10 h-10 rounded-lg flex items-center justify-center'>
                                            {card.icon}
                                        </div>
                                        <h3 className='text-white text-sm text-nowrap mt-2'>{card.title}</h3>
                                    </CardContent>
                                    <CardFooter className='flex justify-center gap-5 px-0'>
                                        <div
                                            className='h-[64px] w-full bg-gray-600 text-center p-3 text-center rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer'
                                            onClick={() => navigate(card.listingRoute)}
                                        >
                                            <div>
                                                <List className='text-white' size={16} />
                                            </div>
                                            <p className='text-white text-[10px]'>{card.listingLabel}</p>
                                        </div>
                                        <div
                                            className='h-[64px] w-full bg-primary text-center p-3 text-center rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer'
                                            onClick={() => navigate(card.createRoute)}
                                        >
                                            <div>
                                                <Plus className='text-black' size={16} />
                                            </div>
                                            <p className='text-black text-[10px]'>{card.addLabel}</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => {
    return (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">{title}</div>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">{value}</div>
                {/* <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{change > 0 ? '+' : ''}{change}%</span>
                    {trend === 'up' ? <TrendingUp className="ml-1 w-4 h-4" /> : <TrendingDown className="ml-1 w-4 h-4" />}
                </div> */}
            </div>
        </div>
    )
}


export default OnTheAgenda