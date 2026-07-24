import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiveClass } from "@/@types/learner/MyClasses";
import { PiCalendar, PiClock } from "react-icons/pi";
import { IoVideocam } from "react-icons/io5";
import LoadingSection from "@/components/LoadingSection";
import { useLiveClasses } from "@/hooks/data/create/useSessions";
import { Card, CardContent } from "@/components/ui/card";
import { getLiveSessionDisplayStatus } from "@/utils/liveSessionStatus";
import { mixpanelService } from '@/services/mixpanel/MixpanelService'


const LiveClassCard: React.FC<{ session: LiveClass; now: number }> = ({ session, now }) => {
    const navigate = useNavigate();
    const displayStatus = useMemo(() => getLiveSessionDisplayStatus(session, now), [session, now]);

    const renderAction = () => {
        if (displayStatus === "Started" || displayStatus === "Live") {
            return (
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
onClick={() => {
    mixpanelService.track("Live Class Joined", {
        session_id: session.id,
        session_name: session.name,
        program_name: session.program_name,
    });

    navigate(`/zoom/meeting/${session.id}`);
}}                >
                    Join Now
                </button>
            );
        }
        if (displayStatus === "Upcoming") {
            return (
                <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                    {session.call_to_action?.action_title}
                </span>
            );
        }
        if (displayStatus === "Completed" && session.record_url) {
            return (
                <a
                    href={session.record_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                    <IoVideocam />
                </a>
            );
        }
        if (displayStatus === "Completed" && !session.record_url) {
            return (
                <span>
                    No Recording Available
                </span>
            );
        }
        return null;
    };

    const getStatusStyles = (status?: string) => {
        switch (status) {
            case "Started":
            case "Live":
                return "bg-red-500 text-white";
            case "Upcoming":
                return "bg-primary text-white";
            case "Completed":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <Card className="bg-[#323232] relative overflow-hidden">
            {displayStatus && (
                <div className="absolute top-0 right-0 z-10">
                    <span className={`text-[10px] font-medium px-3 py-1 rounded-bl-xl uppercase tracking-wider ${getStatusStyles(displayStatus)}`}>
                        {displayStatus}
                    </span>
                </div>
            )}
            <div className="p-4">
                <div className="border-b pb-3">

                    {session.program_name && (
                        <p className="text-xl text-gray-700 dark:text-gray-400 font-semibold mb-1">
                            {session.program_name}
                        </p>
                    )}
                    <h6 className="text-xs font-bold text-primary mb-1 leading-tight  uppercase">
                        {session.name}
                    </h6>
                    {session.module_name && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-400 font-medium mb-2 italic">
                            {session.module_name}
                        </p>
                    )}
                    <div className="flex flex-col gap-1 mt-3 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                            <PiCalendar className="text-lg" />
                            <span>
                                {new Date(session.starttime_ts * 1000).toLocaleDateString(
                                    "en-IN",
                                    { year: "numeric", month: "long", day: "numeric" }
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <PiClock className="text-lg dark:text-white" />
                            <span>
                                {session.start_time} - {session.end_time}
                            </span>
                        </div>
                    </div>
                </div>

                {displayStatus && <div className="flex items-center justify-between mt-3">
                    {renderAction()}
                </div>}
            </div>
        </Card>
    );
};

const App: React.FC = () => {
    const { data: liveClasses = [], isLoading } = useLiveClasses();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(id);
    }, []);

    const visibleliveClasses = useMemo(() => {
        const getStatusPriority = (status?: string) => {
            if (status === "Live" || status === "Started") return 1;
            if (status === "Upcoming") return 2;
            return 3;
        };

        return [...liveClasses]
            .sort((a, b) => {
                const priorityA = getStatusPriority(getLiveSessionDisplayStatus(a, now));
                const priorityB = getStatusPriority(getLiveSessionDisplayStatus(b, now));
                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                if (priorityA === 3) { // Completed or other
                    return b.starttime_ts - a.starttime_ts;
                }

                return a.starttime_ts - b.starttime_ts;
            })
            .slice(0, 3);
    }, [liveClasses, now]);


    if (isLoading && visibleliveClasses.length === 0) {
        return (
            <LoadingSection isLoading={isLoading} title="My Sessions" description="We are fetching your sessions..." />
        );
    }

    if (!isLoading && visibleliveClasses.length === 0) return null;

    return (
        <Card>
            <CardContent>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-2 text-primary">My Classes & Sessions</h1>
<Link
    to="/my-classes"
    className="text-primary text-sm"
    onClick={() => {
        mixpanelService.track("My Classes View All Clicked");
    }}
>
    View All
</Link>                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6'>
                    {visibleliveClasses.map((session) => (
                        <LiveClassCard key={session.id} session={session} now={now} />
                    ))}
                </div>
                {
                    !isLoading && liveClasses.length === 0 && (
                        <div className="flex items-center justify-center h-24">
                            <p className="text-gray-500 text-sm italic">
                                🎓 No classes or sessions found
                            </p>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
};

export default App;