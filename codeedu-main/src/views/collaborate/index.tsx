/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/ShadcnButton'
import PortfolioCard from './components/PortfolioCard';
import CreativeDirectory from './components/CreativeDirectory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, Loader } from 'lucide-react';
import AgendaCard from '@/components/AgendaCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { useEvents, useEventCategories, useEventApply, useAssignedEvents } from '@/hooks/data/collaborate/useEvents';
import { Link, useNavigate } from 'react-router-dom';
import { useInFocus } from '@/hooks/data/collaborate/useFocus';
import LoadingSection from '@/components/LoadingSection';
import WeeklyCalendar from '../connect/components/Calendar';
import ProfileCard from '@/components/ProfileCard';
import { ButtonGroup } from "@/components/ui/button-group"
import { FaWpforms, FaEye } from "react-icons/fa";
import Cat from '../common/components/cat';
import Advitisement from '../connect/components/advitisement';
import MustAttendEventCard from '@/components/MustAttendEventCard';
import MustAttendSection from "./components/MustAttendSection";
import MustWatchOut from './components/MustWatchOut';
import { toast } from 'sonner';
import { useEffect } from 'react';
import checkbookIcon from '@/assets/collaborate/checkbook.svg';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import { useSettings } from '@/hooks/data/useSettings';
import Announcement from '../faculty/dashboard/Announcement';
import { motion, AnimatePresence } from 'framer-motion';


const agendaStaticConfig: Record<number, any> = {
    4: { banner: '/img/others/image15.png' },
    3: { banner: '/img/others/image16.png' },
    5: { banner: '/img/others/Image14.png' },
    8: { banner: '/img/others/Image17.png' }
};

const mustAttendStaticConfig: Record<number, any> = {
    6: {
        icon: '/img/icons/handshake.png',
        banner: '/img/others/Image19.png',
        purpose: "Step into the vibe zone where ideas flow, minds connect, and collaborations come alive. Your next big spark might just start here."
    },
    7: {
        icon: '/img/icons/ticket.png',
        banner: '/img/others/Image20.png',
        purpose: "Design unleashed. Chaos celebrated. Magic created. Welcome to the grand stage of design madness."
    },
    2: {
        icon: '/img/icons/graduation-cap.png',
        banner: '/img/others/Image21.png',
        purpose: "Don't just dream design live it. Kickstart your hustle with real projects, real teams, and real impact. Your creative career begins here."
    },
    9: {
        icon: '/img/icons/streetview.png',
        banner: '/img/others/Image23.png',
        purpose: "Not just learning — living the experience. Dive deep, explore, and emerge transformed through immersive creation."
    }
};

const Collaborate = () => {
    const [inFocusActiveTab, setInFocusActiveTab] = React.useState('Portfolio');


    const trackedPageView = React.useRef(false);
    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track("Collaborate Page Viewed");
            trackedPageView.current = true;
        }
    }, []);


    const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
    const [now, setNow] = React.useState(Date.now());
    const navigate = useNavigate();

    React.useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const [registeredEventIds, setRegisteredEventIds] = React.useState<string[]>([]);
    const [registeringEventIds, setRegisteringEventIds] = React.useState<string[]>([]);
    const applyMutation = useEventApply();
    const { data: assignedEvents } = useAssignedEvents();

    useEffect(() => {
        if (assignedEvents) {
            setRegisteredEventIds(assignedEvents.map(e => String(e.id)));
        }
    }, [assignedEvents]);

    const handleRegister = (e: React.MouseEvent, eventId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (registeringEventIds.includes(eventId)) return;

        setRegisteringEventIds((prev) => [...prev, eventId]);
        applyMutation.mutate(
            { eventId },
            {
                onSuccess: () => {
                    mixpanelService.track("Event Registered", {
                        event_id: eventId,
                    });

                    toast.success("Successfully applied for the Event!");
                    setRegisteredEventIds((prev) => [...prev, eventId]);
                    setRegisteringEventIds((prev) => prev.filter((id) => id !== eventId));
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to apply for Event. Please try again.");
                    setRegisteringEventIds((prev) => prev.filter((id) => id !== eventId));
                },
            }
        );
    };


    const params = React.useMemo(() => {
        const p = new URLSearchParams();
        p.append('is_popular', '1');
        return p;
    }, []);

    const { data: events = [] } = useEvents(params);
    const { data: settings } = useSettings();
    const { data: inFocusData = [], isLoading: isLoadingInFocus } = useInFocus();
    const enableMustWatchout = settings?.configuration?.enable_must_watchout;

    const transformInFocusData = React.useCallback((data: any[]) => {
        return data.map((item: any) => {
            if (item?.profiles && item?.profiles.length > 0) {
                return item?.profiles.map((profile: any) => {
                    const orgType = profile?.org_type || item?.type;
                    const finalName = item?.display_name || profile?.name || item?.name || 'Unknown';

                    if (item?.type === 'profile' || item?.type === 'mentor') {
                        return {
                            type: 'profile',
                            id: profile?.id || item?.id,
                            name: profile?.name || item.display_name || item.name || 'Unknown',
                            designation: profile?.role || 'Creative Professional',
                            description: item.placeholder || profile?.description || item.description || 'No description available',
                            skills: profile?.skills?.map((skill: any) => skill.skill_name || skill.name) || [],
                            role: profile?.role || 'Designer',
                            profile_image: profile?.profile_image || 'https://ui-avatars.com/api/?name=User',
                            profile: profile,
                            profiles: item.profiles,
                            email: profile?.email,
                            org_type: profile?.org_type,
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    } else if (orgType === 'university' || orgType === 'institute') {
                        return {
                            type: orgType,
                            name: finalName,
                            about: profile?.org_description || item.placeholder || 'No description available',
                            banner: profile?.logo || item.file || '/img/placeholder-institute.png',
                            profile: profile,
                            profiles: item.profiles,
                            id: String(item.id),
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    } else if (orgType === 'industry') {
                        return {
                            type: 'industry',
                            name: finalName,
                            about: profile?.org_description || item.placeholder || 'No description available',
                            banner: profile?.logo || '/img/placeholder-industry.png',
                            profile: profile,
                            profiles: item.profiles,
                            id: String(item.id),
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    }
                    return null;
                }).filter((profileItem: any) => profileItem !== null);
            }

            const itemName = item.display_name || item.name;

            if (item.type === 'profile' || item.type === 'mentor') {
                return {
                    type: 'profile',
                    id: item?.id,
                    name: itemName || 'Unknown',
                    designation: 'Creative Professional',
                    description: item.placeholder || item.description || 'No description available',
                    skills: [],
                    role: 'Designer',
                    profile_image: 'https://ui-avatars.com/api/?name=User',
                    profile: null,
                    profiles: item.profiles || [],
                    reference_id: item.reference_id
                };
            } else if (item.type === 'industry') {
                return {
                    type: 'industry',
                    name: itemName || 'Unknown Industry',
                    about: item.placeholder || 'No description available',
                    banner: '/img/placeholder-industry.png',
                    profile: null,
                    profiles: item.profiles || [],
                    id: String(item.id),
                    display_name: item.display_name,
                    reference_id: item.reference_id
                };
            } else if (item.type === 'university' || item.type === 'institute') {
                return {
                    type: item.type,
                    name: itemName || (item.type === 'institute' ? 'Unknown Institute' : 'Unknown University'),
                    about: item.placeholder || 'No description available',
                    banner: item.file || '/img/placeholder-university.png',
                    profile: null,
                    profiles: item.profiles || [],
                    id: String(item.id),
                    display_name: item.display_name,
                    reference_id: item.reference_id
                };
            }

            return null;
        }).flat().filter(item => item !== null);
    }, []);

    const transformedData = React.useMemo(() => transformInFocusData(inFocusData).reverse(), [inFocusData, transformInFocusData]);

    const { data: categoryData = [] } = useEventCategories();

    const resolveBanner = React.useCallback((catOrEvent: any, config: Record<number, any>, defaultBanner: string) => {
        if (catOrEvent?.name?.toLowerCase() === 'competitions' || catOrEvent?.name?.toLowerCase() === 'competition') {
            return '/img/others/Image17.png';
        }
        const img = catOrEvent.image;
        if (img && typeof img === 'string' && !img.toLowerCase().includes('default.png') && img.trim() !== '' && img !== 'null') {
            return img;
        }
        const id = Number(catOrEvent.id || catOrEvent.event_category_id);
        return config[id]?.banner || defaultBanner;
    }, []);

    const agendaData = React.useMemo(() => categoryData
        .filter(cat => cat.group_name === 'On the Agenda')
        .map(cat => ({
            id: cat.id,
            type: cat.name,
            title: cat.name,
            description: cat.description,
            banner: resolveBanner(cat, agendaStaticConfig, '/img/others/image15.png'),
        })), [categoryData, resolveBanner]);

    const mustAttendData = React.useMemo(() => categoryData
        .filter(cat => cat.group_name === 'Must Attend')
        .map(cat => {
            const lower = cat.name?.toLowerCase() || '';
            let mappedName = cat.name;
            if (lower.includes('community meetup')) mappedName = 'Creators Meetup';
            if (lower.includes('flagship event')) mappedName = 'enCODE';

            return {
                id: cat.id,
                type: mappedName,
                title: mappedName,
                description: cat.description,
                icon: mustAttendStaticConfig[cat.id]?.icon || '/img/icons/handshake.png',
                banner: resolveBanner(cat, mustAttendStaticConfig, '/img/others/Image19.png'),
                purpose: mustAttendStaticConfig[cat.id]?.purpose || cat.description
            };
        }), [categoryData, resolveBanner]);

    const sortedEvents = React.useMemo(() => events
        ?.filter(event => !event.name?.toLowerCase().includes('feedback'))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3), [events]);

    React.useEffect(() => {
        if (!sortedEvents || sortedEvents.length === 0) return;
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % sortedEvents.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sortedEvents]);

    // Filter data based on active tab
    const filteredInFocusData = React.useMemo(() => {
        if (inFocusActiveTab === 'Portfolio') {
            return transformedData.filter((item) => item.type === 'profile').slice(0, 6);
        } else if (inFocusActiveTab === 'Industries') {
            return transformedData.filter((item) => item.type === 'industry').slice(0, 6);
        }
        else if (inFocusActiveTab === 'Institutes') {
            return transformedData.filter((item) => item.type === 'university' || item.type === 'institute').slice(0, 6);
        }
        return [];
    }, [inFocusActiveTab, transformedData]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
            <div className='col-span-1 lg:col-span-10'>
                <ProfileCard />
            </div>
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                {(sortedEvents && sortedEvents.length !== 0) && (
                    <Card className="border rounded-[20px] overflow-hidden p-0 relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentBannerIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = offset.x * velocity.x;
                                    if (swipe < -100) {
                                        setCurrentBannerIndex((prev) => (prev + 1) % sortedEvents.length);
                                    } else if (swipe > 100) {
                                        setCurrentBannerIndex((prev) => (prev - 1 + sortedEvents.length) % sortedEvents.length);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full bg-[#1D1D1D] group"
                            >
                                {(() => {
                                    const event = sortedEvents[currentBannerIndex];
                                    if (!event) return null;

                                    let targetCategory = event?.event_category_name || 'Career Drive';
                                    if (event?.event_group_name === 'Must Attend') {
                                        const lower = targetCategory.toLowerCase();
                                        if (lower.includes('community meetup')) targetCategory = 'Creators Meetup';
                                        if (lower.includes('flagship event')) targetCategory = 'enCODE';
                                    }

                                    const eventLink = (event?.event_group_name === 'Must Attend')
                                        ? `/must-attend/details/${event.id}?category=${targetCategory}`
                                        : `/agenda/details/${event.id}?category=${targetCategory}`;

                                    return (
                                        <>
                                            <div
                                                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                style={{
                                                    backgroundImage: `url('${resolveBanner(event, { ...agendaStaticConfig, ...mustAttendStaticConfig }, '/img/others/image15.png')}')`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            />
                                            <Link to={eventLink} className="relative block w-full h-full px-10 pointer-events-auto">
                                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center h-full w-full transition-opacity duration-700 group-hover:bg-black/20" />
                                                <div className="relative h-full flex w-full flex-col justify-center items-start text-white">

                                                    {/* Top: Badge (Left) & Location (Right) */}
                                                    <div className="absolute top-4 left-4 right-4 flex flex-row items-center justify-between">
                                                        {event?.event_group_name ? (
                                                            <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white px-3 py-1 border-none text-[10px] md:text-xs font-medium">
                                                                {event?.event_group_name}
                                                            </Badge>
                                                        ) : <div />}

                                                        <div className="flex items-center gap-1 text-white drop-shadow-lg">
                                                            <MapPin className="h-4 w-4" />
                                                            <span className="text-[10px] md:text-xs font-medium tracking-tight">
                                                                Location: <span className="font-bold">{event.vanue || 'Online'}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Right: Register Button */}
                                                    <div className="absolute bottom-8 right-0 z-10 pointer-events-auto">
                                                        {(() => {
                                                            const isRegistered = event?.is_assigned === 1 || registeredEventIds.includes(String(event.id));
                                                            const isRegistering = registeringEventIds.includes(String(event.id));

                                                            const parseTime = (str: string | undefined | null) => str ? (!isNaN(Number(str)) ? Number(str) * 1000 : new Date(str).getTime()) : 0;

                                                            const eventTimeMs = parseTime(event?.event_datetime || event?.start_date);

                                                            const times = [
                                                                parseTime(event?.event_datetime),
                                                                parseTime(event?.start_date),
                                                                parseTime(event?.end_date)
                                                            ].filter(t => !isNaN(t) && t > 0);

                                                            const lastTimeMs = times.length > 0 ? Math.max(...times) : eventTimeMs;
                                                            const lastDate = new Date(lastTimeMs);
                                                            lastDate.setHours(23, 59, 59, 999);
                                                            const eventEndMs = lastDate.getTime();

                                                            const diffStartMs = eventTimeMs - now;
                                                            const oneDayMs = 24 * 60 * 60 * 1000;

                                                            if (now > eventEndMs) {
                                                                return (
                                                                    <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[140px] h-[86px] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                                                                        <span className="text-sm font-bold text-center">Event Ended</span>
                                                                    </div>
                                                                );
                                                            }

                                                            if (isRegistered) {
                                                                if (diffStartMs <= 0 && now <= eventTimeMs + 60 * 60 * 1000) {
                                                                    return (
                                                                        <div className="bg-[#7FBC42] text-black w-[140px] h-[86px] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group">
                                                                            <span className="relative flex h-3 w-3">
                                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                                            </span>
                                                                            <span className="text-sm font-bold text-center">Live Now</span>
                                                                        </div>
                                                                    );
                                                                } else if (diffStartMs > 0 && diffStartMs <= oneDayMs) {
                                                                    const h = Math.floor(diffStartMs / (1000 * 60 * 60));
                                                                    const m = Math.floor((diffStartMs / (1000 * 60)) % 60);
                                                                    const s = Math.floor((diffStartMs / 1000) % 60);
                                                                    return (
                                                                        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] text-white w-[140px] h-[86px] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-1 cursor-pointer">
                                                                            <span className="text-[10px] text-[#7FBC42] font-bold uppercase tracking-wider">Live In</span>
                                                                            <div className="flex items-center gap-1 font-mono text-lg font-bold">
                                                                                <div className="flex flex-col items-center"><span className="leading-none">{String(h).padStart(2, '0')}</span><span className="text-[8px] text-gray-400 font-sans">HRS</span></div>
                                                                                <span className="text-gray-500 -mt-3">:</span>
                                                                                <div className="flex flex-col items-center"><span className="leading-none">{String(m).padStart(2, '0')}</span><span className="text-[8px] text-gray-400 font-sans">MIN</span></div>
                                                                                <span className="text-gray-500 -mt-3">:</span>
                                                                                <div className="flex flex-col items-center"><span className="leading-none text-[#7FBC42]">{String(s).padStart(2, '0')}</span><span className="text-[8px] text-[#7FBC42]/70 font-sans">SEC</span></div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[140px] h-[86px] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-2 opacity-70 cursor-pointer">
                                                                        <img src={checkbookIcon} alt="Registered" className="w-5 h-5 shrink-0" />
                                                                        <span className="text-sm font-bold text-center">Registered</span>
                                                                    </div>
                                                                );
                                                            }

                                                            if (isRegistering) {
                                                                return (
                                                                    <div className="bg-gray-400 text-gray-700 w-[140px] h-[86px] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-2 cursor-not-allowed" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                                                        <Loader className="animate-spin w-5 h-5" />
                                                                        <span className="text-sm font-bold">Registering</span>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    className="bg-[#7FBC42] hover:bg-[#6da538] text-black w-[140px] h-[86px] rounded-[10px] shadow-xl transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                                                                    onClick={(e) => handleRegister(e, String(event.id))}
                                                                >
                                                                    <FaWpforms className="text-sm font-bold" />
                                                                    <span className="text-sm font-bold">Register</span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </Link>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <button
                            className="absolute left-[1%] top-1/2 -translate-y-1/2 z-10 bg-[#D9D9D9] text-[#273454] rounded-full shadow w-10 h-10 flex items-center justify-center border-none hover:bg-gray-300"
                            onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + sortedEvents.length) % sortedEvents.length)}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="absolute right-[1%] top-1/2 -translate-y-1/2 z-10 bg-[#D9D9D9] text-[#273454] rounded-full shadow w-10 h-10 flex items-center justify-center border-none hover:bg-gray-300"
                            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % sortedEvents.length)}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Indicators (Dots) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                            {sortedEvents.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentBannerIndex(i)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        currentBannerIndex === i ? "bg-white w-4" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </Card>
                )}
                <Card className='gap-0'>
                    <CardHeader className='flex flex-col gap-4 px-6'>
                        <div className="flex flex-col md:flex-row md:items-center mx-2 w-full justify-between gap-4">
                            <CardTitle className='text-primary text-lg md:text-[28px] whitespace-nowrap'>In Focus</CardTitle>
                            <ButtonGroup className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto w-full md:w-auto'>
                                <Button
                                    variant={inFocusActiveTab === 'Portfolio' ? 'default' : 'outline'}
                                    className={`w-full md:w-32 rounded-none border text-white ${inFocusActiveTab !== 'Portfolio' && 'bg-[#5A5A5A]'}`}
                                    onClick={() => setInFocusActiveTab('Portfolio')}
                                >
                                    Creators
                                </Button>
                                <Button
                                    variant={inFocusActiveTab === 'Industries' ? 'default' : 'outline'}
                                    className={`w-full md:w-32 rounded-none border text-white  ${inFocusActiveTab !== 'Industries' && 'bg-[#5A5A5A]'}`}
                                    onClick={() => setInFocusActiveTab('Industries')}
                                >
                                    Industries
                                </Button>
                                <Button
                                    variant={inFocusActiveTab === 'Institutes' ? 'default' : 'outline'}
                                    className={`w-full md:w-32 rounded-none border text-white  ${inFocusActiveTab !== 'Institutes' && 'bg-[#5A5A5A]'}`}
                                    onClick={() => setInFocusActiveTab('Institutes')}
                                >
                                    Institutes
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div className="flex items-center w-full justify-between  gap-2">
                            <CardDescription className='md:w-[70%] my-4 dark:text-white text-lg'>Key collaboration opportunities within the Indian tech community</CardDescription>
                            <Link to={'/collaborate/infocus'} className="whitespace-nowrap">
                                <div className="text-primary underline  cursor-pointer pb-1">View all</div>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <LoadingSection isLoading={isLoadingInFocus} title="Loading In Focus..." description="Please wait while we fetch the latest data." />
                        {
                            (!isLoadingInFocus && filteredInFocusData) && <Carousel opts={{ align: "start" }} className="w-full">
                                <CarouselContent className="pb-5 md:pb-0">
                                    {filteredInFocusData.map((item, index) => (
                                        <CarouselItem key={`${item.type}-${item.name}-${index}`} className="md:basis-1/2 lg:basis-1/2 2xl:basis-1/3">
                                            <div className="py-1 h-full">
                                                {item.type === 'profile' ? (
                                                    <PortfolioCard data={item} />
                                                ) : (
                                                    <CreativeDirectory data={item} />
                                                )}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -left-5" />
                                <CarouselNext className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -right-5" />
                            </Carousel>
                        }
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-col gap-2 px-6'>
                        <CardTitle className='text-primary text-lg md:text-[28px]'>On The Agenda</CardTitle>
                        <div className="flex items-end w-full justify-between gap-2">
                            <CardDescription className='md:w-[70%] dark:text-white mr-4 text-lg'>Upcoming learning and networking opportunities across India</CardDescription>
                            <Link
                                to={'/collaborate/agenda-list'}
                                className="whitespace-nowrap"
                                onClick={() => mixpanelService.track('Collaborate Agenda View All Clicked')}
                            >
                                <div className="text-primary underline cursor-pointer pb-1">View all</div>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Carousel>
                            <CarouselContent className="pb-5 md:pb-0 my-2">
                                {agendaData?.map(item => (
                                    <CarouselItem key={item.type} className="md:basis-1/2 h-96 lg:basis-1/2 2xl:basis-1/3 pb-4 bg-center bg-cover overflow-hidden relative rounded-[20px]">
                                        <Link
                                            key={item?.type}
                                            to={`/collaborate/agenda?category=${item.type}`}
                                            onClick={() => mixpanelService.track(`Collaborate Agenda :- ${item.title} => Clicked`, { category: item.type })}
                                        >
                                            <AgendaCard data={item} />
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -left-5" />
                            <CarouselNext className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -right-5" />
                        </Carousel>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                <WeeklyCalendar />
                <Cat />
                <Announcement />
                {enableMustWatchout === 0 && <MustWatchOut />}

                <Advitisement />

            </div>
            <div className='col-span-1 lg:col-span-10'>
                <MustAttendSection mustAttendData={mustAttendData} />
            </div>
        </div>
    )
}

export default Collaborate