import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEvents, useEventCategories, useEventApply, useAssignedEvents } from '@/hooks/data/collaborate/useEvents';
import LoadingSection from '@/components/LoadingSection';
import { formatedApiDate } from '@/utils/dateFormat';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import Breadcrumb from '@/components/breadcrumb';
import { ArrowRight, Calendar, Clock, Loader } from 'lucide-react';
import { formatDate } from '@/utils/commonDateFormat';
import { toast } from 'sonner';
import calendarIcon from '@/assets/collaborate/calendar.svg';
import checkbookIcon from '@/assets/collaborate/checkbook.svg';
import newsmodeIcon from '@/assets/collaborate/newsmode.svg';

const MustAttendList = () => {
    const navigate = useNavigate();
    const applyMutation = useEventApply();
    const { data: assignedEvents } = useAssignedEvents();

    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
    const [registeringEventIds, setRegisteringEventIds] = useState<string[]>([]);

    useEffect(() => {
        if (assignedEvents) {
            setRegisteredEventIds(assignedEvents.map(e => String(e.id)));
        }
    }, [assignedEvents]);

    const handleRegister = (eventId: string, category: string) => {
        if (registeringEventIds.includes(eventId)) return;

        setRegisteringEventIds((prev) => [...prev, eventId]);
        applyMutation.mutate(
            { eventId, eventType: category || undefined },
            {
                onSuccess: () => {
                    toast.success("Successfully applied for the Event!");
                    setRegisteredEventIds((prev) => [...prev, eventId]);
                    setRegisteringEventIds((prev) => prev.filter((id) => id !== eventId));
                },
                onError: (error: Error) => {
                    toast.error(error?.message || "Failed to apply for Event. Please try again.");
                    setRegisteringEventIds((prev) => prev.filter((id) => id !== eventId));
                },
            }
        );
    };

    const searchParams = new URLSearchParams(window.location.search);
    const { data: categories = [], isLoading: isCategoriesLoading } = useEventCategories();
    const mustAttendCategories = categories.filter(cat => cat.group_name === 'Must Attend');
    const getMappedName = (name: string) => {
        const lower = name?.toLowerCase() || '';
        if (lower.includes('community meetup')) return 'Creators Meetup';
        if (lower.includes('flagship event')) return 'enCODE';
        return name;
    };

    const tabs = mustAttendCategories.map(cat => getMappedName(cat.name));
    const categoryMap: Record<string, number> = mustAttendCategories.reduce((acc, cat) => {
        acc[getMappedName(cat.name)] = cat.id;
        return acc;
    }, {} as Record<string, number>);

    const rawEventCategoryFromQuery = searchParams.get("category");
    const eventCategoryFromQuery = rawEventCategoryFromQuery ? getMappedName(rawEventCategoryFromQuery) : null;

    const [activeTab, setActiveTab] = useState<string>("");
    useEffect(() => {
        if (mustAttendCategories.length > 0) {
            if (eventCategoryFromQuery) {
                const matchedTab = tabs.find(t => {
                    const tLower = t.toLowerCase().trim();
                    const qLower = eventCategoryFromQuery.toLowerCase().trim();
                    return tLower === qLower || tLower.includes(qLower) || qLower.includes(tLower);
                });
                if (matchedTab) {
                    setActiveTab(matchedTab);
                } else if (!activeTab) {
                    setActiveTab(tabs[0]);
                }
            } else if (!activeTab) {
                setActiveTab(tabs[0]);
            }
        }
    }, [mustAttendCategories, eventCategoryFromQuery]);

    const categoryId = categoryMap[activeTab];
    const params = new URLSearchParams();
    if (categoryId) {
        params.append("event_category_id", categoryId.toString());
    }

    const { data: events, isLoading, isError } = useEvents(categoryId ? params : null, !!categoryId);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        navigate(`/collaborate/must-attend?category=${value}`, { replace: true });
    };

    const getBadgeColor = (type: string) => {
        const typeLower = type?.toLowerCase() || '';
        if (typeLower.includes('creator') || typeLower.includes('community')) return 'bg-codeblue';
        if (typeLower.includes('flagship') || typeLower.includes('encode')) return 'bg-codepink';
        if (typeLower.includes('career')) return 'bg-codegreen';
        if (typeLower.includes('immersion')) return 'bg-codeblue';
        return 'bg-codepink';
    };

    const isPastEvent = (endDate: string) => {
        if (!endDate) return false;
        const date = new Date(endDate);
        date.setHours(23, 59, 59, 999);
        return date < new Date();
    };

    const breadcrumbItems = [
        { label: 'Must Attend List', path: '/collaborate/must-attend-list' },
        { label: 'Must Attend', path: '' },
    ];

    return (
        <div className="space-y-5">
            <div className="space-y-4">
                <Breadcrumb items={breadcrumbItems} className='mb-0' />
                <p className='text-lg text-white'>High-priority flagship events and community gatherings across India</p>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList
                        className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6 flex overflow-x-auto no-scrollbar md:flex w-full md:w-fit justify-start divide-x divide-gray-400'
                    >
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5 whitespace-nowrap flex-shrink-0'
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            {(events && events?.length > 0) && <Card>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events?.filter(event => !event.name?.toLowerCase().includes('feedback')).map((event) => {
                            const isRegistered = event.is_assigned === 1 || registeredEventIds.includes(String(event.id));
                            const isRegistering = registeringEventIds.includes(String(event.id));
                            const isPast = isPastEvent(event.end_date);
                            const detailLink = `/must-attend/details/${event?.id}?category=${activeTab}`;

                            return (
                                <div key={event.id} className="hover:shadow-md bg-[#323232] transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-700 flex flex-row md:flex-col p-4 md:p-0 gap-4 md:gap-0 h-[140px] md:h-auto items-center md:items-stretch group">
                                    {/* Desktop Image Banner */}
                                    <div
                                        onClick={() => navigate(detailLink)}
                                        className="hidden md:block relative border-b border-gray-600 w-full cursor-pointer"
                                    >
                                        <div className="h-48 bg-[#1a1a1a] bg-cover bg-center w-full relative">
                                            <img src={event.image} alt={event.name} className="w-full h-48 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event.name);
                                                }}
                                            />
                                            <span className={`absolute top-0 right-0 px-3 py-1 ${getBadgeColor(activeTab)} text-white text-xs font-semibold rounded-bl-xl shadow-lg z-10`}>
                                                {activeTab}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile Image Thumbnail */}
                                    <div
                                        onClick={() => navigate(detailLink)}
                                        className="md:hidden flex-shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden cursor-pointer"
                                    >
                                        <img src={event.image} alt={event.name} className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event.name);
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-between h-full md:p-4 md:pt-2 md:space-y-3 overflow-hidden">
                                        <div className="space-y-1 md:space-y-3">
                                            <div className="flex items-start gap-3 mb-1 md:mb-2">
                                                <img
                                                    src={event?.org_logo}
                                                    alt={event?.organization_name || "Organization"}
                                                    className="hidden md:block rounded-xl bg-[#131313] border w-12 h-12 shrink-0 object-contain p-1 shadow-sm"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                                <h4
                                                    className="text-base md:text-xl font-bold text-[#7fbc42] leading-tight line-clamp-2 pt-1 flex items-start"
                                                >
                                                    {event.name ?? '-'}
                                                </h4>
                                            </div>

                                            <div className="hidden md:block">
                                                {event?.skill && event.skill.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.skill.slice(0, 2).map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-4 py-2 bg-[#FF1B6D] text-white text-xs font-bold uppercase rounded tracking-wide"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-xs md:hidden line-clamp-2">
                                                {stripHtmlTags(event.description)}
                                            </p>
                                        </div>

                                        {/* Desktop Details */}
                                        <div className="hidden md:block space-y-2 text-xs">
                                            <div className="flex items-center gap-2 text-white whitespace-nowrap">
                                                <img src={calendarIcon} alt="Calendar" className="w-5 h-5 shrink-0" />
                                                <span>
                                                    Registration Date: <strong>
                                                        {event.start_date === event.end_date
                                                            ? formatedApiDate(event.start_date)
                                                            : `${formatedApiDate(event.start_date)} - ${formatedApiDate(event.end_date)}`}
                                                    </strong>
                                                </span>
                                            </div>
                                            {event.event_details?.event_datetime && (
                                                <div className="flex items-center gap-2 text-white whitespace-nowrap">
                                                    <img src={calendarIcon} alt="Calendar" className="w-5 h-5 shrink-0" />
                                                    <span>
                                                        Event Date: <strong>
                                                            {formatDate(String(event?.event_datetime), 'MMM DD, YYYY hh:mm A')}
                                                        </strong>
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-white whitespace-nowrap">
                                                <img src={newsmodeIcon} alt="Mode" className="w-5 h-5 shrink-0" />
                                                <span>
                                                    Location: <strong>{event?.vanue ?? event?.location}</strong>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mobile Footer Link */}
                                        <div className="md:hidden flex justify-end mt-1">
                                            {isPast ? (
                                                <Link to={detailLink} className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium hover:underline">
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-4 h-4 text-[#7fbc42]" />
                                                </Link>
                                            ) : isRegistering ? (
                                                <div className="flex items-center gap-1 text-gray-500 text-sm font-medium cursor-not-allowed">
                                                    <Loader className="animate-spin w-4 h-4" />
                                                    <span>Registering...</span>
                                                </div>
                                            ) : isRegistered ? (
                                                <Link to={detailLink} className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium hover:underline">
                                                    <span>Continue</span>
                                                    <ArrowRight className="w-4 h-4 text-[#7fbc42]" />
                                                </Link>
                                            ) : (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRegister(String(event.id), activeTab);
                                                    }}
                                                    className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium cursor-pointer hover:underline"
                                                >
                                                    <span>Register Now</span>
                                                    <ArrowRight className="w-4 h-4 text-[#7fbc42]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop Description & Button */}
                                        <div className="hidden md:flex justify-between items-end gap-2 pt-2 mt-auto">
                                            <p className="text-white text-sm leading-relaxed line-clamp-3 mb-2 flex-1">
                                                {stripHtmlTags(event.description)}
                                            </p>

                                            <div className="flex justify-end shrink-0">
                                                {isPast ? (
                                                    <Link to={detailLink}>
                                                        <div className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-4 py-3 rounded-2xl text-base shadow-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                                                            <ArrowRight className="w-5 h-5 shrink-0" />
                                                            <span
                                                                style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                                                className="text-center font-normal text-[20px] leading-[22px]"
                                                            >
                                                                View
                                                                <br />
                                                                Details
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ) : isRegistering ? (
                                                    <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[125px] h-[90px] font-bold px-2 py-3 rounded-2xl text-base shadow-lg flex flex-col items-center justify-center gap-1 opacity-70 cursor-not-allowed">
                                                        <Loader className="animate-spin w-5 h-5 shrink-0" />
                                                        <span
                                                            style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                                            className="text-center font-normal text-[18px] leading-[20px]"
                                                        >
                                                            Registering
                                                        </span>
                                                    </div>
                                                ) : isRegistered ? (
                                                    <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[125px] h-[90px] font-bold px-2 py-3 rounded-2xl text-base shadow-lg flex flex-col items-center justify-center gap-1 opacity-70 cursor-default">
                                                        <img src={checkbookIcon} alt="Registered" className="w-5 h-5 shrink-0" />
                                                        <span
                                                            style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                                            className="text-center font-normal text-[18px] leading-[20px]"
                                                        >
                                                            Registered
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRegister(String(event.id), activeTab);
                                                        }}
                                                        className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-2 py-3 rounded-2xl text-base shadow-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <img src={checkbookIcon} alt="Register" className="w-5 h-5 shrink-0" />
                                                        <span
                                                            style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                                            className="text-center font-normal text-[18px] leading-[20px]"
                                                        >
                                                            Register
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            }
            <div>
                {isLoading && <LoadingSection title='Loading events...' isLoading={isLoading} description='Please wait while we fetch the latest events.' />}
                {
                    events && events?.length === 0 && !isLoading && !isError && (
                        <p className="text-center text-white">No {activeTab} found.</p>
                    )
                }
            </div>
        </div>
    );
};

export default MustAttendList;
