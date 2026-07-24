import Breadcrumb from "@/components/breadcrumb";
import LoadingSection from "@/components/LoadingSection";
import SafeHtml from "@/components/SafeHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventById, useEventApply, useLearnerCompetitionDetail } from "@/hooks/data/collaborate/useEvents";
import { formatDate } from "@/utils/commonDateFormat";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Star, ArrowRight, CalendarDays, Loader, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatedApiDate } from "@/utils/dateFormat";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcnTooltip";
import { toast } from "sonner";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";
import { usePackageAccessCounts } from "@/hooks/data/usePackageAccessCounts";


type ResourceCategory =
  | 'Masterclass'
  | 'Workshop'
  | 'Industry Visits'
  | 'Competitions'
  | 'Immersion Programs'
  | 'Event';

const getBadgeColor = (type: string) => {
  switch (type) {
    case 'Masterclass':
      return 'bg-codeblue';
    case 'Workshop':
    case 'Workshops':
      return 'bg-codepink';
    case 'Industry Visits':
      return 'bg-codegreen';
    case 'Competitions':
      return 'bg-codeyellow';
    case 'Immersion Programs':
      return 'bg-codepurple';
    case 'Event':
      return 'bg-slate-600';
    default:
      return 'bg-codeblue';
  }
};

/** Map API / URL strings to agenda tab labels — never assume Masterclass. */
const normalizeCategory = (category: string): ResourceCategory => {
  const normalized = category.toLowerCase().trim();

  if (normalized.includes('masterclass')) return 'Masterclass';
  if (normalized.includes('workshop')) return 'Workshop';
  if (normalized.includes('industry') || normalized.includes('visit')) return 'Industry Visits';
  if (normalized.includes('competition')) return 'Competitions';
  if (normalized.includes('immersion')) return 'Immersion Programs';

  if (normalized.length > 0) {
    return category.trim().replace(/\b\w/g, (c) => c.toUpperCase()) as ResourceCategory;
  }
  return 'Event';
};

export default function OnTheAgendaDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);

  const currentTab = searchParams.get('tab') || 'overview';
  const categoryFromUrl = searchParams.get('category') || '';
  const industryId = searchParams.get('industry_id');

  const { data: eventdetails, isLoading } = useEventById(id, categoryFromUrl || undefined);
  const isAlreadyAssigned = eventdetails?.is_assigned === 1;

  const { data: learnerDetails } = useLearnerCompetitionDetail(id, isAlreadyAssigned);
  const applyMutation = useEventApply();
  const { isAccessExhausted } = usePackageAccessCounts();

  const handleApply = () => {
    if (!id) {
      toast.error("Event ID is missing");
      return;
    }

    applyMutation.mutate({ eventId: id, eventType: categoryFromUrl || undefined }, {
      onSuccess: () => {
        toast.success("Successfully applied for the Event!");
      },
      onError: (error: Error) => {
        toast.error(error?.message || "Failed to apply for Event. Please try again.");
      },
    });
  };

  const event = eventdetails?.competitions_details?.program;

  const zoomTask = (learnerDetails?.data?.list || eventdetails?.competitions_details?.program?.contents || event?.contents || [])?.find(
    (task: any) => task?.content_type?.toLowerCase() === 'zoomclass'
  );

  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number, total: number } | null>(null);

  useEffect(() => {
    const startDatetime = event?.event_details?.event_datetime;
    if (!startDatetime) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const targetTime = new Date(startDatetime).getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, total: difference });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [event?.event_details?.event_datetime]);

  const trackedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    const eventName = event?.name;
    if (eventName && trackedEventIdRef.current !== id) {
      mixpanelService.track(`Collaborate Agenda :- ${eventName} => Detail Page Viewed`, {
        event_id: id,
        category: categoryFromUrl,
        timestamp: new Date().toISOString(),
        eventName: eventName
      });
      trackedEventIdRef.current = id || null;
    }
  }, [event?.name, categoryFromUrl, id]);

  if (isLoading) return <LoadingSection isLoading={isLoading} title="Loading event details..." description="please wait ....." />;


  const instructions = eventdetails?.competition_instructions;
  const skills = eventdetails?.job_skill_details?.all_program_skills;
  const expert = eventdetails?.expert;
  const isApplied = isAlreadyAssigned;
  const isDisabled = Boolean(eventdetails?.is_assigned) || applyMutation.isPending;
  const isMasterAccessExhausted = isAccessExhausted(categoryFromUrl.toLowerCase().replace(/\s+/g, '_')) || isAccessExhausted(categoryFromUrl.toLowerCase().replace(/\s+/g, '-'));

  const isMoreThan10Mins = event?.event_details?.event_datetime
    ? (!timeLeft || timeLeft.total > 10 * 60 * 1000)
    : true;
  const isJoinReady = isApplied && zoomTask && !isMoreThan10Mins;

  const agendaCategoryLabel: ResourceCategory = (() => {
    const apiName = event?.event_details?.event_category_name?.trim();
    if (apiName) return normalizeCategory(apiName);
    const ct = event?.content_type?.trim();
    if (ct) return normalizeCategory(ct);
    if (categoryFromUrl) return normalizeCategory(categoryFromUrl);
    return 'Event';
  })();

  const breadcrumbCategory = agendaCategoryLabel;

  const isPastEvent = (endDate: string) => {
    if (!endDate) return false;
    const date = new Date(endDate);
    date.setHours(23, 59, 59, 999);
    return date < new Date();
  };

  const isStarted = (startDate: string) => {
    if (!startDate) return true;
    const today = new Date();
    const eventStartDate = new Date(startDate);
    return eventStartDate <= today;
  }

  const breadcrumbItems = [
    {
      label: 'On Agenda list',
      path: '/collaborate/agenda-list'
    },
    {
      label: 'On the Agenda',
      path: '/collaborate/agenda'
    },
    {
      label: breadcrumbCategory,
      path: `/collaborate/agenda?category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`
    },
    {
      label: event?.name || 'Event Details',
      isCurrent: true
    },
  ];

  const handleBackToAgenda = () => {
    navigate(`/collaborate/agenda?category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`);
  };

  const formattedTimeLeft = timeLeft
    ? `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
    : '00:00:00';

  const showBothButtons =
    !isPastEvent(event?.end_date ?? '') &&
    isApplied &&
    !!zoomTask &&
    !isPastEvent(zoomTask?.end_date || event?.end_date || '');

  return (
    <div className="flex flex-col space-y-6">
      <Breadcrumb items={breadcrumbItems} className="[&>ol>li:last-child]:hidden [&>ol>li:nth-last-child(2)]:hidden md:[&>ol>li:last-child]:inline-flex md:[&>ol>li:nth-last-child(2)]:flex" />

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6">
        {/* Mobile Banner with Image Tag for proper height */}
        <div className="md:hidden relative w-full bg-black rounded-3xl overflow-hidden border border-gray-800">
          <img
            src={event?.image}
            alt={event?.name}
            className="w-full h-auto object-cover"
          />
          <span
            className={`absolute top-0 right-0 px-4 py-2 text-white text-sm font-semibold rounded-bl-xl ${getBadgeColor(agendaCategoryLabel)}`}
          >
            {agendaCategoryLabel}
          </span>
        </div>

        {/* Desktop Banner */}
        <div className="hidden md:block md:col-span-7 relative h-full min-h-[384px] rounded-3xl overflow-hidden border border-gray-800 bg-[#1a1a1a]">
          <img src={event?.image} alt={event?.name} className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event?.name?.toString() ?? '');
            }}
          />
          <span
            className={`absolute top-0 right-0 px-6 py-2 text-white text-sm font-semibold rounded-bl-2xl ${getBadgeColor(agendaCategoryLabel)}`}
          >
            {agendaCategoryLabel}
          </span>
        </div>


        <Card className="md:col-span-3 flex flex-col justify-between bg-[#1a1a1a] h-full">
          <CardContent className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {event?.name ?? 'Event Details'}
            </h1>
            {event?.event_details?.functional_domain && <p className="text-gray-300 text-sm">Domain: {event?.event_details?.functional_domain ?? '-'}</p>}

            <div className="space-y-2">
              <p className="text-white text-sm">
                <span className="text-[#7fbc42] font-semibold">
                  Registration Date:
                </span>{' '}
                <strong>
                  {formatedApiDate(String(event?.start_date))} –{' '}
                  {formatedApiDate(String(event?.end_date))}
                </strong>
              </p>

              <p className="text-white text-sm">
                <span className="text-[#7fbc42] font-semibold">
                  Event Date:
                </span>{' '}
                <strong>
                  {formatDate(event?.event_details?.event_datetime ?? '', 'MMM DD, YYYY hh:mm A')}

                </strong>
              </p>

              <p className="text-white text-sm">
                <span className="text-[#7fbc42] font-semibold">
                  Mode:
                </span>{' '}
                <strong>{event?.vanue ?? 'Online'}</strong>
              </p>

              {isPastEvent(event?.end_date ?? '') && (
                <div className="flex items-center gap-2 bg-slate-500/10 border border-slate-400/30 rounded-lg px-3 py-2 mt-1">
                  <p className="text-slate-200 text-center text-sm font-medium">This event has ended.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className={`grid ${showBothButtons ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full p-4`}>
            {!isPastEvent(event?.end_date ?? '') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`${isJoinReady || !isApplied ? 'bg-[#7fbc42] text-[#1a1a1a] hover:bg-[#6da538]' : 'bg-[#323232] text-[#7fbc42]'} w-full h-auto min-h-[60px] md:min-h-[80px] md:h-full
                      ${applyMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''} ${!isApplied && isMasterAccessExhausted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                      font-bold
                      px-3 py-3 md:py-4 rounded-lg
                      text-sm md:text-base shadow-lg
                      transition-all
                      flex flex-col items-center justify-center gap-1`}
                      onClick={() => {
                        if (applyMutation.isPending) return;
                        if (isApplied) {
                          if (isJoinReady) {
                            if (zoomTask?.id) {
                              navigate(`/zoom/meeting/collaborate/${zoomTask.id}`);
                              return;
                            }
                          } else {
                            toast.info("Class will be enabled 10 minutes before the start time");
                          }
                        } else {
                          if (isMasterAccessExhausted) {
                            toast.error('You have reached the maximum limit available under your current package.');
                            return;
                          }
                          handleApply();
                        }
                      }}
                      title={!isApplied && isMasterAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                      disabled={isMasterAccessExhausted}
                    >
                      {applyMutation.isPending ? (
                        <Loader className="animate-spin" size={24} />
                      ) : (
                        <>
                          <ArrowRight size={22} />
                          <span className="leading-snug text-center text-sm md:text-base">
                            {isJoinReady ? (
                              <>
                                Join In
                                <br />
                                Now
                              </>
                            ) : isApplied ? "Registered" : "Register Now"}
                          </span>
                        </>
                      )}
                    </button>
                  </TooltipTrigger>

                </Tooltip>
              </TooltipProvider>
            )}
            {isApplied && zoomTask && !isPastEvent(zoomTask?.end_date || event?.end_date || '') && (() => {
              if (isMoreThan10Mins) {
                return (
                  <div
                    className="bg-[#2a2a2a] w-full h-auto min-h-[60px] md:min-h-[80px] md:h-full
                    cursor-default
                    text-white font-bold
                    px-3 py-3 md:py-4 rounded-lg
                    text-sm md:text-base
                    flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide">We're going live in</span>
                    <span className="text-sm md:text-lg text-[#7fbc42] font-mono tracking-wider">
                      {timeLeft ? (
                        <>
                          {timeLeft.days > 0 && `${timeLeft.days}d `}
                          {String(timeLeft.hours).padStart(2, '0')}:
                          {String(timeLeft.minutes).padStart(2, '0')}:
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </>
                      ) : '00:00:00'}
                    </span>
                  </div>
                );
              }

              const zoomUrl = zoomTask.open_url || zoomTask.join_url || zoomTask.zoom_url || zoomTask.url || zoomTask.link;
              if (!zoomUrl) return null;

              return (
                <a
                  href={zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full"
                >
                  <div
                    className="bg-[#7fbc42] w-full h-auto min-h-[60px] md:min-h-[80px] md:h-full
                    hover:bg-[#6da538] cursor-pointer
                    text-[#1a1a1a] font-bold
                    px-3 py-3 md:py-4 rounded-lg
                    text-sm md:text-base shadow-lg
                    transition-all
                    flex flex-col items-center justify-center gap-1"
                  >
                    <span className="leading-snug text-center text-sm md:text-base">
                      Join in
                      <br />
                      Browser
                    </span>
                  </div>
                </a>
              );
            })()}
          </CardFooter>
        </Card>
      </div>


      {/* <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 py-10 px-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center relative">
            <p className="text-gray-400 text-sm mb-3">Mode</p>
            <p className="text-white text-2xl font-bold">
              {event?.event_details?.venue || 'Online'}
            </p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-700"></div>
          </div>
          <div className="text-center relative">
            <p className="text-gray-400 text-sm mb-3">Registered Users</p>
            <p className="text-white text-2xl font-bold">
              {event?.user_registered_count || '0'}
            </p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-700"></div>
          </div>
          <div className="text-center relative">
            <p className="text-gray-400 text-sm mb-3">Skills</p>
            <p className="text-white text-2xl font-bold">
              {skills?.length || '0'}
            </p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-700"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Rating</p>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <p className="text-white text-2xl font-bold">
                {event?.event_details?.rating || '0'}
              </p>
            </div>
          </div>
        </div>
      </div> */}


      <Card ref={tabsRef}>
        <CardContent>
          <Tabs defaultValue="overview" value={currentTab} className="w-full">
            <TabsList className="bg-[#5A5A5A] rounded-xl p-0 h-auto mb-6 flex flex-row flex-nowrap overflow-x-auto w-full md:w-fit md:justify-start whitespace-nowrap scrollbar-none">
              <TabsTrigger
                value="overview"
                className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5 whitespace-nowrap flex-shrink-0 flex-1 md:flex-initial"
                onClick={() => navigate(`?tab=overview&category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`)}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5 whitespace-nowrap flex-shrink-0 flex-1 md:flex-initial"
                onClick={() => navigate(`?tab=activities&category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`)}
              >
                Activities
              </TabsTrigger>
              <TabsTrigger
                value="expert"
                className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5 whitespace-nowrap flex-shrink-0 flex-1 md:flex-initial"
                onClick={() => navigate(`?tab=expert&category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`)}
              >
                Expert Details
              </TabsTrigger>
              <TabsTrigger
                value="certificate"
                className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5 whitespace-nowrap flex-shrink-0 flex-1 md:flex-initial"
                onClick={() => navigate(`?tab=certificate&category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`)}
              >
                Certificate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">About Event</h3>
                <div className="text-gray-300 leading-relaxed text-base">
                  <SafeHtml html={event?.description ?? 'No description available'} />
                </div>
              </div>


              <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Skills Acquired</h3>
                <div className="flex flex-wrap gap-4">
                  {skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-[#4a4a4a] text-white px-6 py-3 text-base font-medium rounded-full hover:bg-[#5a5a5a] transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {(!skills || skills.length === 0) && (
                    <p className="text-gray-500">No skills information available</p>
                  )}
                </div>
              </div>


              {instructions?.instructions && (
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-white mb-6">Event Instructions</h3>
                  <div className="text-gray-300 leading-relaxed text-base">
                    <SafeHtml html={instructions?.instructions?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                  </div>
                </div>
              )}

              {instructions?.whats_in && (
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-white mb-6">{`What's`} in for you</h3>
                  <div className="text-gray-300 leading-relaxed text-base">
                    <SafeHtml html={instructions?.whats_in?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                  </div>
                </div>
              )}

              {instructions?.faq && (
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                  <div className="text-gray-300 leading-relaxed text-base">
                    <SafeHtml html={instructions?.faq?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              {!isApplied ? (
                <Card className="py-0 bg-[#2a2a2a] border-gray-700 shadow-none">
                  <CardContent className="px-6 py-6 text-white/80">
                    Register to unlock activities for this {breadcrumbCategory.toLowerCase()}.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(event?.contents ?? []).map((task: any) => {
                    const isExpiredEvent = isPastEvent(event?.end_date ?? '');
                    const isExpiredTask = task?.end_date ? isPastEvent(task.end_date) : false;
                    const isZoomClass = task?.content_type?.toLowerCase() === 'zoomclass';
                    const zoomJoinUrl =
                      task?.join_url ||
                      task?.zoom_url ||
                      task?.url ||
                      task?.link ||
                      task?.open_url ||
                      zoomTask?.open_url ||
                      zoomTask?.join_url ||
                      zoomTask?.zoom_url ||
                      zoomTask?.url ||
                      zoomTask?.link;
                    const isExpiredZoom = isZoomClass && (isExpiredEvent || isExpiredTask);

                    return (
                      <Card
                        key={task.id}
                        className="py-0 bg-[#2a2a2a] border-gray-700 shadow-none"
                      >
                        <CardContent className="px-6 py-6 flex flex-col justify-between gap-6 min-h-[220px]">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-[#7fbc42] text-xl font-semibold line-clamp-2">
                              {task.title ?? "Task"}
                            </h3>
                            {task.description ? (
                              <p className="text-white/75 line-clamp-3">
                                {task.description}
                              </p>
                            ) : null}
                            {task.start_date ? (
                              <div className="flex items-center gap-2 text-white/70 mt-2">
                                <CalendarDays size={18} className="text-[#7A7A7A]" />
                                <span className="text-sm">
                                  {formatDate(task.start_date, "DD MMM, YYYY")}
                                </span>
                              </div>
                            ) : null}
                            {isZoomClass && !isExpiredZoom && (
                              <div className="mt-1 text-xs text-[#7fbc42] font-medium">
                                {timeLeft && timeLeft.total <= 0
                                  ? 'We are live now'
                                  : `We're going live in ${formattedTimeLeft}`}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-2">
                            {isExpiredZoom ? (
                              <button
                                type="button"
                                disabled
                                className="w-[120px] h-[95px] bg-[#5a5a5a] rounded-xl text-[#cfcfcf] font-semibold flex flex-col items-center justify-center gap-2 cursor-not-allowed"
                              >
                                <ArrowRight size={22} />
                                <span className="leading-snug text-center">
                                  Event
                                  <br />
                                  Ended
                                </span>
                              </button>
                            ) : (
                              <>
                                {isZoomClass ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isMoreThan10Mins) {
                                        toast.info("Class will be enabled 10 minutes before the start time");
                                        return;
                                      }
                                      navigate(`/zoom/meeting/collaborate/${task.id}`);
                                    }}
                                    className={`w-[120px] h-[95px] ${isMoreThan10Mins
                                      ? 'bg-[#5a5a5a] text-[#cfcfcf] cursor-not-allowed'
                                      : 'bg-[#7fbc42] text-black hover:brightness-95'
                                      } rounded-xl font-semibold flex flex-col items-center justify-center gap-2`}
                                  >
                                    <ArrowRight size={22} />
                                    <span className="leading-snug text-center text-sm md:text-base">
                                      Join in
                                      <br />
                                      Now
                                    </span>
                                  </button>
                                ) : (
                                  <Link to={`/details/${id}/event-activity/${task.id}?category=${encodeURIComponent(breadcrumbCategory)}${industryId ? `&industry_id=${industryId}` : ''}`}>
                                    <button
                                      type="button"
                                      className="w-[120px] h-[95px] bg-[#7fbc42] rounded-xl text-black font-semibold flex flex-col items-center justify-center gap-2 hover:brightness-95"
                                    >
                                      <ArrowRight size={22} />
                                      <span className="leading-snug text-center text-sm md:text-base">
                                        {isZoomClass ? 'Join' : 'Start'}
                                        <br />
                                        Now
                                      </span>
                                    </button>
                                  </Link>
                                )}
                                {isZoomClass && zoomJoinUrl && !isMoreThan10Mins && (
                                  <a
                                    href={zoomJoinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <button
                                      type="button"
                                      className="w-[120px] h-[95px] bg-[#7fbc42] rounded-xl text-black font-semibold flex flex-col items-center justify-center gap-2 hover:brightness-95 transition-colors"
                                    >
                                      <span className="leading-snug text-center text-sm md:text-base">
                                        Join in
                                        <br />
                                        Browser
                                      </span>
                                    </button>
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {(event?.contents ?? []).length === 0 ? (
                    <Card className="py-0 bg-[#2a2a2a] border-gray-700 shadow-none md:col-span-2">
                      <CardContent className="px-6 py-6 text-white/80">
                        No activities available yet.
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              )}
            </TabsContent>

            <TabsContent value="expert" className="space-y-6">
              {expert?.name ? (
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <img
                        src={expert?.profile_image || '/img/others/expert.png'}
                        alt={expert?.name || 'Expert'}
                        className="w-40 h-40 rounded-2xl object-cover border-4 border-[#7fbc42] shadow-xl"
                      />
                    </div>
                    <div className="space-y-5 flex-1">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Expert Name</p>
                        <p className="text-white text-2xl font-bold">{expert?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Role</p>
                        <p className="text-white text-lg font-medium">{expert?.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Skills</p>
                        <div className="flex flex-wrap gap-3">
                          {expert?.skills?.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-[#4a4a4a] text-white px-5 py-2 text-sm rounded-full"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {(!expert?.skills || expert.skills.length === 0) && (
                            <p className="text-gray-500">No skills listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                  <p className="text-gray-500 text-center py-8">No Expert Details Found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="certificate" className="space-y-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                <div className="text-gray-300 leading-relaxed text-base">
                  {eventdetails?.competitions_details?.program?.certificate_url ? (
                    <div className="flex items-start justify-center py-6 space-y-6">
                      <div className="w-full">
                        <h3 className="text-2xl font-bold text-white mb-6">Certificate Information</h3>
                        <p className="text-lg">Your certificate is ready</p>
                        <div
                          className="bg-[#7fbc42] h-[100px] text-center w-[125px] hover:bg-[#6da538] text-black font-bold rounded-xl text-base shadow-lg flex items-center justify-center mt-4 cursor-pointer"
                          onClick={() => {
                            const certificateUrl = eventdetails.competitions_details.program.certificate_url;
                            if (certificateUrl) {
                              const link = document.createElement('a');
                              link.href = certificateUrl;
                              link.download = `${event?.name || 'certificate'}.pdf`;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          Download Certificate
                        </div>
                      </div>
                      {/* Certificate Preview */}
                      <div className="w-full border-2 border-gray-600 rounded-xl overflow-hidden bg-white">
                        <iframe
                          src={`${eventdetails.competitions_details.program.certificate_url}#toolbar=0`}
                          className="w-full h-[107vh]"
                          title="Certificate Preview"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-gray-500">No certificate available</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div >
  );
}
