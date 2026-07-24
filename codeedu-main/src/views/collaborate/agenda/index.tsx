import Breadcrumb from '@/components/breadcrumb';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents, useEventCategories, useEventApply } from '@/hooks/data/collaborate/useEvents';
import { formatedApiDate } from '@/utils/dateFormat';
import { formatDate } from '@/utils/commonDateFormat';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { ArrowRight, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import calendarIcon from '@/assets/collaborate/calendar.svg';
import checkbookIcon from '@/assets/collaborate/checkbook.svg';
import newsmodeIcon from '@/assets/collaborate/newsmode.svg';

const Resources = () => {
  const navigate = useNavigate();
  const applyMutation = useEventApply();

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [registeringEventIds, setRegisteringEventIds] = useState<string[]>([]);

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
  const eventCategoryFromQuery = searchParams.get('category');
  const industry_id = searchParams.get('industry_id') as string;
  const { data: categories = [], isLoading: isCategoriesLoading } = useEventCategories();
  const agendaCategories = categories.filter(cat => cat.group_name === 'On the Agenda');
  const tabs = agendaCategories.map(cat => cat.name);
  const categoryMap: Record<string, number> = agendaCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, number>);

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (agendaCategories.length > 0) {
      if (eventCategoryFromQuery && tabs.includes(eventCategoryFromQuery)) {
        setActiveTab(eventCategoryFromQuery);
      } else if (!activeTab) {
        setActiveTab(tabs[0]);
      }
    }
  }, [agendaCategories, eventCategoryFromQuery]);

  const categoryId = categoryMap[activeTab];
  const params = new URLSearchParams();
  if (categoryId) {
    params.append('event_category_id', categoryId.toString());
  }

  const { data: eventsData, isLoading, isError } = useEvents(categoryId ? params : null, !!categoryId);
  const events = industry_id ?
    eventsData?.filter((event) => event.organization_id === parseInt(industry_id)) :
    eventsData;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(
      industry_id
        ? `/collaborate/agenda?category=${value}&industry_id=${industry_id}`
        : `/collaborate/agenda?category=${value}`,
      { replace: true }
    );
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Masterclass':
        return 'bg-codeblue';
      case 'Workshop':
      case 'Workshops':
        return 'bg-codepink';
      case 'Industry Visits':
        return 'bg-codegreen';
      default:
        return 'bg-codeblue';
    }
  };

  const isPastEvent = (endDate: string) => {
    if (!endDate) return false;
    const date = new Date(endDate);
    date.setHours(23, 59, 59, 999);
    return date < new Date();
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'On Agenda list', path: '/collaborate/agenda-list' }, { label: 'On the Agenda', path: '' }]} />

      <p className="text-lg text-white">
        Upcoming learning and networking opportunities across India
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList
          className="bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6 flex overflow-x-auto no-scrollbar md:flex w-full md:w-fit justify-start divide-x divide-gray-400"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none text-white data-[state=active]:text-[#000000] px-5 py-3 whitespace-nowrap flex-shrink-0"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {(events?.length ?? 0) > 0 && (
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => {
                const isRegistered = event.approval_status === '1' || (event as any).approval_status === 1 || registeredEventIds.includes(String(event.id));
                const isRegistering = registeringEventIds.includes(String(event.id));
                const isPast = isPastEvent(event.end_date);
                const detailLink = `/agenda/details/${event.id}?category=${activeTab}${industry_id ? `&industry_id=${industry_id}` : ''}`;
                const eventStartAt = event?.event_datetime ? new Date(String(event.event_datetime)).getTime() : NaN;
                const msToEventStart = Number.isNaN(eventStartAt) ? Number.POSITIVE_INFINITY : eventStartAt - Date.now();
                const isJoinWindowOpen = msToEventStart <= 5 * 60 * 1000;
                const registeredCtaLabel = isJoinWindowOpen ? 'Join Now' : 'View Details';

                return (
                  <div
                    key={event.id}
                    onClick={() => (isRegistered || isPast) ? navigate(detailLink) : undefined}
                    className={`hover:shadow-md transition-shadow duration-300 bg-[#323232] rounded-2xl overflow-hidden border border-gray-600 flex flex-row md:flex-col p-4 md:p-0 gap-4 md:gap-0 h-[140px] md:h-auto items-center md:items-stretch${(isRegistered || isPast) ? ' cursor-pointer' : ''}`}
                  >
                    {/* Desktop Banner */}
                    <div
                      className="hidden md:block relative h-46 w-full"
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-46 object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://ui-avatars.com/api/?name=' +
                            encodeURIComponent(event.name);
                        }}
                      />

                      <span
                        className={`absolute top-0 right-0 px-3 py-1 text-white text-xs font-semibold rounded-bl-xl shadow-lg z-10 ${getBadgeColor(
                          activeTab
                        )}`}
                      >
                        {activeTab}
                      </span>
                    </div>

                    {/* Mobile Thumbnail */}
                    <div
                      className="md:hidden flex-shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden"
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://ui-avatars.com/api/?name=' +
                            encodeURIComponent(event.name);
                        }}
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between h-full md:p-5 md:space-y-3 overflow-hidden">
                      <div className="space-y-1 md:space-y-3">
                        <h4
                          className="text-base md:text-xl font-bold text-[#7fbc42] leading-tight line-clamp-2 md:min-h-[3.5rem]"
                        >
                          {event.name}
                        </h4>

                        <div className="hidden md:block space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-white whitespace-nowrap">
                            <img src={calendarIcon} alt="Calendar" className="w-5 h-5 shrink-0" />
                            <span>
                              Registration Date: <strong>
                                {formatedApiDate(event.start_date)} –{' '}
                                {formatedApiDate(event.end_date)}
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-white whitespace-nowrap">
                            <img src={calendarIcon} alt="Calendar" className="w-5 h-5 shrink-0" />
                            <span>
                              Event Date: <strong>
                                {formatDate(String(event?.event_datetime ?? ''), 'MMM DD, YYYY hh:mm A')}
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-white whitespace-nowrap">
                            <img src={newsmodeIcon} alt="Mode" className="w-5 h-5 shrink-0" />
                            <span>
                              Mode: <strong>{event.vanue ?? 'Online'}</strong>
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs md:hidden line-clamp-2">
                          {stripHtmlTags(event.description)}
                        </p>
                      </div>

                      {/* Mobile Footer Link */}
                      <div className="md:hidden flex justify-end mt-1">
                        {isPast ? (
                          <Link
                            to={detailLink}
                            className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium hover:underline"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 text-[#7fbc42]" />
                          </Link>
                        ) : isRegistering ? (
                          <div className="flex items-center gap-1 text-gray-500 text-sm font-medium cursor-not-allowed">
                            <Loader className="animate-spin w-4 h-4" />
                            <span>Registering...</span>
                          </div>
                        ) : isRegistered ? (
                          isJoinWindowOpen ? (
                            <Link
                              to={detailLink}
                              className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium hover:underline"
                            >
                              <span>Join Now</span>
                              <ArrowRight className="w-4 h-4 text-[#7fbc42]" />
                            </Link>
                          ) : (
                            <div className="flex items-center gap-1 text-[#7fbc42] text-sm font-medium opacity-70 cursor-default">
                              <span>Registered</span>
                            </div>
                          )
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
                      <div className="hidden md:flex justify-between gap-2 pt-2">
                        <p className="text-white text-base leading-relaxed line-clamp-3 mb-6">
                          {stripHtmlTags(event.description)}
                        </p>
                        <div className="flex justify-end">
                          {isPast ? (
                            <Link to={detailLink}>
                              <div className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-4 py-3 rounded-2xl text-base shadow-lg transition-all flex flex-col items-center justify-center gap-1">
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
                            <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[125px] h-[90px] font-bold px-2 py-3 rounded-2xl text-base shadow-lg transition-all flex flex-col items-center justify-center gap-1 opacity-70 cursor-not-allowed">
                              <Loader className="animate-spin w-5 h-5 shrink-0" />
                              <span
                                style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                className="text-center font-normal text-[18px] leading-[20px]"
                              >
                                Registering
                              </span>
                            </div>
                          ) : isRegistered ? (
                            isJoinWindowOpen ? (
                              <Link to={detailLink}>
                                <div className="bg-[#7fbc42] w-[125px] h-[90px] hover:bg-[#6da538] text-[#1a1a1a] font-bold px-4 py-3 rounded-2xl text-base shadow-lg transition-all flex flex-col items-center justify-center gap-1">
                                  <ArrowRight className="w-5 h-5 shrink-0" />
                                  <span
                                    style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                    className="text-center font-normal text-[20px] leading-[22px]"
                                  >
                                    Join
                                    <br />
                                    Now
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <div className="bg-[#a3a3a3] text-[#1a1a1a] w-[125px] h-[90px] font-bold px-2 py-3 rounded-2xl text-base shadow-lg flex flex-col items-center justify-center gap-1 opacity-70 cursor-default">
                                <img src={checkbookIcon} alt="Registered" className="w-5 h-5 shrink-0" />
                                <span
                                  style={{ fontFamily: "'Jacques Pro', sans-serif" }}
                                  className="text-center font-normal text-[18px] leading-[20px]"
                                >
                                  Registered
                                </span>
                              </div>
                            )
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
      )}

      {isLoading && (
        <LoadingSection
          title="Loading events..."
          isLoading={isLoading}
        />
      )}

      {events?.length === 0 && !isLoading && !isError && (
        <p className="text-center text-white">
          No {activeTab} found.
        </p>
      )}
    </div>
  );
};

export default Resources;