import React, { useEffect, useState } from 'react'
import { LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getEventStatistics } from '@/services/learner/CourseService';
import { Link } from 'react-router-dom';

const attendanceConfig = {
    total_events: {
        label: "Total Events",
        color: "hsl(var(--chart-1))",
    },
    joined: {
        label: "Joined Events",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;



function EventStatistics() {

    const [eventData, setEventData] = useState([
        { status: "total_events", count: 0, fill: "var(--color-total_events)" },
        { status: "joined", count: 0, fill: "var(--color-joined)" },
    ]);

    useEffect(() => {
        getEventStatistics()
            .then((data) => {
                setEventData([
                    { status: "total_events", count: Math.floor(data.total_events), fill: "var(--color-total_events)" },
                    { status: "joined", count: Math.floor(data.joined_events), fill: "var(--color-joined)" },
                ]);
            })
            .catch((err) => {
                console.error("Error fetching course statistics:", err);
            });
    }, []);

    return (
        <Card className="col-span-2 flex flex-col justify-between md:col-span-1">
            <CardHeader className="pb-0">
                <CardTitle className='text-lg mb-0'>
                    Event Statistics
                </CardTitle>
                <CardDescription>Overview of your event joined</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={attendanceConfig}
                    className="mx-auto max-h-[350px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie label data={eventData} dataKey="count" nameKey="status">
                            <LabelList
                                dataKey="status"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof attendanceConfig) =>
                                    attendanceConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex gap-2 text-sm ">
                <div className='flex justify-between w-full items-center'>
                <p className="text-muted-foreground">
                    AY 2024-25: Summary of Total Events and Joined Events
                </p>
                <Link to={'/events'} className="text-sm text-blue-500 hover:underline">
                    View Details
                </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default EventStatistics