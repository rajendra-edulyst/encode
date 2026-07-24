import React, { useEffect, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import debounce from 'lodash/debounce'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getActiveHoursStatistics } from '@/services/learner/CourseService';
import { ActiveHoursStatistics } from '@/@types/learner/Courses';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';

// const activeHoursData = [
//     { day: "1 Mar", hours: 8 },
//     { day: "2 Mar", hours: 6 },
//     { day: "3 Mar", hours: 7 },
//     { day: "4 Mar", hours: 9 },
//     { day: "5 Mar", hours: 8 },
//     { day: "6 Mar", hours: 6 },
//     { day: "7 Mar", hours: 7 },
//     { day: "8 Mar", hours: 9 },
//     { day: "9 Mar", hours: 8 },
//     { day: "10 Mar", hours: 6 },
//     { day: "11 Mar", hours: 7 },
//     { day: "12 Mar", hours: 9 },
//     { day: "13 Mar", hours: 8 },
//     { day: "14 Mar", hours: 6 },
//     { day: "15 Mar", hours: 7 },
//     { day: "16 Mar", hours: 9 },
//     { day: "17 Mar", hours: 8 },
//     { day: "18 Mar", hours: 6 },
//     { day: "19 Mar", hours: 7 },
//     { day: "20 Mar", hours: 9 },
//     { day: "21 Mar", hours: 8 },
//     { day: "22 Mar", hours: 6 },
//     { day: "23 Mar", hours: 7 },
//     { day: "24 Mar", hours: 9 },
//     { day: "25 Mar", hours: 8 },
//     { day: "26 Mar", hours: 6 },
//     { day: "27 Mar", hours: 7 },
//     { day: "28 Mar", hours: 9 },
//     { day: "29 Mar", hours: 8 },
//     { day: "30 Mar", hours: 6 },
//     { day: "31 Mar", hours: 7 },
// ];

const activeHoursChartConfig = {
    hours: {
        label: "Active Hours",
        color: "hsl(var(--chart-3))",
    },
};

function ActivityHours() {
    const [activeHoursData, setActiveHoursData] = React.useState<ActiveHoursStatistics[]>([]);
    const [activeMonth, setActiveMonth] = React.useState<number>(new Date().getMonth() + 1);
    const [activeYear, setActiveYear] = React.useState<number>(new Date().getFullYear());

    const months = [
        {
            name: "January",
            value: 1,
        },
        {
            name: "February",
            value: 2,
        },
        {
            name: "March",
            value: 3,
        },
        {
            name: "April",
            value: 4,
        },
        {
            name: "May",
            value: 5,
        },
        {
            name: "June",
            value: 6,
        },
        {
            name: "July",
            value: 7,
        },
        {
            name: "August",
            value: 8,
        },
        {
            name: "September",
            value: 9,
        },
        {
            name: "October",
            value: 10,
        },
        {
            name: "November",
            value: 11,
        },
        {
            name: "December",
            value: 12,
        }];

    const fetchActiveHours = useMemo(() => debounce((month: number, year: number) => {

        if (!year) {
            year = new Date().getFullYear();
        }

        if(!month){
            month = new Date().getMonth() + 1;
        }

        getActiveHoursStatistics(month, year).then((data) => {
            setActiveHoursData(data);
        }).catch((err) => {
            console.error("Error fetching active hours statistics:", err);
        });
    }, 300), []);

    useEffect(() => {
        fetchActiveHours(activeMonth, activeYear);
    }, [activeMonth, fetchActiveHours, activeYear]);

    return (
        <Card className='col-span-2'>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex justify-between w-full gap-1 px-6 py-5 sm:py-6">
                    <div>
                        <CardTitle>Active Hours</CardTitle>
                        <CardDescription>Showing active hours for each day of the week</CardDescription>
                    </div>
                    <div className='flex items-center justify-between gap-3'>
                        {/* year */}
                        <select defaultValue={activeYear} onChange={(e) => {
                            setActiveYear(Number(e.target.value));
                        }}>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                        </select>
                        <div className='flex justify-between items-center'>
                            <Button variant="ghost" size="icon" className="p-2" onClick={() => {
                                if (activeMonth > 1) {
                                    setActiveMonth(activeMonth - 1);
                                }
                            }}>
                                <ChevronLeft />
                            </Button>
                            <div className="text-sm font-medium text-muted-foreground w-20 text-center">
                                {months[activeMonth - 1].name}
                            </div>
                            <Button variant="ghost" size="icon" className="p-2" onClick={() => {
                                if (activeMonth < 12) {
                                    setActiveMonth(activeMonth + 1);
                                }
                            }}>
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer className="aspect-auto h-[250px] w-full"
                    config={activeHoursChartConfig}
                >
                    <BarChart
                        accessibilityLayer
                        data={activeHoursData}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip
                            content={<ChartTooltipContent className="w-[100px]" nameKey="hours" />}
                        />
                        <Bar dataKey="hours" fill="hsl(var(--chart-2))" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}

export default ActivityHours