// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"
// import { Course } from "@/@types/learner/Courses"
// import { stripHtmlTags } from "@/utils/stripHtmlTags"
// import { FaStar } from "react-icons/fa";
// import { ArrowRight, Clock4 } from "lucide-react"


// interface MyCourseCardProps {
//     course: Course
//     className?: string
//     /**
//      * Tailors the card layout to match the "My Courses" card proportions.
//      * Used only in the dashboard "Recommended" and "Explore" sections.
//      */
//     variant?: "default" | "myCourses"
// }

// export default function CourseCard({ course, className, variant = "default" }: MyCourseCardProps) {

//     const skills = course?.skills || [];
//     const isMyCoursesVariant = variant === "myCourses";

//     return (
//         <Card className={cn("pt-0 pb-0 gap-0 dark:bg-[#323232] rounded-xl overflow-hidden relative h-full", className)}>
//             <CardHeader className="relative aspect-video p-0 overflow-hidden border-b-0">
//                 <div className="relative h-full w-full">
//                     <img
//                         src={course?.image}
//                         alt={course?.name || "Course cover"}
//                         className="object-cover w-full h-full"
//                     />

//                 </div>
//                 <style dangerouslySetInnerHTML={{
//                     __html: `
//                     @keyframes short-blink {
//                         0%, 100% { opacity: 1; }
//                         50% { opacity: 0.3; }
//                     }
//                     .animate-short-blink {
//                         animation: short-blink 1s ease-in-out infinite;
//                     }
//                 `}} />

//                 <div className="absolute top-0 right-0 flex flex-col items-end z-10">
//                     {course?.subscription_type !== null && <div className={cn(
//                         "text-white px-6 py-2 rounded-bl-xl font-bold text-lg shadow-md transition-transform hover:scale-105",
//                         (course?.subscription_type === 'free' || course?.subscription_type === 'open') ? 'bg-[#FF0080]' : 'bg-[#84cc16]'
//                     )}>
//                         {
//                             course?.subscription_type === null
//                                 ? ''
//                                 : (course?.subscription_type === 'free' || course?.subscription_type === 'open')
//                                     ? 'Starter'
//                                     : 'Pro'
//                         }
//                     </div>}
//                     {course?.course_meta?.number_of_credits && (
//                         <div className="mt-2 bg-white backdrop-blur-sm text-black px-6 py-1.5 rounded-l-xl font-bold text-lg shadow-md border-y border-l border-gray-100/50">
//                             {course?.course_meta?.number_of_credits} Credits
//                         </div>
//                     )}
//                 </div>

//                 {course?.subscription_type === 'paid' && course?.course_meta?.tuition_fee && (
//                     <div className="absolute top-0 left-0 bg-primary text-white py-4 px-1.5 rounded-br-2xl shadow-lg z-10 animate-short-blink">
//                         <span className="[writing-mode:vertical-rl] font-bold text-[10px] uppercase tracking-tighter block rotate-180">
//                             Price: {course?.course_meta?.tuition_fee || "$0"}
//                         </span>
//                     </div>
//                 )}
//                 <div className="pointer-events-none absolute top-0 right-0 flex flex-col items-end gap-2">
//                     <div className="pointer-events-auto">
//                     </div>
//                 </div>
//             </CardHeader>
//                     <p
//                         className={cn(
//                             "text-sm text-muted-foreground line-clamp-2 mt-0.5"
//                         )}
//                     >
//                         {stripHtmlTags(course?.description)}
//                     </p>
//                 </div>
//                 <div className={cn("grid grid-cols-3 gap-2 mt-auto items-center", isMyCoursesVariant && "gap-1.5")}>
//                     {/* "myCourses" variant reserves no extra bottom space (unlike MyCourseCard's progress overlay) */}
//                     <div className="col-span-2">
//                         <div className={cn("flex items-center gap-2 text-primary", isMyCoursesVariant ? "min-h-[16px]" : "")}>
//                             {course?.course_meta?.duration ? (
//                                 <>
//                                     <Clock4 size={20} />
//                                     <span className="text-sm text-muted-foreground">{course?.course_meta?.duration} hrs</span>
//                                 </>
//                             ) : null}
//                         </div>
//                         <div
//                             className={cn(
//                                 "flex flex-wrap gap-2 py-2",
//                                 isMyCoursesVariant ? "min-h-[30px]" : "mt-2"
//                             )}
//                         >
//                             {skills?.slice(0, 3).map((skill, index) => (
//                                 <Badge key={`skill-${index}`} variant={'outline'} className="dark:text-white rounded-full px-2 py-1 text-xs border-primary">{skill}</Badge>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="flex flex-col justify-end items-end gap-2 col-span-1">
//                         <div className={cn("flex flex-col items-end justify-end gap-1", isMyCoursesVariant ? "min-h-[16px]" : "")}>
//                             {/* <h6 className="text-primary text-sm">{course?.subscription_type === 'open' ? 'Free' : 'Paid'}</h6> */}
//                             {course?.course_meta?.rating ? (
//                                 <div className="flex items-center gap-1 text-sm">
//                                     <FaStar className="text-yellow-400 size-4" />
//                                     <span className="font-semibold">
//                                         {course?.course_meta?.rating}
//                                         {course?.course_meta?.num_people_rated && ` (${course?.course_meta?.num_people_rated})`}
//                                     </span>
//                                 </div>
//                             ) : null}
//                         </div>
//                         <button className={cn("rounded-xl h-[70px] sm:h-[80px] flex flex-col items-center justify-center w-[75px] sm:w-[85px] bg-primary text-black px-2 py-2 sm:px-3 sm:py-3 shadow-sm", "hover:opacity-90 transition-opacity")}>
//                             <ArrowRight className="size-4" />
//                             <span className="text-[10px] sm:text-xs md:text-sm text-black font-semibold text-center leading-tight">
//                                 View Details
//                             </span>
//                         </button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Course } from "@/@types/learner/Courses"
import { stripHtmlTags } from "@/utils/stripHtmlTags"
import { FaStar } from "react-icons/fa";
import { ArrowRight, Clock4 } from "lucide-react"
import { useSearchParams } from 'react-router-dom';


interface MyCourseCardProps {
    course: Course
    className?: string
    index?: number
}

export default function CourseCard({ course, className }: MyCourseCardProps) {
    const [searchParams] = useSearchParams();
    const cci = searchParams.get('cci');

    const skills = course?.skills || [];

    return (
        <Card className={cn("pt-0 pb-0 dark:bg-[#323232] rounded-xl overflow-hidden relative h-full", className)}>
            <CardHeader className="relative h-54 p-0">
                <div className="relative h-full w-full">
                    <img src={course?.image} alt={course?.name || "Course cover"} className="object-contain h-54 w-full" />

                    {/* Removed overlay completion bar, moved to bottom of card */}
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes short-blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                    .animate-short-blink {
                        animation: short-blink 1s ease-in-out infinite;
                    }
                `}} />

                <div className="absolute top-0 right-0 flex flex-col items-end z-10">
                    {cci !== '1' && (
                        <div className={cn(
                            "px-6 py-2 rounded-bl-xl font-bold text-lg shadow-md transition-transform hover:scale-105",
                            (course?.course_meta?.mode_of_delivery === 'Live Online' || course?.course_meta?.mode_of_delivery === 'Live-Online') ? 'bg-[#84cc16] text-white' :
                                (course?.course_meta?.mode_of_delivery === 'In Class' || course?.course_meta?.mode_of_delivery === 'In-Class') ? 'bg-[#FFEC00] text-black' :
                                    'bg-[#FF0080] text-white'
                        )}>
                            {(course?.course_meta?.mode_of_delivery === 'Live Online' || course?.course_meta?.mode_of_delivery === 'Live-Online') ? 'Pro' :
                                (course?.course_meta?.mode_of_delivery === 'In Class' || course?.course_meta?.mode_of_delivery === 'In-Class') ? 'Max' :
                                    'Starter'}
                        </div>
                    )}
                    {/* {course?.course_meta?.number_of_credits && (
                        <div className="mt-2 bg-white backdrop-blur-sm text-black px-6 py-1.5 rounded-l-xl font-bold text-lg shadow-md border-y border-l border-gray-100/50">
                            {course?.course_meta?.number_of_credits} Credits
                        </div>
                    )} */}
                </div>

                {/* {course?.subscription_type === 'paid' && course?.course_meta?.tuition_fee && (
                    <div className="absolute top-0 left-0 bg-primary text-white py-4 px-1.5 rounded-br-2xl shadow-lg z-10 animate-short-blink">
                        <span className="[writing-mode:vertical-rl] font-bold text-[10px] uppercase tracking-tighter block rotate-180">
                            Price: {course?.course_meta?.tuition_fee || "$0"}
                        </span>
                    </div>
                )} */}
                <div className="pointer-events-none absolute top-0 right-0 flex flex-col items-end gap-2">
                    <div className="pointer-events-auto">
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between p-3">
                <div>
                    <div className="flex items-center justify-start gap-2 mb-1">
                        <img src={course?.organization?.organization_logo} alt={course?.organization?.name || "Organization"}
                            className="rounded-xl bg-muted border w-10 h-10 bg-[#131313] object-contain" />
                        <h1 className="text-balance text-lg font-bold leading-snug line-clamp-3 dark:text-white">{course?.name}</h1>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{stripHtmlTags(course?.description)}</p>
                </div>
                <div className="mt-2">
                    {/* Duration & Rating Row */}
                    <div className="flex items-center justify-between mb-3">
                        {course?.course_meta?.duration && (
                            <div className="flex items-center gap-2 text-primary">
                                <Clock4 size={18} />
                                <span className="text-sm text-muted-foreground">
                                    {course?.course_meta?.duration} hrs
                                </span>
                            </div>
                        )}

                        {course?.course_meta?.rating && (
                            <div className="flex items-center gap-1 text-sm">
                                <FaStar className="text-yellow-400 size-4" />
                                <span className="font-semibold">
                                    {course?.course_meta?.rating}
                                    {course?.course_meta?.num_people_rated &&
                                        ` (${course?.course_meta?.num_people_rated})`}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Skills + Button Row */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 flex flex-col justify-between">
                            <div className="flex flex-wrap gap-2">
                                {skills?.slice(0, 3).map((skill, index) => (
                                    <Badge
                                        key={`skill-${index}`}
                                        variant="outline"
                                        className="dark:text-white rounded-full px-2 py-1 text-xs border-primary"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end items-end col-span-1">
                            <button
                                className={cn(
                                    "rounded-xl h-[80px] flex flex-col items-center justify-center w-[85px] bg-codeblue text-black px-3 py-3 shadow-sm",
                                    "hover:opacity-90 transition-opacity"
                                )}
                            >
                                <ArrowRight className="size-4" />
                                <span className="text-sm text-black mt-1 text-center leading-tight">
                                    {(course?.is_course_assigned || course?.is_assigned) ? 'View Details' : cci === '1' ? 'Enroll Now' : 'View Details'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
            {(course?.is_course_assigned || course?.is_assigned || course?.completion !== undefined) && (
                <div className="mt-2">
                    <div className="px-3 pb-2 text-sm text-gray-300 font-medium font-c">
                        {course?.completion || 0}% Completed
                    </div>
                    <Progress 
                        value={course?.completion || 0} 
                        className="h-1 bg-gray-700 rounded-none" 
                        indicatorClassName="bg-codeblue" 
                    />
                </div>
            )}
        </Card>
    )
}