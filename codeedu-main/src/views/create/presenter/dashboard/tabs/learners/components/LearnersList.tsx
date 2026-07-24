import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';
import { useInstructorLearnerList } from '@/hooks/data/instructor/useInstructor';
import LoadingSection from '@/components/LoadingSection';

interface LearnersListProps {
    courseId: string | null;
    onSelect: (id: string | null) => void;
    selectedId: string | null;
    searchQuery?: string;
    activeTab?: string;
}

const LearnersList = ({ courseId, onSelect, selectedId, searchQuery = "", activeTab = "all" }: LearnersListProps) => {
    const { data, isLoading } = useInstructorLearnerList(courseId || "");

    if (!courseId) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#2f2f2f] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <Users className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    Select a course to<br />view learners
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSection isLoading={true} />;
    }

    const allLearners = data?.learners || [];
    const stats = data?.stats;

    const tab = activeTab.toLowerCase();

    const matchesLearnerTab = (learner: (typeof allLearners)[0]) => {
        if (tab === "all") return true;
        const isActive = learner.status === "ACTIVE";
        const isCompleted = learner.status === "COMPLETED";
        if (tab === "active") return isActive;
        if (tab === "completed") return isCompleted;
        if (tab === "pending review") return isActive && learner.progress < 100;
        if (tab === "graded") return isCompleted || learner.progress >= 100;
        return true;
    };

    const filteredLearners = allLearners.filter((learner) => {
        const matchesSearch =
            learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            learner.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && matchesLearnerTab(learner);
    });

    return (
        <div className="space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#2f2f2f] px-4 py-4 border border-white/5">
                <div className="text-center">
                    <p className="text-white font-semibold text-2xl leading-none tabular-nums">{stats?.total ?? 0}</p>
                    <p className="text-neutral-500 font-medium text-xs mt-1.5">Total</p>
                </div>
                <div className="text-center">
                    <p className="text-[#7fbc42] font-semibold text-2xl leading-none tabular-nums">{stats?.completed ?? 0}</p>
                    <p className="text-neutral-500 font-medium text-xs mt-1.5">Completed</p>
                </div>
                <div className="text-center">
                    <p className="text-[#e60086] font-semibold text-2xl leading-none tabular-nums">{stats?.avg_grading ?? 0}%</p>
                    <p className="text-neutral-500 font-medium text-xs mt-1.5">Avg Grading</p>
                </div>
            </div>

            {/* Learners List */}
            <div className="space-y-3">
                {filteredLearners.length === 0 ? (
                    <div className="text-neutral-500 p-8 text-center text-xs font-bold italic border border-white/5 border-dashed rounded-2xl bg-[#2f2f2f]">
                        No learners found matching your filter
                    </div>
                ) : (
                    filteredLearners.map((learner) => {
                        const isActive = learner.status === 'ACTIVE';
                        const isCompleted = learner.status === 'COMPLETED';

                        return (
                            <div
                                key={learner.id}
                                onClick={() => onSelect(learner.id.toString())}
                                className={cn(
                                    "bg-[#2f2f2f] border rounded-2xl p-4 cursor-pointer transition-all duration-300",
                                    selectedId === learner.id.toString()
                                        ? "border-sky-500 ring-1 ring-sky-500/50"
                                        : "border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/5">
                                        <img
                                            src={learner.image || `https://api.dicebear.com/7.x/initials/svg?seed=${learner.name}`}
                                            alt={learner.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-white font-bold text-sm leading-tight tracking-tight truncate" title={learner.name}>{learner.name}</h4>
                                                <p className="text-neutral-500 text-xs font-normal mt-1 truncate" title={learner.email}>{learner.email}</p>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-lg text-xs font-semibold tracking-tight",
                                                isActive && "bg-[#00a8e9]/10 text-[#00a8e9]",
                                                isCompleted && "bg-[#7fbc42]/10 text-[#7fbc42]"
                                            )}>
                                                {isActive ? 'Active' : isCompleted ? 'Completed' : learner.status}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-medium text-neutral-500 tracking-tight">
                                                <span>Course Progress</span>
                                                <span className="text-neutral-300 font-semibold tabular-nums">{learner.progress}%</span>
                                            </div>
                                            <Progress
                                                value={learner.progress}
                                                className="h-1.5 bg-[#4b4b4b]"
                                                indicatorClassName="bg-[#00a8e9]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LearnersList;
