import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Video,
    Users,
    GraduationCap,
    Box,
    Sparkles,
    Calendar,
    TrendingUp,
    Megaphone,
    HelpCircle,
    Palette,
    Handshake,
    Briefcase,
    Wrench,
    Award,
    Trophy,
    FolderOpen,
    Rocket,
    GraduationCap as ImmersionIcon,
    MessageCircleQuestion
} from 'lucide-react';
import { useCourseStatCounts, useMyCourses, useCourse, useCourseModuleDetails } from '@/hooks/data/create/useCourses';
import { usePromotions } from '@/hooks/data/usePromotions';
import { useMyMentors, useRecommendedMentors, useMentors, useIndustriesMentors } from '@/hooks/data/create/useMentor';
import { useLiveClasses } from '@/hooks/data/create/useSessions';
import { useResource } from '@/hooks/data/create/useResource';
import { useAnnouncements } from '@/hooks/data/create/useAnnouncement';
import { useEvents, useEventCategories } from '@/hooks/data/collaborate/useEvents';
import { usePublishedJobs } from '@/views/learner/@hooks/useJobs';
import { useInFocus } from '@/hooks/data/collaborate/useFocus';
import { useQuery } from '@tanstack/react-query';
import { fetchAllCalendarSessions } from '@/views/create/old_calendar/services/CalendarService';
import { isToday, isAfter, format } from 'date-fns';
import moment from 'moment';
import { Message } from './types';
import { ChatHeader } from './parts/ChatHeader';
import { MessageList } from './parts/MessageList';
import { QuickActions } from './parts/QuickActions';
import { ChatInput } from './parts/ChatInput';
// 🚀 ~ Google Analytics: Import chatbot analytics hook
import { useChatbotAnalytics } from '@/hooks/useChatbotAnalytics';

const EnBoatChatbot = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm EduBot AI, your academic assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const messageListContainerRef = useRef<HTMLDivElement | null>(null);
    const lastShownCourseDetailId = useRef<string | null>(null);
    const lastShownModuleDetailId = useRef<string | null>(null);
    const courseSuggestionUserMsgRef = useRef<Message | null>(null);

    // 🚀 ~ Google Analytics: Initialize chatbot analytics tracking
    const {
        trackUserMessage,
        trackBotResponse,
        trackQuickAction,
        trackCourseSelection,
        trackModuleSelection,
        trackMentorSelection,
    } = useChatbotAnalytics();

    // Existing hooks
    const { data: myCourses } = useMyCourses();
    const { data: stats } = useCourseStatCounts('yearly');
    const { data: liveClasses } = useLiveClasses();
    const { data: courseDetail } = useCourse(selectedCourseId || undefined);
    const { data: moduleDetail } = useCourseModuleDetails(selectedModuleId || undefined);
    const { data: mentorsList } = useMyMentors();
    const { data: recommendedMentors } = useRecommendedMentors();
    const { data: allMentors } = useMentors();
    const { data: industryMentors } = useIndustriesMentors();
    const { data: spotlightMentors = [] } = usePromotions('mentor');
    const { data: allResources, isLoading: isResourcesLoading } = useResource();

    // New hooks for missing features
    const { data: announcements = [] } = useAnnouncements();
    const { data: trendingCourses = [] } = usePromotions('course');

    // Calendar data - today's events
    const todayParams = useMemo(() => {
        const params = new URLSearchParams();
        params.set('ongoing_date', moment().format('YYYY-MM-DD'));
        params.set('is_assigned', '1');
        return params;
    }, []);
    const { data: calendarEvents = [] } = useEvents(todayParams);


    // Calendar sessions for current month
    const currentMonth = moment().format('YYYY-MM');
    const { data: calendarSessionsData } = useQuery({
        queryKey: ['chatbot-calendar-sessions', currentMonth],
        queryFn: () => fetchAllCalendarSessions(currentMonth)
    });

    // ──────── Collaborate Hooks ────────
    // Jobs/Internships - actual published job listings (same API as Collaborate > Opportunities page)
    const { data: publishedJobs = [] } = usePublishedJobs();
    const jobs = publishedJobs.filter((op) => op.is_job === 1 && op.is_published === 1);
    const internships = publishedJobs.filter((op) => op.is_job !== 1 && op.is_published === 1);

    // Portfolio/InFocus creators
    const { data: inFocusData = [] } = useInFocus();

    // Event Categories - used to dynamically resolve category IDs
    const { data: eventCategories = [] } = useEventCategories();

    // Agenda categories (Workshop, Masterclass, Industry Visits, etc.)
    const agendaCategories = useMemo(() => eventCategories.filter(cat => cat.group_name === 'On the Agenda'), [eventCategories]);
    // Must Attend categories (Career Drive, Immersion Program, etc.)
    const mustAttendCategories = useMemo(() => eventCategories.filter(cat => cat.group_name === 'Must Attend'), [eventCategories]);

    // Helper to get category ID from name
    const getCategoryId = (name: string) => {
        const cat = eventCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
        return cat?.id;
    };

    // Fetch events per category dynamically using category IDs
    const workshopCatId = useMemo(() => getCategoryId('Workshops'), [eventCategories]);
    const workshopParams = useMemo(() => {
        if (!workshopCatId) return null;
        const params = new URLSearchParams();
        params.set('event_category_id', workshopCatId.toString());
        return params;
    }, [workshopCatId]);
    const { data: workshopEvents = [] } = useEvents(workshopParams);

    const masterclassCatId = useMemo(() => getCategoryId('Masterclass'), [eventCategories]);
    const masterclassParams = useMemo(() => {
        if (!masterclassCatId) return null;
        const params = new URLSearchParams();
        params.set('event_category_id', masterclassCatId.toString());
        return params;
    }, [masterclassCatId]);
    const { data: masterclassEvents = [] } = useEvents(masterclassParams);

    const careerDriveCatId = useMemo(() => getCategoryId('Career Drive'), [eventCategories]);
    const careerDriveParams = useMemo(() => {
        if (!careerDriveCatId) return null;
        const params = new URLSearchParams();
        params.set('event_category_id', careerDriveCatId.toString());
        return params;
    }, [careerDriveCatId]);
    const { data: careerDriveEvents = [] } = useEvents(careerDriveParams);

    const immersionCatId = useMemo(() => getCategoryId('Immersion Program'), [eventCategories]);
    const immersionParams = useMemo(() => {
        if (!immersionCatId) return null;
        const params = new URLSearchParams();
        params.set('event_category_id', immersionCatId.toString());
        return params;
    }, [immersionCatId]);
    const { data: immersionEvents = [] } = useEvents(immersionParams);

    const competitionCatId = useMemo(() => getCategoryId('Competitions'), [eventCategories]);
    const competitionParams = useMemo(() => {
        if (!competitionCatId) return null;
        const params = new URLSearchParams();
        params.set('event_category_id', competitionCatId.toString());
        return params;
    }, [competitionCatId]);
    const { data: competitionEvents = [] } = useEvents(competitionParams);

    const actionGroups = [
        {
            id: 'create',
            label: 'Create',
            icon: Palette,
            color: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-indigo-500/20',
            actions: [
                { id: 'status', label: 'Enrollment Status', icon: GraduationCap },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'classes', label: 'Live Classes', icon: Video },
                { id: 'mentors', label: 'Mentors', icon: Users },
                { id: 'spotlight', label: 'Spotlight Mentors', icon: Sparkles },
                { id: 'slot-available', label: 'Slot Available', icon: Sparkles },
                { id: 'resources', label: 'Resource Hub', icon: Box },
                { id: 'calendar', label: 'Upcoming activities', icon: Calendar },
                { id: 'trending', label: 'Trending Courses', icon: TrendingUp },
                { id: 'announcements', label: 'Announcements', icon: Megaphone },
                { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
                { id: 'course-suggested', label: 'Suggest courses', icon: Sparkles },
            ]
        },
        {
            id: 'collaborate',
            label: 'Collaborate',
            icon: Handshake,
            color: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20',
            actions: [
                { id: 'jobs', label: 'Jobs/Internships', icon: Briefcase },
                { id: 'workshop', label: 'Workshop', icon: Wrench },
                { id: 'masterclass', label: 'Masterclass', icon: Award },
                { id: 'competitions', label: 'Competitions', icon: Trophy },
                { id: 'portfolio', label: 'My Portfolio', icon: FolderOpen },
                { id: 'career-drive', label: 'Career Drive', icon: Rocket },
                { id: 'immersion', label: 'Immersion Program', icon: GraduationCap },
                { id: 'queries', label: 'Queries', icon: MessageCircleQuestion },
            ]
        }
    ];

    const ruleBasedResponses: Record<string, any> = {
        'recommended': {
            text: "Based on your interest in React, I recommend these courses:",
            type: 'courses',
            data: [
                { id: 101, name: 'Next.js 14 Deep Dive', modules: '24 Modules', price: 'Free', rating: 4.8 },
                { id: 102, name: 'TypeScript for Pro Devs', modules: '15 Modules', price: 'Free', rating: 4.9 },
            ]
        },
        'resources': {
            text: "Here are the resource hubs available for your courses:",
            type: 'resources',
            data: [
                { id: 1, name: 'React Patterns Repo', type: 'GitHub', link: '#' },
                { id: 2, name: 'UI Design Assets', type: 'Figma', link: '#' },
                { id: 3, name: 'Node.js Docs v2', type: 'PDF', link: '#' },
            ]
        }
    };

    // Helper: get calendar sessions for a specific day
    const getCalendarSessionsForDay = (targetDate: moment.Moment) => {
        const eventSessions = calendarEvents
            .filter(event => event?.content_type === 'zoomclass' || event?.content_type === 'offlineclass' || event?.content_type === 'liveclass')
            .filter(session => {
                const endTime = moment.unix(Number(session.end_date));
                return endTime.isAfter(moment());
            });

        const calSessions = (calendarSessionsData?.data || [])
            .filter((event: any) => moment(event.start || event.start_date).isSame(targetDate, 'day'))
            .map((event: any) => ({
                id: event.id,
                name: event.title,
                start_date: event.start || event.start_date,
                end_date: event.end || event.end_date,
                content_type: 'calendar_session',
                link: event.link
            }))
            .filter((session: any) => {
                const endTime = moment(session.end_date);
                return endTime.isAfter(moment());
            });

        return [...eventSessions, ...calSessions].slice(0, 6);
    };

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // 🚀 ~ Google Analytics: Track user message/question
        trackUserMessage(text);

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            try {
                const lowerText = text.toLowerCase();
                let responseText = "I'm not sure about that. Try asking about your courses, live classes, mentors, calendar, trending courses, or announcements!";
                let responseType: Message['type'] = 'text';
                let responseData: any = null;

                // ─────────────────────────────────────────────
                // 1. ENROLLMENT STATUS & PROGRESS (Q1-Q5)
                // ─────────────────────────────────────────────
                if (lowerText.includes('status') || lowerText.includes('enrollment') || lowerText.includes('progress') || lowerText.includes('performance')) {
                    const enrolled = stats?.courses_enrolled?.count || 0;
                    const completed = stats?.completed_courses?.count || 0;
                    const progress = stats?.overall_progress?.count || 0;

                    responseText = `You are currently enrolled in ${enrolled} active courses. You have completed ${completed} courses. Your overall progress is ${progress}%.`;
                    responseType = 'status';
                    responseData = { progress, active: enrolled, completed };
                }
                // ─────────────────────────────────────────────
                // 2. MY COURSES (Q6-Q10)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('show detail') || lowerText.includes('details for') || lowerText.includes('tell me about module')) {
                    // Handle "Show details for <course name>" when user clicks a course card
                    if (myCourses && myCourses.length > 0) {
                        const matchedCourse = myCourses.find(c => lowerText.includes(c.name.toLowerCase()));
                        if (matchedCourse) {
                            const courseIdStr = matchedCourse.id.toString();
                            // Reset the ref so the useEffect will fire, even for the same course
                            lastShownCourseDetailId.current = null;
                            // If same course is already selected, briefly clear it to force re-trigger
                            if (selectedCourseId === courseIdStr) {
                                setSelectedCourseId(null);
                                setTimeout(() => setSelectedCourseId(courseIdStr), 50);
                            } else {
                                setSelectedCourseId(courseIdStr);
                            }
                            responseText = `Loading details for "${matchedCourse.name}"... One moment please!`;
                            responseType = 'text';
                        } else {
                            responseText = "I couldn't find that specific course. Here are your enrolled courses:";
                            responseType = 'courses';
                            responseData = myCourses.map(c => ({
                                id: c.id,
                                name: c.name,
                                modules: `${c.completion}% completed`,
                                progress: c.completion,
                                color: c.completion > 50 ? 'emerald' : 'indigo'
                            }));
                        }
                    } else {
                        responseText = "It looks like you haven't enrolled in any courses yet.";
                    }
                }
                else if (lowerText.includes('my course') || lowerText.includes('brand identity') || lowerText.includes('what courses am i') || lowerText.includes('course completion')) {
                    if (myCourses && myCourses.length > 0) {
                        const brandIdentityCourse = myCourses.find(c => c.name.toLowerCase().includes('brand identity'));

                        if (lowerText.includes('brand identity') && brandIdentityCourse) {
                            responseText = `I found your course: ${brandIdentityCourse.name}. You have completed ${brandIdentityCourse.completion}% of the content. It has ${brandIdentityCourse.course_meta_data?.duration || 'multiple'} modules.`;
                            responseType = 'courses';
                            responseData = [{
                                id: brandIdentityCourse.id,
                                name: brandIdentityCourse.name,
                                modules: `${brandIdentityCourse.completion}% completed`,
                                progress: brandIdentityCourse.completion,
                                color: 'indigo'
                            }];
                        } else {
                            responseText = `I've found your ${myCourses.length} registered course(s). You're doing great!`;
                            responseType = 'courses';
                            responseData = myCourses.map(c => ({
                                id: c.id,
                                name: c.name,
                                modules: `${c.completion}% completed`,
                                progress: c.completion,
                                color: c.completion > 50 ? 'emerald' : 'indigo'
                            }));
                        }
                    } else {
                        responseText = "It looks like you haven't enrolled in any courses yet. Check out our recommended courses!";
                    }
                }
                // ─────────────────────────────────────────────
                // 5. WEEKLY CALENDAR (Q21-Q26) — check before live classes since "session" overlaps
                // Includes "Upcoming activities" quick action (id: calendar)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('calendar') || lowerText.includes('week') || lowerText.includes('schedule') || lowerText.includes('join') || lowerText.includes('upcoming') || lowerText.includes('activities')) {
                    const todaySessions = getCalendarSessionsForDay(moment());

                    if (todaySessions.length > 0) {
                        responseText = `📅 Here's your calendar for today (${moment().format('MMM DD, YYYY')}). You have ${todaySessions.length} session(s) scheduled:`;
                        responseType = 'calendar';
                        responseData = todaySessions.map((s: any) => {
                            const isZoom = s.content_type === 'zoomclass';
                            const startDate = isZoom ? moment.unix(Number(s.from_date || s.start_date)) : moment(s.start_date);
                            const endDate = isZoom ? moment.unix(Number(s.end_date)) : moment(s.end_date);
                            const diffInMinutes = startDate.diff(moment(), 'minutes');
                            return {
                                id: s.id,
                                name: s.name,
                                startTime: startDate.format('hh:mm A'),
                                endTime: endDate.format('hh:mm A'),
                                type: s.content_type,
                                link: s.link || null,
                                canJoin: diffInMinutes <= 5,
                                date: 'Today'
                            };
                        });
                    } else {
                        responseText = "📅 No sessions are scheduled for today on your calendar. You can check Upcoming activities on the dashboard to see upcoming sessions.";
                    }
                }
                // ─────────────────────────────────────────────
                // 6. TRENDING COURSES (Q27-Q31)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('trending') || lowerText.includes('popular') || lowerText.includes('new course') || lowerText.includes('best course')) {
                    if (trendingCourses && trendingCourses.length > 0) {
                        responseText = `🔥 Here are the trending courses on the platform right now! We have ${trendingCourses.length} featured course(s):`;
                        responseType = 'trending-courses';
                        responseData = trendingCourses.slice(0, 5).map((course: any) => ({
                            id: course.id,
                            profileId: course?.profiles?.[0]?.id,
                            name: course?.profiles?.[0]?.name || 'Trending Course',
                            image: course?.profiles?.[0]?.image || null,
                        }));
                    } else {
                        responseText = "No trending courses are available at the moment. Check back later or explore our recommended courses!";
                    }
                }
                // ─────────────────────────────────────────────
                // 3. LIVE CLASSES & SESSIONS (Q11-Q15)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('class') || lowerText.includes('live') || lowerText.includes('session')) {
                    if (liveClasses && liveClasses.length > 0) {
                        const now = new Date();
                        const sortedSessions = [...liveClasses].sort((a, b) => a.starttime_ts - b.starttime_ts);
                        const todaySessions = sortedSessions.filter(c => isToday(new Date(c.starttime_ts * 1000)));
                        const upcomingSessions = sortedSessions.filter(c => isAfter(new Date(c.starttime_ts * 1000), now) && !isToday(new Date(c.starttime_ts * 1000)));

                        if (lowerText.includes('today')) {
                            if (todaySessions.length > 0) {
                                responseText = `Here are your live sessions for today (${format(now, 'MMM dd')}):`;
                                responseType = 'classes';
                                responseData = todaySessions.map(c => ({
                                    id: c.id,
                                    title: c.name,
                                    time: format(new Date(c.starttime_ts * 1000), 'hh:mm a'),
                                    date: 'Today',
                                    status: c.class_status === 'live' ? 'live' : 'upcoming',
                                    instructor: c.trainer_name || 'Instructor'
                                }));
                            } else {
                                responseText = "You have no live sessions scheduled for today.";
                            }
                        } else {
                            responseText = "Here are your live sessions for today and upcoming:";
                            responseType = 'classes';
                            responseData = [...todaySessions, ...upcomingSessions].slice(0, 4).map(c => ({
                                id: c.id,
                                title: c.name,
                                time: format(new Date(c.starttime_ts * 1000), 'hh:mm a'),
                                date: isToday(new Date(c.starttime_ts * 1000)) ? 'Today' : format(new Date(c.starttime_ts * 1000), 'MMM dd'),
                                status: c.class_status === 'live' ? 'live' : 'upcoming',
                                instructor: c.trainer_name || 'Instructor'
                            }));
                        }
                    } else {
                        responseText = "You don't have any live sessions scheduled at the moment.";
                    }
                }
                // ─────────────────────────────────────────────
                // 8. ANNOUNCEMENTS (Q37-Q41)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('announcement') || lowerText.includes('notice') || lowerText.includes('what\'s new') || lowerText.includes('latest update') || lowerText.includes('news')) {
                    if (announcements && announcements.length > 0) {
                        responseText = `📢 Here are the latest ${Math.min(announcements.length, 3)} announcement(s) from your institution:`;
                        responseType = 'announcements';
                        responseData = announcements.slice(0, 3).map((a: any) => ({
                            id: a.id,
                            title: a.title,
                            image: a.resource_path || null,
                            date: a.start_date && a.start_date > 0
                                ? new Date(a.start_date * 1000).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : null,
                        }));
                    } else {
                        responseText = "📢 No upcoming announcements found at the moment. Check back later!";
                    }
                }
                // ─────────────────────────────────────────────
                // 10a. COURSE SUGGESTION (API POST: suggest courses based on user query)
                // ─────────────────────────────────────────────
                else if (
                    lowerText.includes('suggest') || lowerText.includes('suggestion') ||
                    lowerText.includes('suggest course') || lowerText.includes('course suggest') ||
                    lowerText.includes('courses for') || lowerText.includes('course for') ||
                    lowerText.includes('what courses') || lowerText.includes('which course') ||
                    lowerText.includes('course of') || lowerText.includes('course on') ||
                    lowerText.includes('give me course') || lowerText.includes('get me course') ||
                    lowerText.includes('want course') || lowerText.includes('find course') || lowerText.includes('show me course')
                ) {
                    const query = text.trim() || 'courses';
                    courseSuggestionUserMsgRef.current = { id: `user-${Date.now()}`, text, sender: 'user' as const, timestamp: new Date() };
                    let deferTyping = false;
                    try {
                        deferTyping = true;
                        fetch('https://company-chatbot-project.vercel.app/api/search', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ query })
                        })
                            .then((res) => res.json())
                            .then((payload: any) => {
                                const list = payload?.courses ?? payload?.results ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
                                const courses = (Array.isArray(list) ? list : []).slice(0, 10);
                                const introText = (payload?.ai_message && courses.length > 0) ? payload.ai_message : (courses.length > 0 ? `Here are ${courses.length} course(s) suggested for your query.` : "I couldn't find any courses for that query. Try a different topic.");
                                const botMsg: Message = {
                                    id: (Date.now() + 1).toString(),
                                    text: introText,
                                    sender: 'bot',
                                    timestamp: new Date(),
                                    type: 'course-suggested',
                                    data: courses
                                };
                                setMessages(prev => {
                                    const last = prev[prev.length - 1];
                                    if (last?.sender === 'user' && last?.text) return [...prev, botMsg];
                                    const userMsg = courseSuggestionUserMsgRef.current;
                                    if (userMsg) return [...prev, userMsg, botMsg];
                                    return [...prev, botMsg];
                                });
                            })
                            .catch((err) => {
                                console.error('Course suggestion API error:', err);
                                const errorMsg: Message = {
                                    id: (Date.now() + 1).toString(),
                                    text: "Couldn't load course suggestions right now. Please try again later.",
                                    sender: 'bot',
                                    timestamp: new Date(),
                                    type: 'text'
                                };
                                setMessages(prev => [...prev, errorMsg]);
                            })
                            .finally(() => {
                                courseSuggestionUserMsgRef.current = null;
                                setIsTyping(false);
                            });
                    } finally {
                        if (!deferTyping) setIsTyping(false);
                    }
                    return;
                }
                // ─────────────────────────────────────────────
                // 10b. RECOMMENDED / EXPLORE (static response)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('recommended') || lowerText.includes('explore')) {
                    responseText = ruleBasedResponses.recommended.text;
                    responseType = ruleBasedResponses.recommended.type;
                    responseData = ruleBasedResponses.recommended.data;
                }
                // ─────────────────────────────────────────────
                // 4. MENTORS (Q16-Q20)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('slot available') || lowerText.includes('available slot') || lowerText.includes('slot mentor')) {
                    // Build a lookup from allMentors (rich profile data from profiles API) to enrich any mentor
                    const profileLookup = new Map<string, any>();
                    (allMentors || []).forEach(m => {
                        profileLookup.set(m.name?.toLowerCase(), {
                            role: m.profileSection?.about?.[0]?.current_role_head_line || m.role || '',
                            expertise: m.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise || '',
                            experience: m.profileSection?.about?.[0]?.years_of_exp || 0,
                            domain: m.profileSection?.about?.[0]?.domain || '',
                            profilePicture: m.profileSection?.basic_info?.[0]?.profilePicture || '',
                            uniqueIdentifier: m.uniqueIdentifier || '',
                            orgId: m.org_id || '',
                        });
                    });

                    const enrichMentor = (name: string, base: any) => {
                        const p = profileLookup.get(name?.toLowerCase()) || {};
                        return {
                            ...base,
                            // Profiles API data (current_role_head_line, profilePicture) takes priority
                            role: p.role || base.role || 'Mentor',
                            expertise: p.expertise || base.expertise || '',
                            experience: p.experience || base.experience || 0,
                            domain: p.domain || base.domain || '',
                            profilePicture: p.profilePicture || base.profilePicture || '',
                            uniqueIdentifier: p.uniqueIdentifier || base.uniqueIdentifier || '',
                            orgId: p.orgId || base.orgId || '',
                        };
                    };

                    // Combine all mentor sources to find those with available slots
                    const allSlotMentors = [
                        // Industry mentors from get-mentor-list-v2 API (primary source)
                        ...(industryMentors || []).filter(m => Number(m.slot_available) > 0).map(m => enrichMentor(m.name, {
                            id: m.id || m.name,
                            name: m.name,
                            rating: m.rating || null,
                            role: m.organization_name || '',
                            expertise: (m.skills || []).map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean).join(', '),
                            experience: 0,
                            domain: m.department_name || '',
                            profilePicture: m.org_logo || '',
                        })),
                        ...(mentorsList || []).filter(m => Number(m.slot_available) > 0).map(m => enrichMentor(m.name, {
                            id: m.id || m.name,
                            name: m.name,
                            rating: m.rating || null,
                            role: 'My Mentor',
                            expertise: '',
                            experience: 0,
                            domain: '',
                            profilePicture: '',
                        })),
                        ...(recommendedMentors || []).filter(m => Number(m.slot_available) > 0).map(m => enrichMentor(m.name, {
                            id: m.id || m.name,
                            name: m.name,
                            rating: m.rating || null,
                            role: 'Recommended Mentor',
                            expertise: '',
                            experience: 0,
                            domain: '',
                            profilePicture: '',
                        })),
                        ...(allMentors || []).filter(m => Number(m.slot_available) > 0).map(m => ({
                            id: m._id || m.name,
                            name: m.name,
                            rating: m.rating || null,
                            role: m.profileSection?.about?.[0]?.current_role_head_line || m.role || 'Mentor',
                            expertise: m.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise || '',
                            experience: m.profileSection?.about?.[0]?.years_of_exp || 0,
                            domain: m.profileSection?.about?.[0]?.domain || '',
                            profilePicture: m.profileSection?.basic_info?.[0]?.profilePicture || '',
                            uniqueIdentifier: m.uniqueIdentifier || '',
                            orgId: m.org_id || '',
                        })),
                    ];
                    // Deduplicate by name
                    const seen = new Set<string>();
                    const uniqueSlotMentors = allSlotMentors.filter(m => {
                        if (seen.has(m.name)) return false;
                        seen.add(m.name);
                        return true;
                    });

                    if (uniqueSlotMentors.length > 0) {
                        responseText = `Great news! ${uniqueSlotMentors.length} mentors have slots available right now:`;
                        responseType = 'slot-mentors';
                        responseData = uniqueSlotMentors;
                    } else {
                        responseText = "No mentors have available slots right now. Please check back later!";
                        responseType = 'text';
                    }
                }
                else if (lowerText.includes('mentor') && !lowerText.includes('spotlight') && !lowerText.includes('promoted') && !lowerText.includes('featured')) {
                    const myCount = mentorsList?.length || 0;
                    const recCount = recommendedMentors?.length || 0;
                    const exploreCount = allMentors?.length || 0;
                    // Count slots from all sources and deduplicate
                    const slotNames = new Set<string>();
                    [...(mentorsList || []), ...(recommendedMentors || []), ...(allMentors || [])]
                        .filter(m => Number(m.slot_available) > 0)
                        .forEach(m => slotNames.add(m.name));
                    const slotCount = slotNames.size;

                    responseText = `I've found ${myCount} of your mentors, ${recCount} recommended experts, and ${exploreCount} mentors available to explore.`;
                    responseType = 'mentors';
                    responseData = {
                        myCount,
                        recCount,
                        exploreCount,
                        slotCount,
                        hasSlots: [...(mentorsList || []), ...(recommendedMentors || [])].filter(m => Number(m.slot_available) > 0)
                    };
                }
                // ─────────────────────────────────────────────
                // 9. RESOURCE HUB (Q42-Q47)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('resource') || lowerText.includes('hub') || lowerText.includes('toolkit') || lowerText.includes('library') || lowerText.includes('shelf') || lowerText.includes('vault')) {
                    const resources = allResources || [];
                    if (isResourcesLoading) {
                        responseText = "I'm currently retrieving the latest data from your Resource Hub. Just a second...";
                        responseType = 'text';
                    } else if (resources.length === 0) {
                        responseText = "Your Resource Hub is currently empty. Resources will appear here as your institution adds them.";
                        responseType = 'text';
                    } else {
                        // Use r.type to match the actual API field (values: toolkits, reading-shelf, A/V Vault, creative library)
                        const getCount = (t: string) => resources.filter(r => r.type?.toLowerCase() === t.toLowerCase()).length;
                        const toolkitsCount = getCount('toolkits');
                        const creativeCount = getCount('creative library');
                        const readingCount = getCount('reading-shelf');
                        const avCount = getCount('A/V Vault');

                        let targetType = '';
                        if (lowerText.includes('toolkit')) targetType = 'toolkits';
                        else if (lowerText.includes('creative') || lowerText.includes('library')) targetType = 'creative library';
                        else if (lowerText.includes('reading') || lowerText.includes('shelf')) targetType = 'reading-shelf';
                        else if (lowerText.includes('vault') || lowerText.includes('a/v')) targetType = 'A/V Vault';

                        if (targetType) {
                            const typeItems = resources.filter(r => r.type?.toLowerCase() === targetType.toLowerCase());
                            const typeAdded = typeItems.filter(r => r.saved === 1).length;

                            responseText = `I've found ${typeItems.length} resources in the **${targetType}** type. You have added ${typeAdded} to your library. Here are some you might find useful:`;
                            responseType = 'resources';
                            responseData = {
                                totalCount: typeItems.length,
                                addedCount: typeAdded,
                                availableCount: typeItems.length - typeAdded,
                                categoriesCount: 1,
                                items: typeItems.slice(0, 3).map(r => ({
                                    id: r.id,
                                    name: r.name,
                                    type: r.type,
                                    subType: r.sub_type,
                                    category: r.category,
                                    link: r.official_url,
                                    isSaved: r.saved === 1
                                }))
                            };
                        } else {
                            const uniqueTypes = new Set(resources.map(r => r.type)).size;
                            const totalResources = resources.length;
                            const addedResources = resources.filter(r => r.saved === 1).length;

                            responseText = `Your Resource Hub currently has ${totalResources} assets across ${uniqueTypes} types:\n• Toolkits: ${toolkitsCount}\n• Creative Library: ${creativeCount}\n• Reading Shelf: ${readingCount}\n• A/V Vault: ${avCount}\nYou've added ${addedResources} items so far! What would you like to explore?`;

                            responseType = 'resources';
                            responseData = {
                                totalCount: totalResources,
                                categoriesCount: uniqueTypes,
                                addedCount: addedResources,
                                availableCount: totalResources - addedResources,
                                items: resources.slice(0, 3).map(r => ({
                                    id: r.id,
                                    name: r.name,
                                    type: r.type,
                                    subType: r.sub_type,
                                    category: r.category,
                                    link: r.official_url,
                                    isSaved: r.saved === 1
                                }))
                            };
                        }
                    }
                }
                // ─────────────────────────────────────────────
                // 7. SPOTLIGHT MENTORS (Q32-Q36)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('spotlight') || lowerText.includes('promoted') || lowerText.includes('featured')) {
                    if (spotlightMentors && spotlightMentors.length > 0) {
                        responseText = "⭐ Here are our featured Spotlight Mentors! You can book a session directly to connect with them:";
                        responseType = 'spotlight-mentors';
                        responseData = spotlightMentors;
                    } else {
                        responseText = "I couldn't find any spotlight mentors at the moment. Try checking back later or exploring our regular mentors!";
                    }
                }
                // ─────────────────────────────────────────────
                // 10. HELP & GENERAL FAQ (Q48-Q55)
                // ─────────────────────────────────────────────
                else if (lowerText.includes('assignment') || lowerText.includes('submit')) {
                    responseText = "📝 To submit an assignment:\n\n1. Go to your enrolled course\n2. Open the relevant module\n3. Click on the assignment\n4. Upload your file and submit\n\nYou can also check the Assignments section in your dashboard.";
                    responseType = 'help';
                    responseData = {
                        category: 'Assignments',
                        tips: [
                            'Navigate to your course → module → assignment',
                            'Upload your file in the supported format',
                            'Check deadlines in your Upcoming activities'
                        ]
                    };
                }
                else if (lowerText.includes('exam') || lowerText.includes('assessment') || lowerText.includes('test')) {
                    responseText = "📋 Your exams and assessments are available inside your course modules. Look for items marked as 'Assessment' or 'Exam'.\n\nTip: Check Upcoming activities for assessment dates!";
                    responseType = 'help';
                    responseData = {
                        category: 'Assessments',
                        tips: [
                            'Go to your course → modules to find assessments',
                            'Assessments are marked with a special badge',
                            'Check your calendar for scheduled exam dates'
                        ]
                    };
                }
                else if (lowerText.includes('download') || lowerText.includes('material')) {
                    responseText = "📥 Course materials are available inside each module's content section. Open your course → select a module → access notes, videos, and downloadable resources.\n\nYou can also check the Resource Hub for additional materials!";
                    responseType = 'help';
                    responseData = {
                        category: 'Materials',
                        tips: [
                            'Course → Module → Content section',
                            'Look for PDF, video, and note resources',
                            'Check the Resource Hub for extra materials'
                        ]
                    };
                }
                else if (lowerText.includes('support') || lowerText.includes('contact') || lowerText.includes('help')) {
                    responseText = "🆘 Here's how I can help you:\n\n• Ask about your **courses, progress, or enrollment**\n• Check **live classes** and **Upcoming activities**\n• Find **mentors** and **spotlight mentors**\n• Browse **trending courses** and **resources**\n• View **announcements** and **updates**\n\nFor technical support, please reach out to your institution's support team through the Help section.";
                    responseType = 'help';
                    responseData = {
                        category: 'Help',
                        tips: [
                            'Use quick action buttons below for common topics',
                            'Type keywords like "courses", "calendar", "mentors"',
                            'Contact your institution for technical issues'
                        ]
                    };
                }
                else if (lowerText.includes('grade') || lowerText.includes('score') || lowerText.includes('result') || lowerText.includes('mark')) {
                    responseText = "📊 To check your grades and scores:\n\n1. Open your enrolled course\n2. Go to the assessment/exam module\n3. View your results and feedback\n\nYour overall progress is tracked in your Enrollment Status.";
                    responseType = 'help';
                    responseData = {
                        category: 'Grades',
                        tips: [
                            'Course → Assessment module → View results',
                            'Check Enrollment Status for overall progress',
                            'Ask me "enrollment status" for a quick summary'
                        ]
                    };
                }
                else if (lowerText.includes('password') || lowerText.includes('reset') || lowerText.includes('forgot')) {
                    responseText = "🔑 To reset your password:\n\n1. Go to the Login page\n2. Click \"Forgot Password\"\n3. Enter your registered email\n4. Follow the instructions sent to your email\n\nIf you're still having issues, contact your institution's admin.";
                    responseType = 'help';
                    responseData = {
                        category: 'Account',
                        tips: [
                            'Login page → Forgot Password → Enter email',
                            'Check your email (including spam folder)',
                            'Contact institution admin if issues persist'
                        ]
                    };
                }
                else if (lowerText.includes('change course') || lowerText.includes('switch course') || lowerText.includes('unenroll') || lowerText.includes('drop course')) {
                    responseText = "🔄 To change or switch your enrolled course, please contact your institution admin. They can help you modify your enrollment.\n\nYou can also explore new courses by asking me about 'trending courses' or 'recommended courses'!";
                    responseType = 'help';
                    responseData = {
                        category: 'Enrollment',
                        tips: [
                            'Contact your institution admin for course changes',
                            'Explore trending or recommended courses',
                            'Check your current enrollment status first'
                        ]
                    };
                }
                else if (lowerText.includes('prerequisite') || lowerText.includes('requirement') || lowerText.includes('eligib')) {
                    responseText = "📋 Course prerequisites and requirements are listed on each course's detail page. Navigate to the course you're interested in to see what's needed before enrolling.\n\nAsk me about 'trending courses' or 'recommended courses' to discover new options!";
                    responseType = 'help';
                    responseData = {
                        category: 'Prerequisites',
                        tips: [
                            'Visit the course detail page for requirements',
                            'Check trending courses for available options',
                            'Contact your mentor for guidance on course selection'
                        ]
                    };
                }
                // ──────── Collaborate Section Handlers (Dynamic API Data) ────────
                else if (lowerText.includes('jobs') || lowerText.includes('internship') || lowerText.includes('job opportunity') || lowerText.includes('placement')) {
                    const allOpportunities = [...jobs, ...internships];
                    if (allOpportunities.length > 0) {
                        responseText = `💼 Jobs & Internships — ${jobs.length} job${jobs.length !== 1 ? 's' : ''} and ${internships.length} internship${internships.length !== 1 ? 's' : ''} available!`;
                        responseType = 'collaborate-jobs';
                        responseData = {
                            jobs: jobs.slice(0, 3),
                            internships: internships.slice(0, 3),
                            totalJobs: jobs.length,
                            totalInternships: internships.length,
                            routePath: '/opportunities',
                        };
                    } else {
                        responseText = "💼 Jobs & Internships — No opportunities available right now.\n\nCheck back soon for new openings!";
                        responseType = 'help';
                        responseData = { category: 'Jobs', tips: ['Go to Collaborate → Jobs/Internships to browse all opportunities'] };
                    }
                }
                else if (lowerText.includes('workshop')) {
                    const events = workshopEvents?.slice(0, 5) || [];
                    if (events.length > 0) {
                        responseText = `🔧 Workshops — ${events.length} workshop${events.length > 1 ? 's' : ''} available!`;
                        responseType = 'collaborate-events';
                        responseData = { category: 'Workshops', events, routePath: '/agenda/workshops' };
                    } else {
                        responseText = "🔧 No workshops available right now.\n\nCheck back soon for upcoming hands-on learning sessions!";
                        responseType = 'help';
                        responseData = { category: 'Workshops', tips: ['Go to Collaborate → Workshops to check upcoming sessions', 'Contact your institution for workshop schedules'] };
                    }
                }
                else if (lowerText.includes('masterclass')) {
                    const events = masterclassEvents?.slice(0, 5) || [];
                    if (events.length > 0) {
                        responseText = `🏆 Masterclasses — ${events.length} masterclass${events.length > 1 ? 'es' : ''} available!`;
                        responseType = 'collaborate-events';
                        responseData = { category: 'Masterclasses', events, routePath: '/agenda/masterclass' };
                    } else {
                        responseText = "🏆 No masterclasses available right now.\n\nKeep an eye out for premium learning sessions from industry leaders!";
                        responseType = 'help';
                        responseData = { category: 'Masterclasses', tips: ['Go to Collaborate → Masterclass to explore', 'Check announcements for new masterclass launches'] };
                    }
                }
                else if (lowerText.includes('competition') || lowerText.includes('contest') || lowerText.includes('hackathon')) {
                    const events = competitionEvents?.slice(0, 5) || [];
                    if (events.length > 0) {
                        responseText = `🏅 Competitions — ${events.length} active competition${events.length > 1 ? 's' : ''} found!`;
                        responseType = 'collaborate-events';
                        responseData = { category: 'Competitions', events, routePath: '/agenda/competitions' };
                    } else {
                        responseText = "🏅 No active competitions found right now.\n\nStay tuned for hackathons and challenges!";
                        responseType = 'help';
                        responseData = { category: 'Competitions', tips: ['Go to Collaborate → Competitions to explore', 'Follow announcements to stay updated'] };
                    }
                }
                else if (lowerText.includes('portfolio') || lowerText.includes('my portfolio') || lowerText.includes('my work')) {
                    responseText = '';
                    responseType = 'help';
                    responseData = {
                        routePath: '/portfolio',
                        primaryActionLabel: 'Go to My Portfolio'
                    };
                }
                else if (lowerText.includes('career drive') || lowerText.includes('career') || lowerText.includes('drive')) {
                    const events = careerDriveEvents?.slice(0, 5) || [];
                    if (events.length > 0) {
                        responseText = `🚀 Career Drive — ${events.length} career drive${events.length > 1 ? 's' : ''} active!`;
                        responseType = 'collaborate-events';
                        responseData = { category: 'Career Drive', events, routePath: '/must-attend/career-drive' };
                    } else {
                        responseText = "🚀 No active career drives right now.\n\nKeep your resume and portfolio updated for upcoming placement drives!";
                        responseType = 'help';
                        responseData = { category: 'Career Drive', tips: ['Go to Collaborate → Career Drive', 'Prepare your resume and portfolio', 'Practice mock interviews with mentors'] };
                    }
                }
                else if (lowerText.includes('immersion') || lowerText.includes('immersion program')) {
                    const events = immersionEvents?.slice(0, 5) || [];
                    if (events.length > 0) {
                        responseText = `🎓 Immersion Programs — ${events.length} program${events.length > 1 ? 's' : ''} available!`;
                        responseType = 'collaborate-events';
                        responseData = { category: 'Immersion Programs', events, routePath: '/must-attend/immersion-programs' };
                    } else {
                        responseText = "🎓 No immersion programs available right now.\n\nCheck back for deep-dive industry learning experiences!";
                        responseType = 'help';
                        responseData = { category: 'Immersion Programs', tips: ['Go to Collaborate → Immersion Program', 'Programs include real industry projects & certifications'] };
                    }
                }
                else if (lowerText.includes('queries') || lowerText.includes('query') || lowerText.includes('doubt') || lowerText.includes('question')) {
                    responseText = "❓ Queries — Get your doubts resolved!\n\nPost your academic or platform-related queries and get answers from mentors, faculty, or fellow students.";
                    responseType = 'help';
                    responseData = {
                        category: 'Queries',
                        tips: [
                            'Go to Collaborate → Queries to post or browse',
                            'Be specific with your questions for better answers',
                            'Check existing queries before posting a new one',
                            'Tag relevant subjects for faster responses'
                        ]
                    };
                }
                // ─────────────────────────────────────────────
                // FALLBACK: Dynamic course suggestion (no predefined intent matched — understand full query)
                // ─────────────────────────────────────────────
                else {
                    const query = text.trim();
                    if (query) {
                        let deferTyping = false;
                        try {
                            deferTyping = true;
                            fetch('https://company-chatbot-project.vercel.app/api/search', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ query })
                            })
                                .then((res) => res.json())
                                .then((payload: any) => {
                                    const list = payload?.courses ?? payload?.results ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
                                    const courses = (Array.isArray(list) ? list : []).slice(0, 10);
                                    const introText = (payload?.ai_message && courses.length > 0) ? payload.ai_message : (courses.length > 0 ? `Here are ${courses.length} course(s) for your query.` : "I couldn't find courses for that. Try rephrasing or ask about your courses, live classes, mentors, or calendar.");
                                    const botMsg: Message = {
                                        id: (Date.now() + 1).toString(),
                                        text: introText,
                                        sender: 'bot',
                                        timestamp: new Date(),
                                        type: 'course-suggested',
                                        data: courses
                                    };
                                    setMessages(prev => [...prev, botMsg]);
                                })
                                .catch((err) => {
                                    console.error('Course suggestion API error:', err);
                                    const errorMsg: Message = {
                                        id: (Date.now() + 1).toString(),
                                        text: "I couldn't find courses for that. Try asking about your courses, live classes, mentors, calendar, or announcements!",
                                        sender: 'bot',
                                        timestamp: new Date(),
                                        type: 'text'
                                    };
                                    setMessages(prev => [...prev, errorMsg]);
                                })
                                .finally(() => setIsTyping(false));
                        } finally {
                            if (!deferTyping) setIsTyping(false);
                        }
                        return;
                    }
                }

                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    sender: 'bot',
                    timestamp: new Date(),
                    type: responseType as any,
                    data: responseData
                };
                setMessages(prev => [...prev, botMsg]);

                // 🚀 ~ Google Analytics: Track bot response
                trackBotResponse(responseText, responseType);

                if (responseType === 'courses' && responseData && responseData.length === 1) {
                    const courseId = responseData[0].id.toString();
                    setSelectedCourseId(courseId);
                    // 🚀 ~ Google Analytics: Track course selection
                    trackCourseSelection(responseData[0].id, responseData[0].name || 'Unknown');
                }
            } catch (err) {
                console.error('Chatbot response error:', err);
                const errorMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Oops! Something went wrong while processing your request. Please try again.",
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'text'
                };
                setMessages(prev => [...prev, errorMsg]);
            } finally {
                setIsTyping(false);
            }
        }, 800);
    };

    useEffect(() => {
        if (!selectedCourseId) return;
        if (!courseDetail) return;
        if (String(selectedCourseId) !== String(courseDetail.id)) return;
        // Prevent duplicate module-list messages for the same course
        if (lastShownCourseDetailId.current === String(courseDetail.id)) return;
        lastShownCourseDetailId.current = String(courseDetail.id);

        const myCourse = myCourses?.find(c => String(c.id) === String(selectedCourseId));
        const completion = myCourse ? myCourse.completion : (courseDetail.program_completion?.[selectedCourseId] || 0);

        const allModules = courseDetail.modules || [];
        const units = allModules.filter(m => !m.name.toLowerCase().includes('assessment') && !m.name.toLowerCase().includes('exam'));
        const assessments = allModules.filter(m => m.name.toLowerCase().includes('assessment') || m.name.toLowerCase().includes('exam'));
        const displayed = [...units.slice(0, 5), ...assessments];
        const totalContent = allModules.reduce((acc: number, m: any) => acc + (m.contents?.contents?.length || 0), 0);

        const botMsg: Message = {
            id: (Date.now() + 2).toString(),
            text: `Successfully calculated course overview! Total Modules: ${allModules.length}${totalContent > 0 ? `, Total Content: ${totalContent}` : ''}. Your completion is ${completion}%.`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'module-list',
            data: displayed.map((m: any) => ({
                id: m.id,
                name: m.name,
                contentCount: (m.contents?.contents?.length || 0),
                description: m.description,
                isAssessment: m.name.toLowerCase().includes('assessment') || m.name.toLowerCase().includes('exam')
            }))
        };
        setMessages(prev => [...prev, botMsg]);
    }, [courseDetail, selectedCourseId, myCourses]);

    // 🚀 ~ Google Analytics: Track module selection
    const handleModuleSelect = (moduleId: string) => {
        setSelectedModuleId(moduleId);
        if (moduleDetail && moduleDetail.module_details) {
            trackModuleSelection(moduleId, moduleDetail.module_details.name || 'Unknown', selectedCourseId || undefined);
        }
    };

    useEffect(() => {
        if (moduleDetail && selectedModuleId && String(selectedModuleId) === String(moduleDetail.module_details?.id)) {
            // Prevent duplicate module-detail messages
            if (lastShownModuleDetailId.current === String(moduleDetail.module_details?.id)) return;
            lastShownModuleDetailId.current = String(moduleDetail.module_details?.id);

            const botMsg: Message = {
                id: (Date.now() + 3).toString(),
                text: `In "${moduleDetail.module_details?.name}", there are ${moduleDetail.content_count?.videos + moduleDetail.content_count?.notes + moduleDetail.content_count?.sessions || 0} content pieces in this module.`,
                sender: 'bot',
                timestamp: new Date(),
                type: 'module-detail',
                data: moduleDetail
            };
            setMessages(prev => [...prev, botMsg]);

            // 🚀 ~ Google Analytics: Track module detail view
            if (selectedModuleId) {
                trackModuleSelection(selectedModuleId, moduleDetail.module_details?.name || 'Unknown', selectedCourseId || undefined);
            }
        }
    }, [moduleDetail, selectedCourseId, selectedModuleId]);

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.type === 'mentors' && lastMsg.data?.hasSlots?.length > 0) {
            const timer = setTimeout(() => {
                const mentor = lastMsg.data.hasSlots[0];
                const botMsg: Message = {
                    id: (Date.now() + 4).toString(),
                    text: `Did you know? ${mentor.name} has an available slot right now! They have a ${mentor.rating} rating. Would you like to check their experience?`,
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'text'
                };
                setMessages(prev => [...prev, botMsg]);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    useEffect(() => {
        const el = messageListContainerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-full sm:max-w-[450px] border-l border-zinc-800 bg-zinc-950 text-white flex flex-col shadow-2xl z-[10000] overflow-hidden"
                    >
                        {/* Header — fixed at top */}
                        <ChatHeader onClose={() => onOpenChange(false)} />

                        {/* Messages — takes remaining space, scrolls; min-h-0 so flex-1 can shrink */}
                        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
                            {/* Static Dot Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                                    backgroundSize: '24px 24px'
                                }}
                            />

                            <MessageList
                                messages={messages}
                                isTyping={isTyping}
                                scrollRef={scrollRef}
                                containerRef={messageListContainerRef}
                                onSendMessage={handleSendMessage}
                                onSelectCourse={(courseId) => {
                                    setSelectedCourseId(courseId);
                                    // 🚀 ~ Google Analytics: Track course selection from message list
                                    const course = myCourses?.find(c => c.id.toString() === courseId);
                                    if (course) {
                                        trackCourseSelection(course.id, course.name);
                                    }
                                }}
                                onSelectModule={handleModuleSelect}
                                onCloseChatbot={() => onOpenChange(false)}
                            />
                        </div>

                        {/* QuickActions — fixed at bottom, never squished */}
                        <QuickActions
                            groups={actionGroups}
                            isTyping={isTyping}
                            onAction={(text) => {
                                // 🚀 ~ Google Analytics: Track quick action click
                                trackQuickAction(text, 'quick_action');
                                handleSendMessage(text);
                            }}
                        />

                        {/* Input — fixed at very bottom */}
                        <ChatInput
                            value={inputValue}
                            isTyping={isTyping}
                            onChange={setInputValue}
                            onSend={handleSendMessage}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EnBoatChatbot;
