import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import SessionCard from '@faculty/partials/SessionCard';
import { useMySessions } from '@/hooks/data/faculty/useProgram';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import Heading from '@/components/heading';
import { useMemo } from 'react';

const MAX_VISIBLE_SESSIONS = 3;

const Sessions: React.FC = () => {

    const { data: sessions = [], isLoading, isError } = useMySessions();
    const visibleSessions = useMemo(() => {
        const getNormalizedStatus = (
            session: { liveclass_status?: string; class_status?: string; status?: string }
        ) => {
            return (session.liveclass_status || session.class_status || session.status || '').toLowerCase();
        };

        return sessions
            .filter((session) => {
                const normalizedStatus = getNormalizedStatus(session);
                // Keep only live + upcoming/scheduled. Completed/concluded should not be shown.
                return normalizedStatus === 'live' || normalizedStatus === 'upcoming' || normalizedStatus === 'scheduled';
            })
            .sort((a, b) => {
                // Latest first
                return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
            });
    }, [sessions]);

    if (isError && sessions.length === 0) {
        return <div className="text-red-500">Failed to load sessions. Please try again later.</div>;
    }

    return (
        <Card className='gap-0'>
            <CardHeader>
                <Heading title="Sessions" description="Manage your sessions" />
                <CardAction>
                    <Link to="/sessions">
                        <Button className='text-black' size="sm">View All</Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title="Sessions..." description='Please wait while we load your sessions.' />
                {!isLoading && visibleSessions.length === 0 ? (
                    <p className="text-gray-500">No class sessions available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                        {visibleSessions?.slice(0, MAX_VISIBLE_SESSIONS)?.map((session, index) => (
                            <SessionCard key={index} session={session} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Sessions