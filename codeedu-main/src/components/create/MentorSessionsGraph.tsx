import { cn } from '@/lib/utils';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { useMentorSessions } from '@/hooks/data/create/useCourses';
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface MentorSessionsGraphProps {
    className?: string;
    timeFilter?: string;
}

const chartConfig = {
    booked: {
        label: "Booked",
        color: "#00A8E9",
    },
    completed: {
        label: "Completed",
        color: "#22c55e",
    },
} satisfies ChartConfig

const MentorSessionsGraph = ({ className, timeFilter = 'yearly' }: MentorSessionsGraphProps) => {
    const { data: mentorSessions, isLoading } = useMentorSessions(timeFilter);

    // Transform API data to chart format
    const chartData = React.useMemo(() => {
        if (!mentorSessions) return [];

        // Handle different time filter formats
        if (timeFilter === 'yearly') {
            return mentorSessions.booked_sessions.map((booked, index) => ({
                day: booked.month.slice(0, 3),
                booked: booked.count,
                completed: mentorSessions.completed_sessions[index]?.count || 0,
            }));
        } else if (timeFilter === 'monthly') {
            return mentorSessions.booked_sessions.map((booked, index) => ({
                day: `Week ${index + 1}`,
                booked: booked.count,
                completed: mentorSessions.completed_sessions[index]?.count || 0,
            }));
        } else if (timeFilter === 'quarterly') {
            return mentorSessions.booked_sessions.map((booked, index) => ({
                day: `Q${index + 1}`,
                booked: booked.count,
                completed: mentorSessions.completed_sessions[index]?.count || 0,
            }));
        } else {
            return mentorSessions.booked_sessions.map((booked, index) => ({
                day: `Day ${index + 1}`,
                booked: booked.count,
                completed: mentorSessions.completed_sessions[index]?.count || 0,
            }));
        }
    }, [mentorSessions, timeFilter]);

    return (
        <Card className={cn('bg-[#1D1D1D] rounded-3xl border-none', className)}>
            <CardHeader className="flex flex-row justify-between items-start pb-6 px-6 pt-6">
                <CardTitle className="text-white text-[22px] font-['Jacques_Pro'] font-bold mt-1">
                    Mentor Sessions
                </CardTitle>
                <div className="flex gap-4 text-sm text-white font-['Jacques_Pro']">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A8E9' }}></div>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7fbc42' }}></div>
                        <span>Completed</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                {isLoading ? (
                    <div className="h-[320px] flex items-end justify-between px-4">
                        <Skeleton className="w-[10%] h-[30%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[50%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[40%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[70%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[20%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[60%] bg-gray-700/50 rounded-t-lg" />
                        <Skeleton className="w-[10%] h-[80%] bg-gray-700/50 rounded-t-lg" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[320px] w-full">
                        <AreaChart
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 0,
                                top: 12,
                                bottom: 0,
                            }}
                        >
                            <XAxis
                                dataKey="day"
                                stroke="#4B5563"
                                tickLine={false}
                                axisLine={{ stroke: '#4B5563' }}
                                tickMargin={8}
                                tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'system-ui' }}
                            />
                            <YAxis
                                stroke="#4B5563"
                                tickLine={false}
                                axisLine={{ stroke: '#4B5563' }}
                                tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'system-ui' }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="booked"
                                type="natural"
                                fill="#00A8E9"
                                fillOpacity={0.8}
                                stroke="#00A8E9"
                                strokeWidth={2}
                            />
                            <Area
                                dataKey="completed"
                                type="natural"
                                fill="#7fbc42"
                                fillOpacity={0.8}
                                stroke="#7fbc42"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

export default MentorSessionsGraph;