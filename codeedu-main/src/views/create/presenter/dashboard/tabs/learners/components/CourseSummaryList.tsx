import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useInstructorLearnerCourseList } from '@/hooks/data/instructor/useInstructor';
import LoadingSection from '@/components/LoadingSection';

interface CourseSummaryListProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
    timeFilter?: string;
}

const CourseSummaryList = ({ onSelect, selectedId, timeFilter = 'yearly' }: CourseSummaryListProps) => {
    const { data: courses, isLoading } = useInstructorLearnerCourseList(timeFilter);

    if (isLoading) {
        return <LoadingSection isLoading={true} />;
    }

    if (!courses || courses.length === 0) {
        return <div className="text-neutral-500 p-4 text-center">No courses found.</div>;
    }

    return (
        <div className="space-y-4">
            {courses.map((course) => (
                <div
                    key={course.course_id}
                    onClick={() => onSelect(course.course_id.toString())}
                    className={cn(
                        "bg-[#2f2f2f] border rounded-2xl p-5 cursor-pointer transition-all duration-300",
                        selectedId === course.course_id.toString()
                            ? "border-sky-500 ring-1 ring-sky-500/50"
                            : "border-white/5 hover:border-white/10"
                    )}
                >
                    <div className="space-y-3">
                        <div>
                            <h4 className="text-white font-bold text-lg leading-tight tracking-tight">{course.course_name}</h4>
                            <p className="text-neutral-500 text-sm font-medium mt-1">{course.total_students} Students Enrolled</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
                                <span>Avg Progress</span>
                                <span className="text-neutral-400">{course.avg_progress}%</span>
                            </div>
                            <Progress
                                value={course.avg_progress}
                                className="h-1 bg-[#4b4b4b]"
                                indicatorClassName="bg-[#00a8e9]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                            <div className="bg-[#00a8e9] border border-[#00a8e9]/30 rounded-lg py-2.5">
                                <p className="text-white font-semibold text-base leading-none tabular-nums">{course.active_students}</p>
                                <p className="text-white font-medium text-[10px] mt-1">Active</p>
                            </div>
                            <div className="bg-[#7fbc42] border border-[#7fbc42]/30 rounded-lg py-2.5">
                                <p className="text-black font-semibold text-base leading-none tabular-nums">{course.completed_students}</p>
                                <p className="text-black font-medium text-[10px] mt-1">Completed</p>
                            </div>
                            <div className="bg-[#e60086] border border-[#e60086]/30 rounded-lg py-2.5">
                                <p className="text-white font-semibold text-base leading-none tabular-nums">{course.avg_grade}%</p>
                                <p className="text-white font-medium text-[10px] mt-1">Avg Grade</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseSummaryList;
