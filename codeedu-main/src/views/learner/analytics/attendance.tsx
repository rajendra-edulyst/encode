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
import { getAttendanceStatistics } from '@/services/learner/CourseService';
import { Link } from 'react-router-dom';



const attendanceConfig = {
    present: {
        label: "Present",
        color: "hsl(var(--chart-2))",
    },
    absent: {
        label: "Absent",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;



function Attendance() {

    const [filter, setFilter] = useState("yearly");

    const [attendanceData, setAttendanceData] = useState([
        { status: "present", count: 0, fill: "var(--color-present)" },
        { status: "absent", count: 0, fill: "var(--color-absent)" },
    ]);

    useEffect(() => {
        getAttendanceStatistics(filter)
            .then((data) => {
                setAttendanceData([
                    { status: "present", count: Math.floor(data.present), fill: "var(--color-present)" },
                    { status: "absent", count: Math.floor(data.absent), fill: "var(--color-absent)" },
                ]);
            })
            .catch((err) => {
                console.error("Error fetching course statistics:", err);
            });
    }, [filter]);

    return (
        <Card className="col-span-2 flex flex-col justify-between md:col-span-1">
            <CardHeader className="pb-0">
                <div className='flex justify-between items-center'>
                    <div>
                        <CardTitle className='text-lg mb-0'>Attendance</CardTitle>
                        <CardDescription>Total attend classes and sessions</CardDescription>
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="yearly">AY - 2024-25 Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly-Q1">Jan-Mar</option>
                        <option value="quarterly-Q2">Apr-Jun-</option>
                        <option value="quarterly-Q3">Jul-Sep</option>
                        <option value="quarterly-Q4">Oct-Dec</option>
                    </select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={attendanceConfig}
                    className="mx-auto max-h-[350px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie label data={attendanceData} dataKey="count" nameKey="status">
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
            <CardFooter className="flex gap-2 text-sm">
                <div className='flex justify-between w-full items-center'>
                    <p className="text-muted-foreground">
                        Showing total attended classes for this year
                    </p>
                    <Link to={'/my-classes'} className="text-sm text-blue-500 hover:underline">
                        View Details
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default Attendance