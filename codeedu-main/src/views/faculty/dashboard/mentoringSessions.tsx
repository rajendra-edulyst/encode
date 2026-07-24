import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import LoadingSection from '@/components/LoadingSection';
import { useMentoringSessions } from '@/hooks/data/faculty/useMentor';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/commonDateFormat';

const MentoringSessions: React.FC = () => {

    const { data: sessionsData, isLoading } = useMentoringSessions();
    const sessions = (sessionsData?.data || []).sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle className='dark:text-white'>Mentoring Sessions</CardTitle>
                <CardDescription className='dark:text-white text-xs'>Manage your sessions</CardDescription>
                <CardAction>
                    <Link to="/calendar/sessions">
                        <Button className="text-black" size="sm">View All</Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title="Sessions..." description='Please wait while we load your sessions.' />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {!isLoading && sessions.length === 0 && (
                        <p className="text-gray-500">No mentoring sessions available.</p>
                    )}
                    {sessions.slice(0, 3).map((session) => (
                        <Card key={session.id} className='bg-[#5A5A5A]'>
                            <CardHeader>
                                <CardTitle className='dark:text-white'>{session.title}</CardTitle>
                                <CardDescription className='dark:text-white'>{session.purpose}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2 dark:text-white">
                                    <ChevronRight className="inline-block mr-2" />
                                    <p>Date: {formatDate(session.start)}, {formatDate(session.start, 'h:mm a')}</p>
                                </div>
                                <div className="flex items-center mb-2 dark:text-white">
                                    <ChevronRight className="inline-block mr-2" />
                                    <p>Approval Status: <span className={`font-bold ${session.approval_status ? 'text-green-500' : 'text-red-500'}`}></span>{session.approval_status ? 'Approved' : 'Pending'}</p>
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Link to={`/calendar/${session.id}`}>
                                    <Button className='dark:text-black' size="sm">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default MentoringSessions