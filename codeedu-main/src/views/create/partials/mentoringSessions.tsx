import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import LoadingSection from '@/components/LoadingSection';
import { useMentoringSessions } from '@/hooks/data/faculty/useMentor';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/commonDateFormat';
import { useEffect } from "react";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";


type MentoringSession = {
    id: number;
    title: string;
    purpose: string | null;
    start: string;
    approval_status: 0 | 1 | 2;
};

const parseSessionDate = (dateTime: string) => new Date(dateTime.replace(' ', 'T')).getTime();

const MentoringSessions: React.FC = () => {

    const { data: sessionsData, isLoading } = useMentoringSessions();
    const sessions: MentoringSession[] = Array.isArray(sessionsData?.data) ? (sessionsData.data as MentoringSession[]) : [];
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className='dark:text-white text-xl'>Mentoring Sessions</CardTitle>
                <CardDescription className='dark:text-white text-sm'>Manage your sessions</CardDescription>
                <CardAction>
                    {!isLoading && sessions.filter((s) => s.approval_status === 1).length > 3 && (
                        <Link to="/calendar/sessions"
                          onClick={() =>
    mixpanelService.track("Mentoring Sessions View All Clicked")
  }>
                            <Button className="bg-[#00A3FF] hover:bg-[#0082CC] text-black font-bold h-8" size="sm">View All</Button>
                        </Link>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title="Sessions..." description='Please wait while we load your sessions.' />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {!isLoading && sessions.length === 0 && (
                        <p className="text-gray-500">No mentoring sessions available.</p>
                    )}
                    {sessions
                        .filter((s) => s.approval_status === 1)
                        .sort((a, b) => parseSessionDate(b.start) - parseSessionDate(a.start))
                        .slice(0, 3)
                        .map((session) => {
                            const isPast = new Date(session.start) < new Date();
                            return (
                                <Card key={session.id} className='bg-[#5A5A5A] border-none shadow-none relative overflow-hidden'>
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold rounded-bl-lg uppercase tracking-wider ${isPast ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                                        {isPast ? 'Completed' : 'Upcoming'}
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className='text-white text-lg'>{session.title}</CardTitle>
                                        <CardDescription className='text-gray-300 text-xs line-clamp-1'>{session.purpose}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-start mb-2 text-gray-200">
                                            <ChevronRight className="w-5 h-5 mr-1 shrink-0" />
                                            <p className="text-xs">Date: {formatDate(session.start)}, {formatDate(session.start, 'h:mm a')}</p>
                                        </div>
                                        <div className="flex items-start mb-2 text-gray-200">
                                            <ChevronRight className="w-5 h-5 mr-1 shrink-0" />
                                            <p className="text-xs italic text-gray-300">Approval Status: Approved</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className='bg-[#00A3FF] hover:bg-[#0082CC] text-black font-bold'
                                            size="sm"
                                            onClick={() => {

                                                mixpanelService.track("Mentoring Session Viewed", {
                                                    session_id: session.id,
                                                    session_title: session.title,
                                                    purpose: session.purpose,
                                                    status: isPast ? "completed" : "upcoming"
                                                });

                                                if (isPast) {
                                                    navigate(`/dashboard/mentor?tab=sessions_history&eventId=${session.id}`);
                                                } else {
                                                    navigate(`/dashboard/mentor?tab=upcoming_sessions&eventId=${session.id}`);
                                                }
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                </div>
            </CardContent>
        </Card>
    )
}

export default MentoringSessions