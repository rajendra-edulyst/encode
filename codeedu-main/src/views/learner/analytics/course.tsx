import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { getProgramsStatistics } from '@/services/learner/CourseService';
import { Link } from 'react-router-dom';

const chartConfig = {
    courseProgressVal: {
        label: "Course Progress-",
    },
    assigned: {
        label: "Assigned",
        color: "hsl(var(--chart-1))",
    },
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
    progress: {
        label: "Progress",
        color: "hsl(var(--chart-3))",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

function CourseStatistics() {
    const [chartData, setChartData] = useState([
        { course: "assigned", courseProgressVal: 0, fill: "var(--color-assigned)" },
        { course: "completed", courseProgressVal: 0, fill: "var(--color-completed)" },
        { course: "progress", courseProgressVal: 0, fill: "var(--color-progress)" },
        { course: "pending", courseProgressVal: 0, fill: "var(--color-pending)" },
    ]);
    const [filter, setFilter] = useState("yearly");

    useEffect(() => {
        getProgramsStatistics(filter)
            .then((data) => {
                setChartData([
                    { course: "assigned", courseProgressVal: data.assigned, fill: "var(--color-assigned)" },
                    { course: "completed", courseProgressVal: data.completed, fill: "var(--color-completed)" },
                    { course: "progress", courseProgressVal: data.progress, fill: "var(--color-progress)" },
                    { course: "pending", courseProgressVal: data.pending, fill: "var(--color-pending)" },
                ]);
            })
            .catch((err) => {
                console.error("Error fetching course statistics:", err);
            });
    }, [filter]);

    return (
        <Card className='col-span-2 md:col-span-1'>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <div>
                        <CardTitle className='text-lg mb-0'>Total Courses</CardTitle>
                        <CardDescription className='!mt-0'>Total number of courses</CardDescription>
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
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0 }}
                    >
                        <YAxis
                            dataKey="course"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            width={70}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <XAxis dataKey="courseProgressVal" type="number" />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="courseProgressVal" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className='flex justify-between w-full items-center'>
                    <div className="leading-none text-muted-foreground">Course Progress</div>
                    <Link to={'/courses/enrolled'} className="text-sm text-blue-500 hover:underline">
                        View Details
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

export default CourseStatistics;

// import React, { useEffect, useState } from 'react'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { Bar, BarChart, XAxis, YAxis } from "recharts"

// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { getProgramsStatistics } from '@/services/learner/CourseService'

// const chartConfig = {
//     courseProgressVal: {
//         label: "Course Progress",
//     },
//     assigned: {
//         label: "Assigned",
//         color: "hsl(var(--chart-1))",
//     },
//     completed: {
//         label: "Completed",
//         color: "hsl(var(--chart-2))",
//     },
//     progress: {
//         label: "Progress",
//         color: "hsl(var(--chart-3))",
//     },
//     pending: {
//         label: "Pending",
//         color: "hsl(var(--chart-4))",
//     },
// } satisfies ChartConfig

// function CourseStatics() {
//     const [chartData, setChartData] = useState([
//         { course: "assigned", courseProgressVal: 0, fill: "var(--color-assigned)" },
//         { course: "completed", courseProgressVal: 0, fill: "var(--color-completed)" },
//         { course: "progress", courseProgressVal: 0, fill: "var(--color-progress)" },
//         { course: "pending", courseProgressVal: 0, fill: "var(--color-pending)" },
//     ]);

//     useEffect(() => {
//         getProgramsStatistics()
//             .then((data) => {
//                 setChartData([
//                     { course: "assigned", courseProgressVal: data.assigned, fill: "var(--color-assigned)" },
//                     { course: "completed", courseProgressVal: data.completed, fill: "var(--color-completed)" },
//                     { course: "progress", courseProgressVal: data.progress, fill: "var(--color-progress)" },
//                     { course: "pending", courseProgressVal: data.pending, fill: "var(--color-pending)" },
//                 ]);
//             })
//             .catch((err) => {
//                 console.error("Error fetching course statistics:", err);
//             });
//     }, []);

//     return (
//         <Card className='col-span-2 md:col-span-1'>
//             <CardHeader>
//                 <CardTitle className='text-lg mb-0'>Total Courses</CardTitle>
//                 <CardDescription className='!mt-0'>
//                     Total number of courses
//                 </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig}>
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         layout="vertical"
//                         margin={{ left: 0 }}
//                     >
//                         <YAxis
//                             dataKey="course"
//                             type="category"
//                             tickLine={false}
//                             tickMargin={0}
//                             width={70}
//                             axisLine={false}
//                             tickFormatter={(value) =>
//                                 chartConfig[value as keyof typeof chartConfig]?.label
//                             }
//                         />
//                         <XAxis dataKey="courseProgressVal" type="number" />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Bar dataKey="courseProgressVal" layout="vertical" radius={5} />
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col items-start gap-2 text-sm">
//                 <div className="leading-none text-muted-foreground">
//                     Course Progress
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }

// export default CourseStatics