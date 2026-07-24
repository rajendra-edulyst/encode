import React from 'react';
import { User, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useInstructorLearnerDetails } from '@/hooks/data/instructor/useInstructor';
import LoadingSection from '@/components/LoadingSection';

interface LearnerDetailPaneProps {
    courseId: string | null;
    learnerId: string | null;
}

const LearnerDetailPane = ({ courseId, learnerId }: LearnerDetailPaneProps) => {
    const { data, isLoading } = useInstructorLearnerDetails(courseId || "", learnerId || "");

    if (!learnerId) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#2f2f2f] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <User className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    Select a student to view<br />their dashboard
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSection isLoading={true} />;
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#2f2f2f] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    No data found for this student.
                </p>
            </div>
        );
    }

    const { user, overall_progress, modules, assessments, assignments, live_classes, total_hours } = data;

    const assessPending = Math.max(0, assessments.total - assessments.completed);
    const assignPending = Math.max(0, assignments.total - assignments.completed);

    return (
        <div className="bg-[#2f2f2f] border border-white/5 rounded-3xl p-6 flex flex-col gap-6">
            {/* Header — circular avatar like reference */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/10 ring-2 ring-white/5">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <h4 className="text-white font-bold text-lg tracking-tight truncate">{user.name}</h4>
                    <p className="text-neutral-500 text-xs font-normal truncate">{user.email}</p>
                    <p className="text-neutral-600 text-[10px] font-medium mt-1">
                        Enrolled: {user.enrolled_date}
                    </p>
                </div>
            </div>

            {/* Progress / Total hours / Attendance */}
            <div className="grid grid-cols-3 gap-3">
                <SummaryBox label="Progress" value={overall_progress} accent="sky" />
                <SummaryBox
                    label="Total Hours"
                    value={total_hours ?? "—"}
                    accent="pink"
                />
                <SummaryBox label="Attendance" value={live_classes.percentage} accent="orange" />
            </div>

            {/* Module Progress — no inner scroll; parent column scrolls (avoids nested scrollbar) */}
            <div className="space-y-3">
                <h5 className="text-neutral-500 text-[10px] font-semibold uppercase tracking-widest">
                    Module Progress
                </h5>
                <div className="space-y-3">
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            title={module.name}
                            grade={parseInt(module.grade.replace(/%/g, ""), 10) || 0}
                            progress={module.progress}
                        />
                    ))}
                    {modules.length === 0 && (
                        <p className="text-neutral-600 text-[10px] italic">No modules identified.</p>
                    )}
                </div>
            </div>

            {/* Assessments & Assignments — Completed / Pending rows */}
            <div className="grid grid-cols-2 gap-3">
                <ActivitySummary
                    icon={<FileText className="w-4 h-4 text-sky-400" />}
                    title="Assessments"
                    completed={assessments.completed}
                    pending={assessPending}
                />
                <ActivitySummary
                    icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    title="Assignments"
                    completed={assignments.completed}
                    pending={assignPending}
                />
            </div>

            {/* Achievements */}
            <div className="space-y-2">
                <h5 className="text-white text-sm font-semibold tracking-tight">Achievements</h5>
                <div className="bg-[#4b4b4b] rounded-2xl p-6 flex justify-around gap-8 border border-white/5">
                    <AchievementItem label="Certificates" value={0} />
                    <AchievementItem label="Badges" value={0} />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2">
                <h5 className="text-white text-sm font-semibold tracking-tight">Recent Activity</h5>
                <div className="rounded-2xl border border-white/5 bg-[#4b4b4b] p-4">
                    <p className="text-neutral-400 text-xs">
                        No recent activity data from API.
                    </p>
                </div>
            </div>
        </div>
    );
};

const SummaryBox = ({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent: "sky" | "pink" | "orange";
}) => {
    const accentClass: Record<string, string> = {
        sky: "text-sky-400",
        pink: "text-pink-400",
        orange: "text-orange-400",
    };
    return (
        <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] px-3 py-3 text-center">
            <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className={cn("font-semibold text-xl tabular-nums", accentClass[accent])}>{value}</p>
        </div>
    );
};

const ModuleCard = ({ title, grade, progress }: { title: string; grade: number; progress: number }) => (
    <div className="bg-[#4b4b4b] border border-white/5 rounded-2xl p-4 space-y-2">
        <div>
            <h6 className="text-white font-semibold text-sm leading-snug">{title}</h6>
            <p className="text-orange-400 font-medium text-xs mt-1.5">
                Grade: {grade}%
            </p>
        </div>
        <Progress value={progress} className="h-1.5 bg-[#2f2f2f]" indicatorClassName="bg-[#7fbc42]" />
        <div className="flex justify-end">
            <span className="text-neutral-500 font-medium text-[10px]">{progress}%</span>
        </div>
    </div>
);

const ActivitySummary = ({
    icon,
    title,
    completed,
    pending,
}: {
    icon: React.ReactNode;
    title: string;
    completed: number;
    pending: number;
}) => (
    <div className="rounded-2xl border border-white/10 bg-[#4b4b4b] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
            {icon}
            <h6 className="text-white font-semibold text-sm">{title}</h6>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">Completed</span>
                <span className="text-white font-semibold tabular-nums">{completed}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">Pending</span>
                <span className="text-white font-semibold tabular-nums">{pending}</span>
            </div>
        </div>
    </div>
);

const AchievementItem = ({ label, value }: { label: string; value: number }) => (
    <div className="text-center">
        <p className="text-white font-semibold text-3xl tabular-nums mb-1">{value}</p>
        <p className="text-neutral-500 font-medium text-xs">{label}</p>
    </div>
);

export default LearnerDetailPane;
