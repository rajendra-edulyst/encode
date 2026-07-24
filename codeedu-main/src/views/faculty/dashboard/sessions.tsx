import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import SessionCard from '@faculty/partials/SessionCard';
import { useMySessions } from '@/hooks/data/faculty/useProgram';
import LoadingSection from '@/components/LoadingSection';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import Heading from '@/components/heading';

const Sessions: React.FC = () => {

    const { data: sessions = [], isLoading, isError } = useMySessions();

    if (isError && sessions.length === 0) {
        return <div className="text-red-500">Failed to load sessions. Please try again later.</div>;
    }

    if (sessions.length === 0) {
        return null;
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                    {sessions
                        ?.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                        ?.slice(0, 3)
                        ?.map((session, index) => (
                            <SessionCard key={index} session={session} />
                        ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Sessions