import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { PreAssignCourse } from "@/@types/learner/Courses"
import { useMemo } from "react"
import { stripHtmlTags } from "@/utils/stripHtmlTags"
import { FaStar } from "react-icons/fa";
import { ArrowRight } from "lucide-react"


interface MyCourseCardProps {
    course: PreAssignCourse
    className?: string
}

export default function MyCourseCard({ course, className }: MyCourseCardProps) {

    const skills = course?.skill_job_role?.skills || [];

    const courseStatus = useMemo(() => {
        if (course?.completion === 100) return 'completed';
        return 'ongoing';
    }, [course]);

    const isCompleted = course?.completion === 100;

    const formatPercent = (percent: number | undefined) => {
        if (percent === undefined || isNaN(percent)) return "0%";
        return `${Math.min(Math.max(Math.round(percent), 0), 100)}%`;
    };

    return (
        <Card className={cn("pt-0 pb-0 dark:bg-[#323232] rounded-xl overflow-hidden relative h-full", className)}>
            <CardHeader className="relative h-54 p-0">
                <div className="relative h-full w-full">
                    <img src={course?.image} alt={course?.name || "Course cover"} className="object-contain h-54 w-full" />
                </div>
                <div className="pointer-events-none absolute top-0 right-0 flex flex-col items-end gap-2">
                    <div className="pointer-events-auto">
                        <Badge className={`absolute -top-1 -right-1 rounded-xl rounded-br-none rounded-tl-none capitalize ${courseStatus === 'completed' ? 'bg-codegreen' : 'bg-codepink'} text-white p-2 px-4`}>{courseStatus}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between p-3">
                <div>
                    <div className="flex items-center justify-start gap-2 mb-1">
                        <img src={course?.organization?.organization_logo} alt={course?.organization?.name || "Organization"}
                            className="rounded-xl bg-[#131313] border w-10 h-10 object-contain" />
                        <h1 className="text-balance text-lg font-bold leading-snug dark:text-white">{course?.name}</h1>
                    </div>
                    <div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{stripHtmlTags(course?.description)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 pb-8">
                        <div className="flex flex-wrap items-center justify-start p-2 gap-2">
                            {skills?.slice(0, 3).map((skill, index) => (
                                <Badge key={`skill-${index}`} variant={'outline'} className="dark:text-white rounded-full px-2 py-1 text-xs border-primary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-end items-end gap-2 col-span-1 pb-3">
                        <div className="flex flex-col items-end justify-end gap-1">
                            {/* <h6 className="text-primary text-sm">{course?.subscription_type === 'open' ? 'Free' : 'Paid'}</h6> */}
                            <div className="flex items-center gap-1 text-sm">
                                <FaStar className="text-yellow-400 size-4" /> <span className="font-semibold">{course?.course_meta_data?.rating}({course?.course_meta_data?.num_people_rated})</span>
                            </div>
                        </div>
                        {!isCompleted && <button className={cn("rounded-xl h-[80px] flex flex-col items-center justify-center w-[85px] bg-primary text-black px-3 py-3 shadow-sm", "hover:opacity-90 transition-opacity", className)}>
                            <ArrowRight className="size-4" />
                            <span className="text-sm text-black text-sm">
                                Continue Course
                            </span>
                        </button>}
                    </div>
                </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0">
                <p className="text-sm mb-1.5 pl-3 text-xs dark:text-white">{isCompleted ? 'Completed' : `${formatPercent(course?.completion)} Completed`}</p>
                <Progress value={course?.completion} className={cn("h-4 rounded-none dark:bg-[#5A5A5A] border-t")} />
            </div>
        </Card>
    )
}

