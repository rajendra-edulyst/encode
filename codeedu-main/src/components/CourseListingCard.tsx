import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { stripHtmlTags } from "@/utils/stripHtmlTags"
import { FaStar } from "react-icons/fa";
import { ArrowRight, Clock5 } from "lucide-react"


interface MyCourseCardProps {
    course: any
    className?: string
}

export default function CourseCard({ course, className }: MyCourseCardProps) {

    const skills = course?.skills || [];

    const courseStatus = useMemo(() => {
        return 'Pro';
    }, [course]);

    const isCompleted = course?.completion === 100;

    const formatPercent = (percent: number | undefined) => {
        if (percent === undefined || isNaN(percent)) return "0%";
        return `${Math.min(Math.max(Math.round(percent), 0), 100)}%`;
    };

    return (
        <Card className={cn("pt-0 pb-0 dark:bg-[#323232] rounded-xl overflow-hidden relative h-full gap-0", className)}>
            <CardHeader className="relative h-54 p-0">
                <div className="relative w-full h-[120px]">
                    <img src={course?.image} alt={course?.name || "Course cover"} className="object-cover h-full w-full" />
                </div>
                <div className="pointer-events-none absolute top-0 right-0 flex flex-col items-end gap-2">
                    <div className="pointer-events-auto">
                        <Badge className={`absolute text-xs font-medium top-0 right-0 rounded-none rounded-bl-[4px] capitalize ${courseStatus === 'completed' ? 'bg-codegreen' : 'bg-codepink'} text-white py-1.5 px-3`}>{courseStatus}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-start px-3 py-1">
                <div>
                    <div className="flex items-start justify-start gap-2 mb-1">
                        <img src={course?.organization?.organization_logo} alt={course?.organization?.name || "Organization"}
                            className="rounded-[6px] bg-[#131313] border-[0.2px] border-white border-opacity-60 w-6 h-6 object-contain" />
                        <h1 className="text-balance text-[14px] font-bold leading-snug dark:text-white line-clamp-2">{course?.name}</h1>
                    </div>
                    <div>
                        <p className="mt-0 text-[10px] text-white font-normal line-clamp-2">{stripHtmlTags(course?.description)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 h-full">
                    <div className="flex justify-between items-center gap-2 col-span-1 py-1">
                        <div className="flex flex-col items-end justify-end gap-1">
                            <div className="flex items-center gap-1 text-sm">
                                <Clock5 className="text-[#00A8E9] size-4" />
                                <span className="font-normal text-[10px] text-white pt-1"> 2 Hours </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end gap-1">
                            <div className="flex items-center gap-1 text-sm">
                                <FaStar className="text-[#FFB700] size-3" />
                                <span className="font-normal text-[10px] text-white pt-1">{course?.course_meta?.rating} ({course?.course_meta?.num_people_rated})</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 pb-1 mt-auto">
                        <div className="flex flex-wrap items-center justify-start gap-1">
                            {skills?.slice(0, 3).map((skill:any, index:number) => (
                                <Badge key={`skill-${index}`} variant={'outline'} className="dark:text-white rounded-full px-2 pb-0.5 pt-1 text-[10px] font-normal border-[#00A8E9]">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 hidden">
                <p className="text-sm mb-1.5 pl-3 text-xs dark:text-white">{isCompleted ? 'Completed' : `${formatPercent(course?.completion)} Completed`}</p>
                <Progress value={course?.completion} className={cn("h-4 rounded-none dark:bg-[#5A5A5A] border-t")} />
            </div>
        </Card>
    )
}

