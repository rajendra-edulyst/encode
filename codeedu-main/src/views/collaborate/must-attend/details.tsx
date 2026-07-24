import Breadcrumb from "@/components/breadcrumb";
import LoadingSection from "@/components/LoadingSection";
import SafeHtml from "@/components/SafeHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventById, useEventParticipatingIndustries, useEventJobs, useEventApply, useAssignedEvents } from "@/hooks/data/collaborate/useEvents";
import { formatDate } from "@/utils/commonDateFormat";
import { useNavigate, useParams, useSearchParams, Link, useLocation } from "react-router-dom";
import { Calendar, Clock, ArrowRight, MapPin, Briefcase, Search, ChevronDown, Loader, CalendarDays } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DriveProcess from "../industries/components/DriveProcess";
import AcknowledgementTab from "./components/AcknowledgementTab";
import { useEffect, useState, useMemo, useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcnTooltip";
import { toast } from "sonner";
import { formatedApiDate } from "@/utils/dateFormat";
import { usePackageAccessCounts } from "@/hooks/data/usePackageAccessCounts";
import { useSessionUser } from "@/store/authStore";
import { INDUSTRY } from '@/constants/roles.constant';
import { mixpanelService } from "@/services/mixpanel/MixpanelService";



const getBadgeColor = (type: string) => {
  switch (type) {
    case 'Creators Meetups':
    case 'Community Meetups':
      return 'bg-codeblue';
    case 'Flagship Events':
      return 'bg-codepink';
    case 'Career Drive':
      return 'bg-codegreen';
    case 'Immersion Program':
      return 'bg-codeblue';
    default:
      return 'bg-codepink';
  }
};

export default function MustAttendCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string>("Creators Meetups");
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: eventdetails, isLoading } = useEventById(id, searchParams.get('category') || undefined);
  const { data: participatingIndustries, isLoading: isIndustriesLoading } = useEventParticipatingIndustries(id);
  const { data: eventJobs, isLoading: isJobsLoading } = useEventJobs(id);
  const applyMutation = useEventApply();
  const { isAccessExhausted } = usePackageAccessCounts();
  const { data: assignedEvents } = useAssignedEvents();

  const isAssigned = Boolean(eventdetails?.is_assigned) || assignedEvents?.some(e => String(e.id) === String(id));

  const [searchTerm, setSearchTerm] = useState("");
  const [industrySearchTerm, setIndustrySearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [appliedFilter, setAppliedFilter] = useState<"all" | "applied" | "non-applied" | "expired">("all");
  const currentTab = searchParams.get('tab') || 'overview';

  const isIndustry = useSessionUser((state) => state.user?.authority?.includes(INDUSTRY));
  const mecRegdId = useSessionUser((state) => state.user?.mec_regd_id) || localStorage.getItem('mec_regd_id');

  const sortedParticipatingIndustries = useMemo(() => {
    if (!participatingIndustries) return [];

    const uniqueMap = new Map<any, typeof participatingIndustries[0]>();
    participatingIndustries.forEach(industry => {
      const key = industry.id;
      if (uniqueMap.has(key)) {
        const existing = uniqueMap.get(key)!;
        if (industry.program && (!existing.program || !existing.program.includes(industry.program))) {
          existing.program = (existing.program ? existing.program + ', ' : '') + industry.program;
        }
      } else {
        uniqueMap.set(key, { ...industry });
      }
    });

    let list = Array.from(uniqueMap.values());

    if (industrySearchTerm) {
      list = list.filter((industry) => industry.name?.toLowerCase().includes(industrySearchTerm.toLowerCase()));
    }

    if (mecRegdId) {
      const cleanRegdId = mecRegdId.trim().toLowerCase();
      list = list.sort((a, b) => {
        const aMatch = (a.program && a.program.toLowerCase().includes(cleanRegdId)) ? 1 : 0;
        const bMatch = (b.program && b.program.toLowerCase().includes(cleanRegdId)) ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return list;
  }, [participatingIndustries, industrySearchTerm, mecRegdId]);

  const handleTabChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', value);
      return newParams;
    }, { replace: true });
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  const displayCategory = category || '';

  const location = useLocation();
  const handleApply = () => {
    if (!id) {
      toast.error("Event ID is missing");
      return;
    }

    applyMutation.mutate({ eventId: id, eventType: searchParams.get('category') || undefined }, {
      onSuccess: async () => {
        toast.success("Successfully applied for the Event!");
        await useEventById(id);

      },
      onError: (error: Error) => {
        toast.error(error?.message || "Failed to apply for Event. Please try again.");
      },
    });
  };

  const uniqueDomains = useMemo(() => {
    if (!eventJobs) return [];
    const domains = eventJobs
      .flatMap(job => {
        if (typeof job.skill_names === 'string') {
          return job.skill_names.split(',').map(s => s.trim()).filter(Boolean);
        }
        return Array.isArray(job.skill_names) ? job.skill_names : [];
      })
      .filter((domain): domain is string => !!domain);
    return Array.from(new Set(domains));
  }, [eventJobs]);

  const filteredJobs = useMemo(() => {
    if (!eventJobs) return [];

    const uniqueMap = new Map<number, typeof eventJobs[0]>();
    eventJobs.forEach(job => {
      const key = (job as any).job_id || job.id;
      if (uniqueMap.has(key)) {
        const existing = uniqueMap.get(key)!;
        if (job.program && (!existing.program || !existing.program.includes(job.program))) {
          existing.program = (existing.program ? existing.program + ', ' : '') + job.program;
        }
      } else {
        uniqueMap.set(key, { ...job });
      }
    });

    const uniqueJobsList = Array.from(uniqueMap.values());

    let list = uniqueJobsList.filter(job => {
      const skillsArray = typeof job.skill_names === 'string' ? job.skill_names.split(',').map((s: string) => s.trim()) : (Array.isArray(job.skill_names) ? job.skill_names : []);
      const matchesSearch = !searchTerm ||
        job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skillsArray.some((skill: string) => skill?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDomain = selectedDomain === "all" || skillsArray.includes(selectedDomain);
      const isApplied = (job as any).is_applied === true ||
        (job as any).is_applied === 1 ||
        (job as any).is_applied === "1" ||
        job.job_status === "Applied" ||
        job.job_status_numeric === 1;
      const isExpired = job.end_date ? new Date(job.end_date) < new Date() : false;
      const matchesApplied = appliedFilter === "all" ||
        (appliedFilter === "applied" && isApplied) ||
        (appliedFilter === "non-applied" && !isApplied && !isExpired) ||
        (appliedFilter === "expired" && isExpired);

      return matchesSearch && matchesDomain && matchesApplied;
    });

    if (mecRegdId) {
      const cleanRegdId = mecRegdId.trim().toLowerCase();
      list = list.sort((a, b) => {
        const aMatch = (a.program && a.program.toLowerCase().includes(cleanRegdId)) ? 1 : 0;
        const bMatch = (b.program && b.program.toLowerCase().includes(cleanRegdId)) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return list;
  }, [eventJobs, searchTerm, selectedDomain, appliedFilter, mecRegdId]);

  const trackedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    const eventName = eventdetails?.competitions_details?.program?.name;
    if (eventName && trackedEventIdRef.current !== id) {
      mixpanelService.track(`Collaborate Must Attend :- ${eventName} => Detail Page Viewed`, {
        event_id: id,
        category: category,
        timestamp: new Date().toISOString()
      });
      trackedEventIdRef.current = id || null;
    }
  }, [eventdetails?.competitions_details?.program?.name, category, id]);

  if (isLoading) return <LoadingSection isLoading={isLoading} title="Loading event details..." description="please wait ....." />;
  const event = eventdetails?.competitions_details?.program;
  const instructions = eventdetails?.competition_instructions;
  const skills = eventdetails?.job_skill_details.all_program_skills;
  const expert = eventdetails?.expert;
  const isDisabled = Boolean(eventdetails?.is_assigned) || applyMutation.isPending;
  const isMasterAccessExhausted = isAccessExhausted(category.toLowerCase().replace(/\s+/g, '_')) || isAccessExhausted(category.toLowerCase().replace(/\s+/g, '-'));
  // const isMasterAccessExhausted = 1;

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
    { label: 'Must Attend List', path: '/collaborate/must-attend-list' },
    { label: 'Must Attend', path: '/collaborate/must-attend' },
    {
      label: displayCategory,
      path: `/collaborate/must-attend?category=${category}`
    },
    { label: event?.name || 'Event Details' },

  ];

  return (
    <div className="flex flex-col space-y-6">
      <Breadcrumb items={breadcrumbItems} className="[&>ol>li:last-child]:hidden [&>ol>li:nth-last-child(2)]:hidden md:[&>ol>li:last-child]:inline-flex md:[&>ol>li:nth-last-child(2)]:flex" />
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6">
        {/* Mobile Banner */}
        <div className="md:hidden relative w-full bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800">
          <img
            src={event?.image}
            alt={event?.name}
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event?.name.toString() ?? '');
            }}
          />
          <span
            className={`absolute top-0 right-0 px-4 py-2 text-white text-sm font-semibold rounded-bl-xl ${getBadgeColor(category)}`}
          >
            {displayCategory}
          </span>
        </div>

        {/* Desktop Banner */}
        <div className="hidden md:block md:col-span-7 relative h-96 rounded-3xl overflow-hidden border border-gray-800 bg-[#1a1a1a]">
          <img src={event?.image} alt={event?.name} className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event?.name.toString() ?? '');
            }}
          />
          <span
            className={`absolute top-0 right-0 px-6 py-2 text-white text-sm font-semibold rounded-bl-2xl ${getBadgeColor(category)}`}
          >
            {displayCategory}
          </span>
        </div>
        <Card className="md:col-span-3 flex flex-col justify-between bg-[#1a1a1a]">
          <CardContent className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {event?.name ?? 'Event Details'}
            </h1>
            {event?.event_details?.functional_domain && <p className="text-gray-300 text-sm">Domain: {event?.event_details?.functional_domain ?? '-'}</p>}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#4A9EFF]" />
                <p className="text-white text-sm">
                  <span className="text-[#7fbc42] font-semibold">
                    Registration Date:
                  </span>{' '}
                  <strong>
                    {formatedApiDate(event?.start_date ?? '')} –{' '}
                    {formatedApiDate(event?.end_date ?? '')}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#4A9EFF]" />
                <p className="text-white text-sm">
                  Event Date : <span className="font-bold">{formatDate(event?.event_details?.event_datetime ?? '', 'MMM DD, YYYY hh:mm A')}</span>
                </p>
              </div>

              {isPastEvent(event?.end_date ?? '') && (
                <div className="flex items-center gap-2 bg-slate-500/10 border border-slate-400/30 rounded-lg px-3 py-2 mt-1">
                  <p className="text-slate-200 text-center text-sm font-medium">This event has ended.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            {!isPastEvent(event?.end_date ?? '') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`bg-[#7fbc42] w-full md:w-[155px] h-auto min-h-[60px] md:h-[90px]
                      ${(() => {
                          const safeCategory = (category || '').toLowerCase();
                          const isJoinable = safeCategory === "flagship events" || safeCategory === "creators meetup" || safeCategory === "encode" || safeCategory === "creators meetups";
                          if (applyMutation.isPending) return 'opacity-70 cursor-not-allowed';
                          if (isAssigned) {
                            if (isJoinable) {
                              return !isStarted(event?.event_details?.event_datetime ?? event?.start_date ?? '') ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6da538] cursor-pointer';
                            }
                            return 'opacity-70 cursor-default'; // Registered state for others
                          }
                          return isMasterAccessExhausted ? 'cursor-not-allowed opacity-80' : 'hover:bg-[#6da538] cursor-pointer'; // Register Now state
                        })()}
                      text-[#1a1a1a] font-bold
                      px-4 py-3 md:py-6 rounded-lg
                      text-base shadow-lg
                      transition-all
                      flex flex-col items-center justify-center gap-1`}
                      title={!eventdetails?.is_assigned && isMasterAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                      onClick={() => {
                        if (applyMutation.isPending) return;
                        const safeCategory = (category || '').toLowerCase();
                        const isJoinable = safeCategory === "flagship events" || safeCategory === "creators meetup" || safeCategory === "encode" || safeCategory === "creators meetups";
                        if (isAssigned) {
                          if (isJoinable) {
                            if (!isStarted(event?.event_details?.event_datetime ?? event?.start_date ?? '')) {
                              toast.error("Class is not started yet");
                              return;
                            }
                            const zoomTask = (event?.contents ?? []).find((t: any) => t.content_type?.toLowerCase() === 'zoomclass');
                            if (zoomTask?.id) {
                              navigate(`/zoom/meeting/collaborate/${zoomTask.id}`);
                              return;
                            }
                            // Navigate to Activities tab as fallback
                            handleTabChange('activities');
                            // Scroll to tabs section
                            setTimeout(() => {
                              tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }
                          // If not joinable, do nothing (Registered state)
                        } else {
                          if (isMasterAccessExhausted) {
                            toast.error('You have reached the maximum limit available under your current package.');
                            return;
                          }
                          handleApply();
                        }
                      }}
                    >
                      {applyMutation.isPending ? (
                        <Loader className="animate-spin" size={24} />
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          <span>
                            {isAssigned ? (
                              (() => {
                                const safeCategory = (category || '').toLowerCase();
                                const isJoinable = safeCategory === "flagship events" || safeCategory === "creators meetup" || safeCategory === "encode" || safeCategory === "creators meetups";
                                return isJoinable ? "Join Now" : "Registered";
                              })()
                            ) : "Register Now"}
                          </span>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>

                </Tooltip>
              </TooltipProvider>
            )}
          </CardFooter>
        </Card>
      </div>
      {/* <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 py-10 px-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center relative">
            <p className="text-gray-400 text-sm mb-3">Location</p>
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
          <Tabs defaultValue="overview" value={currentTab} className="w-full" onValueChange={handleTabChange}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto grid grid-cols-2 w-full md:w-fit md:flex md:justify-start divide-x divide-gray-400">
                <TabsTrigger
                  value="overview"
                  className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                >
                  Overview
                </TabsTrigger>
                {
                  (category === 'Creators Meetups' || category === 'Flagship Events' || category === 'Creators Meetup' || category === 'enCODE') && (
                    <TabsTrigger
                      value="activities"
                      className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                    >
                      Activities
                    </TabsTrigger>
                  )
                }
                {
                  eventdetails?.competitions_details?.program?.event_details?.event_category_id == '2' ? <>
                    <TabsTrigger
                      value="industries_participating"
                      className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                    >
                      Industries Participating
                    </TabsTrigger>
                    <TabsTrigger
                      value="jobs_internships"
                      className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                    >
                      Jobs/Internships
                    </TabsTrigger>
                    {!isIndustry && (
                      <>
                        <TabsTrigger
                          value="drive_process"
                          className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                        >
                          Drive Process
                        </TabsTrigger>
                        <TabsTrigger
                          value="acknowledgement"
                          className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                        >
                          Acknowledgement
                        </TabsTrigger>
                      </>
                    )}
                  </> :
                    <>
                      <TabsTrigger
                        value="expert"
                        className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                      >
                        Expert Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="certificate"
                        className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-5"
                      >
                        Certificate
                      </TabsTrigger>
                    </>
                }
              </TabsList>
              {currentTab === 'industries_participating' && (
                <div className="bg-[#3a3a3a] border border-gray-600 rounded-xl px-4 py-2.5 flex items-center gap-2 text-gray-300 text-sm w-full md:w-[280px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Industries..."
                    value={industrySearchTerm}
                    onChange={(e) => setIndustrySearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                  />
                </div>
              )}
            </div>
            <TabsContent value="overview" className="space-y-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">About Event</h3>
                <div className="text-gray-300 leading-relaxed text-base">
                  <SafeHtml html={event?.description ?? 'No description available'} className="dark:prose-p:!bg-transparent dark:prose-strong:!bg-transparent dark:prose-ul:!bg-transparent" />
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
              {!eventdetails?.is_assigned ? (
                <Card className="py-0 bg-[#2a2a2a] border-gray-700 shadow-none">
                  <CardContent className="px-6 py-6 text-white/80">
                    Register to unlock activities for this {category.toLowerCase()}.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(event?.contents ?? []).map((task: any) => {
                    const isExpiredEvent = isPastEvent(event?.end_date ?? '');
                    const isExpiredTask = task?.end_date ? isPastEvent(task.end_date) : false;
                    const isExpiredZoom = task.content_type?.toLowerCase() === 'zoomclass' && (isExpiredEvent || isExpiredTask);

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
                          </div>

                          <div className="flex justify-end">
                            {isExpiredZoom ? (
                              <button
                                type="button"
                                disabled
                                className="w-[120px] h-[95px] bg-[#5a5a5a] rounded-xl text-[#cfcfcf] font-semibold flex flex-col items-center justify-center gap-2 cursor-not-allowed"
                              >
                                <ArrowRight size={20} />
                                <span className="leading-snug text-center">
                                  Event
                                  <br />
                                  Ended
                                </span>
                              </button>
                            ) : (
                              <Link to={task.content_type?.toLowerCase() === 'zoomclass' ? `/zoom/meeting/collaborate/${task.id}` : `/details/${id}/event-activity/${task.id}?category=${encodeURIComponent(category)}`}>
                                <button
                                  type="button"
                                  className="w-[120px] h-[95px] bg-[#7fbc42] rounded-xl text-black font-semibold flex flex-col items-center justify-center gap-2 hover:brightness-95"
                                >
                                  <ArrowRight size={20} />
                                  {task.content_type?.toLowerCase() === 'zoomclass' ? <span className="leading-snug text-center">
                                    Join
                                    <br />
                                    Now
                                  </span> : <span className="leading-snug text-center">
                                    Start
                                    <br />
                                    Now
                                  </span>}
                                </button>
                              </Link>
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
                <h3 className="text-2xl font-bold text-white mb-6">Certificate Information</h3>
                <div className="text-gray-300 leading-relaxed text-base">
                  <p>Details about the certificate will be available soon.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="industries_participating" className="space-y-8">
              <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedParticipatingIndustries.map((industry) => (
                    <Card key={industry.id} className="flex flex-col min-h-[320px] bg-[#323232] border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden p-0 group">
                      <div className="h-48 w-full bg-white flex items-center justify-center shrink-0 p-6">
                        <img
                          src={industry.thumbnail}
                          alt={industry.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <CardContent className="flex items-center gap-4 pt-5 shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8cc63f]/10">
                          <Briefcase className="h-4 w-4 text-[#8cc63f]" />
                        </div>
                        <h5 className="text-[20px] font-semibold text-white leading-snug line-clamp-2">
                          {industry.name}
                        </h5>
                      </CardContent>

                      <CardFooter className="mt-auto flex items-end justify-between gap-4 pb-6 shrink-0">
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 max-w-[70%]">
                          {industry.description || `Explore opportunities with ${industry.name}`}
                        </p>

                        <Button
                          className="w-[90px] h-[64px] rounded-[10px] bg-[#8cc63f] hover:bg-[#8cc63f]/90 text-black shadow-md flex flex-col items-center justify-center gap-1 p-2 shrink-0"
                          onClick={() => navigate(`/collaborate/industries/${industry.organization_id}`, {
                            state: {
                              from: location.pathname + location.search,
                              breadcrumbLabel: event?.name,
                              industryId: industry.id,
                              type: 'must-attend'
                            }
                          })}
                        >
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          <span className="text-xs font-medium leading-tight text-center">
                            View <br /> Profile
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(!participatingIndustries || participatingIndustries.length === 0) && !isIndustriesLoading && (
                    <div className="col-span-full text-center py-20 bg-[#2a2a2a] rounded-3xl border border-dashed border-gray-700">
                      <p className="text-gray-500 text-lg">No industries participating found</p>
                    </div>
                  )}

                  {isIndustriesLoading && (
                    <div className="col-span-full flex justify-center py-20">
                      <LoadingSection isLoading={true} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drive_process" className="space-y-8">
              <DriveProcess />
            </TabsContent>

            <TabsContent value="jobs_internships" className="space-y-8">
              <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-white">
                      Available Jobs

                    </h3>
                    <span className="text-primary  text-base font-bold rounded-full">
                      ({filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {/* Skill Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-2.5 flex items-center gap-2 text-white text-sm cursor-pointer min-w-[180px] hover:bg-[#333333] transition-colors">
                          <span className="flex-1">
                            {selectedDomain === "all" ? "Filter by Skill" : selectedDomain}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#2a2a2a] border-gray-700 min-w-[180px]">
                        <DropdownMenuItem
                          className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                          onClick={() => setSelectedDomain("all")}
                        >
                          All Skills
                        </DropdownMenuItem>
                        {uniqueDomains.map((domain) => (
                          <DropdownMenuItem
                            key={domain}
                            className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                            onClick={() => setSelectedDomain(domain)}
                          >
                            {domain}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Applied Status Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-2.5 flex items-center gap-2 text-white text-sm cursor-pointer min-w-[160px] hover:bg-[#333333] transition-colors">
                          <span className="flex-1 capitalize">
                            {appliedFilter === "all" ? "All Jobs" : appliedFilter === "applied" ? "Applied" : appliedFilter === "expired" ? "Expired" : "Not Applied"}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#2a2a2a] border-gray-700 min-w-[160px]">
                        <DropdownMenuItem
                          className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                          onClick={() => setAppliedFilter("all")}
                        >
                          All Jobs
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                          onClick={() => setAppliedFilter("applied")}
                        >
                          Applied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                          onClick={() => setAppliedFilter("non-applied")}
                        >
                          Not Applied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white cursor-pointer hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                          onClick={() => setAppliedFilter("expired")}
                        >
                          Expired
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Search Bar */}
                    <div className="bg-[#3a3a3a] border border-gray-600 rounded-xl px-4 py-2.5 flex items-center gap-2 text-gray-300 text-sm flex-1 md:min-w-[280px]">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by company, job title or skill"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredJobs?.map((job) => (
                    <Card key={job.id} className="py-0 bg-[#262626] border-[#3a3a3a] shadow-none h-full flex flex-col">
                      <CardContent className="px-6 py-6 flex flex-col h-full">
                        <div
                          className="flex items-start gap-3 cursor-pointer group"
                          onClick={() => {
                            navigate(`/internship/${job.id}`, {
                              state: {
                                from: location.pathname + location.search,
                                breadcrumbLabel: event?.name,
                                jobId: job.id,
                                type: 'must-attend'
                              }
                            });
                          }}
                        >
                          <div className="min-w-[96px] max-w-[96px] h-[96px] rounded-xl overflow-hidden border border-[#3a3a3a] bg-white flex items-center justify-center">
                            <img
                              src={job?.company_logo ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company_name ?? "Company")}`}
                              alt={job?.company_name ?? "Company Logo"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            <h3 className="text-xl font-semibold text-primary leading-tight line-clamp-1 group-hover:underline">
                              {job?.name}
                            </h3>
                            <p className="text-sm text-white/90 line-clamp-1">
                              {job?.company_name}
                            </p>
                            {job?.location ? (
                              <div className="flex items-center gap-2 text-white/80">
                                <MapPin size={18} />
                                <span className="text-sm capitalize line-clamp-1">
                                  {job.location}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between gap-4 flex-1">
                          <div className="flex flex-col gap-2 justify-between flex-1">
                            <div className="flex flex-col gap-3">
                              {job?.experience ? (
                                <div className="flex items-center gap-2">
                                  <Briefcase size={18} className="text-[#7A7A7A]" />
                                  <span className="text-sm text-white/90 capitalize">
                                    {job.experience ? job.experience.replace(/\.00/g, '').replace(/\s*-\s*/g, '-').replace(/\s*y(?:ears?)?/i, ' year') : ''}
                                  </span>
                                </div>
                              ) : null}

                              {job?.job_type ? (
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none" aria-hidden="true">
                                    <path d="M4.425 6.55L8.15 0.475C8.25 0.308333 8.375 0.1875 8.525 0.1125C8.675 0.0375 8.83333 0 9 0C9.16667 0 9.325 0.0375 9.475 0.1125C9.625 0.1875 9.75 0.308333 9.85 0.475L13.575 6.55C13.675 6.71667 13.725 6.89167 13.725 7.075C13.725 7.25833 13.6833 7.425 13.6 7.575C13.5167 7.725 13.4 7.84583 13.25 7.9375C13.1 8.02917 12.925 8.075 12.725 8.075H5.275C5.075 8.075 4.9 8.02917 4.75 7.9375C4.6 7.84583 4.48333 7.725 4.4 7.575C4.31667 7.425 4.275 7.25833 4.275 7.075C4.275 6.89167 4.325 6.71667 4.425 6.55ZM14.5 19.075C13.25 19.075 12.1875 18.6375 11.3125 17.7625C10.4375 16.8875 10 15.825 10 14.575C10 13.325 10.4375 12.2625 11.3125 11.3875C12.1875 10.5125 13.25 10.075 14.5 10.075C15.75 10.075 16.8125 10.5125 17.6875 11.3875C18.5625 12.2625 19 13.325 19 14.575C19 15.825 18.5625 16.8875 17.6875 17.7625C16.8125 18.6375 15.75 19.075 14.5 19.075ZM0 17.575V11.575C0 11.2917 0.0958333 11.0542 0.2875 10.8625C0.479167 10.6708 0.716667 10.575 1 10.575H7C7.28333 10.575 7.52083 10.6708 7.7125 10.8625C7.90417 11.0542 8 11.2917 8 11.575V17.575C8 17.8583 7.90417 18.0958 7.7125 18.2875C7.52083 18.4792 7.28333 18.575 7 18.575H1C0.716667 18.575 0.479167 18.4792 0.2875 18.2875C0.0958333 18.0958 0 17.8583 0 17.575Z" fill="#7A7A7A" />
                                  </svg>
                                  <span className="text-sm text-white/90 capitalize">
                                    {job.job_type}
                                  </span>
                                </div>
                              ) : null}

                              {job?.created_at ? (
                                <p className="text-sm text-white/80">Posted On: {formatDate(job.created_at, 'MMM DD, YYYY')}</p>
                              ) : null}
                            </div>
                            <div>
                              {job.skill_names ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {(() => {
                                    const skills = (typeof job.skill_names === 'string' ? job.skill_names.split(',').map(s => s.trim()) : (Array.isArray(job.skill_names) ? job.skill_names : [])).filter(Boolean);
                                    const visibleSkills = skills.slice(0, 3);
                                    const extraCount = skills.length - 3;
                                    return (
                                      <>
                                        {visibleSkills.map((skill: string, index: number) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="border-primary text-white/90 rounded-full px-3 py-1 bg-transparent"
                                          >
                                            {skill}
                                          </Badge>
                                        ))}
                                        {/* {extraCount > 0 && (
                                          <Badge
                                            variant="outline"
                                            className="border-primary text-white/90 rounded-full px-3 py-1 bg-transparent"
                                          >
                                            +{extraCount}
                                          </Badge>
                                        )} */}
                                      </>
                                    );
                                  })()}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <Button
                              asChild
                              variant="secondary"
                              className="bg-[#5A5A5A] text-primary hover:bg-[#6a6a6a] h-[50px] w-[50px]"
                              aria-label="Save"
                              type="button"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="26" viewBox="0 0 22 26" fill="none">
                                <path d="M11 22.9704L4.4 25.7268C3.35238 26.1607 2.35714 26.0777 1.41429 25.478C0.471429 24.8782 0 24.0296 0 22.9321V3.06272C0 2.22047 0.307738 1.49945 0.923214 0.899673C1.53869 0.299891 2.27857 0 3.14286 0H18.8571C19.7214 0 20.4613 0.299891 21.0768 0.899673C21.6923 1.49945 22 2.22047 22 3.06272V22.9321C22 24.0296 21.5286 24.8782 20.5857 25.478C19.6429 26.0777 18.6476 26.1607 17.6 25.7268L11 22.9704ZM11 19.6014L18.8571 22.8938V3.06272H3.14286V22.8938L11 19.6014Z" fill="#7FBC42" />
                              </svg>
                            </Button>
                            <div
                              className={`w-[140px] h-[108px] bg-primary rounded-xl flex flex-col justify-center items-center mt-4 text-black gap-2 select-none transition-colors ${job.job_status_numeric === 1
                                ? 'opacity-70 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-[#6da538]'
                                }`}
                              role="button"
                              onClick={() => {
                                if (job.job_status_numeric === 1) return; // Disabled if applied
                                navigate(`/internship/${job.id}`, {
                                  state: {
                                    from: location.pathname + location.search,
                                    breadcrumbLabel: event?.name,
                                    jobId: job.id,
                                    type: 'must-attend'
                                  }
                                });
                              }}
                            >
                              <ArrowRight size={20} />
                              {job.job_status_numeric === 1 ? (
                                <p className="text-center leading-snug font-bold">
                                  Applied
                                </p>
                              ) : job.end_date && new Date(job.end_date) < new Date() ? (
                                <p className="text-center leading-snug font-bold">
                                  View
                                  <br />
                                  Details
                                </p>
                              ) : (
                                <p className="text-center leading-snug font-bold">
                                  Apply
                                  <br />
                                  Now
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {(!filteredJobs || filteredJobs.length === 0) && !isJobsLoading && (
                    <div className="col-span-full text-center py-20 bg-[#2a2a2a] rounded-3xl border border-dashed border-gray-700">
                      <p className="text-gray-500 text-lg">
                        {searchTerm || selectedDomain !== "all" || appliedFilter !== "all"
                          ? "No jobs found matching your filters."
                          : "No jobs or internships available at this moment."}
                      </p>
                    </div>
                  )}

                  {isJobsLoading && (
                    <div className="col-span-full flex justify-center py-20">
                      <LoadingSection isLoading={true} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="acknowledgement" className="mt-0 outline-none p-6">
              <AcknowledgementTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div >
  );
}