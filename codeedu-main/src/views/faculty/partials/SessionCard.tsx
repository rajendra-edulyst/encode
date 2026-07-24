import { Session } from '@/@types/faculty/session'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/ShadcnButton'
import { Calendar, Clock, Loader, Users } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { fetchLcLoad } from '@/services/learner/MyClassService';

interface SessionCardProps {
    session: Session
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const [mettingJoinSessionLoaderId, setMettingJoinSessionLoaderId] = React.useState<number | null>(null);
    const navigate = useNavigate();

    const percentage = session.attended_count && session.total_users ? (session.attended_count / session.total_users) * 100 : 0;

    const joinMeetingNow = async (sessionId: number) => {
        setMettingJoinSessionLoaderId(sessionId);
        try {
            await fetchLcLoad(String(sessionId));
            navigate(`/zoom/meeting/${sessionId}`);
        } catch (error) {
            console.error("Error calling lc load:", error);
            toast.error("Unable to start live class");
        } finally {
            setMettingJoinSessionLoaderId(null);
        }
    };
    return (
        <Card className="gap-0 bg-[#5A5A5A] py-4 h-full min-h-0 flex flex-col">
            <CardHeader className='gap-0 shrink-0 px-4 pb-1 pt-0'>
                <div>
                    <div className='flex items-center justify-between'>
                        <p className="text-xs text-gray-500 mb-0 dark:text-white">{session?.course_name}</p>
                        {session?.class_status === 'Live' && (
                            <Badge
                                variant="outline"
                                className="border-red-700 bg-red-300 text-red-800 shadow-none"
                            >
                                Live
                            </Badge>
                        )}
                        {session?.class_status === 'Concluded' && <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/20">Concluded</Badge>}
                        {session?.class_status === 'Scheduled' && <Badge variant="outline" className="text-yellow-500 bg-yellow-500/10 border-yellow-500/20">Scheduled</Badge>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className='px-4 pb-2 pt-0 flex-1 flex flex-col min-h-0'>
                <h2 className="text-base mt-0 line-clamp-2 capitalize dark:text-white">
                    {session?.title}
                </h2>
                <div className='mt-1.5 space-y-0.5'>
                    <p className="text-sm mb-0 line-clamp-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-100">Course</span>
                        <span className="text-gray-400 dark:text-gray-400">{' - '}</span>
                        <span className="text-gray-400 dark:text-gray-400">
                            {session?.course_name || session?.program_name || '--'}
                        </span>
                    </p>
                    <p className="text-sm mb-0 line-clamp-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-100">Module</span>
                        <span className="text-gray-400 dark:text-gray-400">{' - '}</span>
                        <span className="text-gray-400 dark:text-gray-400">
                            {session?.module_name || '--'}
                        </span>
                    </p>
                    <p className="text-sm mb-0 line-clamp-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-100">Session</span>
                        <span className="text-gray-400 dark:text-gray-400">{' - '}</span>
                        <span className="text-gray-400 dark:text-gray-400">
                            {session?.title || '--'}
                        </span>
                    </p>
                </div>
                <div className='space-y-1 mt-2'>
                    <div className="flex items-center gap-2 dark:text-white">
                        <Calendar className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-sm text-gray-500 mb-0 dark:text-white">{new Date(session?.start_date).toLocaleDateString()}, {new Date(session?.start_date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    </div>
                    <div className="flex items-center gap-2 dark:text-white">
                        <Clock className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-sm text-gray-500 mb-0 dark:text-white">{new Date(session?.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(session?.end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                </div>

                <div className="w-full mt-2">
                    <div className="flex justify-between text-sm mb-1 px-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-100">Attendance</span>
                        <span className="text-gray-400 dark:text-gray-400 tabular-nums">{session.attended_count}/{session.total_users}</span>
                    </div>
                    <Progress value={percentage} className='h-2' />
                </div>
            </CardContent>
            <CardFooter className='border-t shrink-0 mt-auto px-4 py-2 flex justify-end gap-3'>
                {
                    session?.class_status === "Scheduled" ? (
                        <Button className="text-black" size="sm">
                            <Link to={`#`} className='flex gap-2 items-center'>Edit</Link>
                        </Button>
                    ) : session?.class_status === "Live" ? (
                        <Button className="text-black" size="sm" onClick={() => joinMeetingNow(session?.id)}>
                            <Link to={`#`} className='flex gap-2 items-center'>
                                {
                                    mettingJoinSessionLoaderId === session?.id ? (
                                        <Loader className="text-primary animate-spin" size={16} />
                                    ) : (
                                        "Join"
                                    )
                                }
                            </Link>
                        </Button>
                    ) : session?.class_status === "Concluded" ? (
                        <Button className="text-black w-full" size="sm">
                            <Link to={`/dashboard/instructor?tab=courses-sessions&sessionId=${session?.id}&action=attendance`} className='flex gap-2 items-center'><Users className="text-black" size={16} />Attendance</Link>
                        </Button>
                    ) : null
                }
                <Button className="text-black w-full" size="sm">
                    <Link to={`/sessions/${session?.id}`} className='flex gap-2 items-center'>Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SessionCard