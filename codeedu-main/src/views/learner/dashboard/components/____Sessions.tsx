import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiveClass } from "@/@types/learner/MyClasses";
import { PiCalendar, PiClock } from "react-icons/pi";
import { IoVideocam } from "react-icons/io5";
import LoadingSection from "@/components/LoadingSection";
import { useLiveClasses } from "@/hooks/data/create/useSessions";

const LiveClassCard: React.FC<{ session: LiveClass }> = ({ session }) => {
    const navigate = useNavigate();
    const renderAction = () => {
        if (session.liveclass_status === "Started" || session.liveclass_status === "Live") {
            return (
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    onClick={() => navigate(`/zoom/meeting/${session.id}`)}
                >
                    Join Now
                </button>
            );
        }
        if (session.liveclass_status === "Upcoming") {
            return (
                <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                    {session.call_to_action?.action_title}
                </span>
            );
        }
        if (session.liveclass_status === "Completed" && session.record_url) {
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
        return null;
    };

    return (
        <div className="w-full bg-white border rounded-lg shadow hover:scale-95 transition-transform duration-300">
            <div className="p-3">
                <div className="border-b pb-3">
                    <h6 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {session.name}
                    </h6>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {session.description}
                    </p>
                    <div className="flex flex-col gap-1 mt-3 text-xs text-gray-600">
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
                            <PiClock className="text-lg" />
                            <span>
                                {session.start_time} - {session.end_time}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <Link
                        to={`/portfolio/codeedu-dae124fa/${session.trainer_id}`}
                        className="flex items-center gap-2"
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${session.trainer_name}&background=E60086&color=fff&size=32&bold=true`}
                            alt={session.trainer_name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600">{session.trainer_name}</span>
                    </Link>
                    {renderAction()}
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const { data: liveClasses = [], isLoading } = useLiveClasses();

    const visibleliveClasses = useMemo(() => {
        // Sort by starttime_ts in descending order (newest first) and take first 4
        return liveClasses
            .sort((a, b) => b.starttime_ts - a.starttime_ts)
            .slice(0, 4);
    }, [liveClasses]);

    if (isLoading && visibleliveClasses.length === 0) {
        return (
            <LoadingSection isLoading={isLoading} title="My Sessions" description="We are fetching your sessions..." />
        );
    }

    if (!liveClasses || liveClasses.length === 0) return null;

    return (
        <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-2 text-primary">My Classes & Sessions</h1>
                <Link to="/my-classes" className="text-primary text-sm">View All</Link>
            </div>
            <div className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4'>
                {visibleliveClasses.map((session) => (
                    <LiveClassCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
};

export default App;