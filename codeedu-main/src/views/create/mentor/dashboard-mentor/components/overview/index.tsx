import RecentActivity from "./RecentActivity";
import PerformanceCard from "./PerformanceCard";
import { Card, CardContent } from "@/components/ui/card";
import { useMentorsStats } from "@/hooks/data/create/useMentor";
import { useState } from "react";

export function OverviewIndex({ timeFilter }: { timeFilter: string }) {
    const { data: stats, isLoading } = useMentorsStats(timeFilter);

    if (isLoading || !stats) {
        return <div className="text-center py-8">Loading...</div>;
    }

    const overviewStats = [
        { title: "Total Mentees", value: stats.total_mentees },
        { title: "Sessions Conducted", value: stats.sessions_conducted },
        { title: "Total Mentoring Hours", value: stats.total_mentoring_hours },
        { title: "Avg Session Duration", value: stats.avg_session_duration },
        { title: "Repeat Session Requests", value: stats.repeat_session_request },
        { title: "Total Ratings", value: stats.total_ratings },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {overviewStats.map((stat) => (
                    <Card key={stat.title} className="gap-0">
                        <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                                {stat?.title}
                            </p>
                            <h3 className="text-3xl font-semibold text-white leading-tight">
                                {stat?.value ?? 0}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceCard timeFilter={timeFilter} />
                <RecentActivity timeFilter={timeFilter} />
            </div>
        </div>
    );
}

export default function OverviewPage() {
    const [timeFilter] = useState('yearly');
    return <OverviewIndex timeFilter={timeFilter} />;
}
