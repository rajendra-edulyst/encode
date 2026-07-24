import React from 'react';
import { Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Assignment } from '@/@types/faculty/assignment';
import dayjs from 'dayjs';

interface AssignmentListProps {
    assignments: Assignment[];
    moduleNamesById: Record<number, string>;
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const AssignmentList = ({ assignments, moduleNamesById, onSelect, selectedId }: AssignmentListProps) => {
    return (
        <div className="space-y-4">
            {assignments.map((assignment) => {
                const moduleName =
                    moduleNamesById[assignment.module_id] ||
                    assignment.module_name ||
                    assignment.module_title ||
                    'Module Name Unavailable';
                const gradedCount = assignment.total_graded ?? assignment.total_submissions;
                const notSubmittedCount = assignment.total_not_submitted ?? Math.max(assignment.total_learner - assignment.total_submissions, 0);
                const pendingCount = assignment.total_pending ?? Math.max(assignment.total_submissions - gradedCount, 0);

                return (
                    <div
                        key={assignment.id}
                        onClick={() => onSelect(assignment.id.toString())}
                        className={cn(
                            "bg-[#2e2f31] border rounded-2xl p-5 cursor-pointer transition-all duration-300",
                            selectedId === assignment.id.toString()
                                ? "border-[#03b8ff] ring-1 ring-[#03b8ff]/60"
                                : "border-[#3b3d40] hover:border-[#4a4d52]"
                        )}
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-white font-extrabold text-[14px] tracking-tight">{assignment.title}</h4>
                                    <p className="text-[#a5a7ab] text-[11px] font-semibold">{moduleName}</p>
                                    <p className="text-[#8f9399] text-[10px] font-medium">{assignment.program_name}</p>
                                </div>
                                <div className={cn(
                                    "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border shrink-0",
                                    assignment.is_external === 1
                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                    {assignment.is_external === 1 ? "External" : "Internal"}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[#a5a7ab] text-[10px] font-bold">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due: {dayjs(assignment.end_date).format('MMM DD, YYYY')}</span>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#a5a7ab]">
                                    <span>Submissions</span>
                                    <span className="text-[#d4d6da]">{assignment.total_submissions}/{assignment.total_learner}</span>
                                </div>
                                <Progress
                                    value={assignment.total_learner > 0 ? (assignment.total_submissions / assignment.total_learner) * 100 : 0}
                                    className="h-1.5 bg-[#6b6e74]/40"
                                    indicatorClassName="bg-[#00b4ff]"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="bg-[#7ccc3d] rounded-lg py-2 px-1">
                                    <p className="text-[#23320d] font-black text-xs">{gradedCount}</p>
                                    <p className="text-[#23320d] font-bold text-[8px] tracking-wide">Graded</p>
                                </div>
                                <div className="bg-[#f0008c] rounded-lg py-2 px-1">
                                    <p className="text-white font-black text-xs">{notSubmittedCount}</p>
                                    <p className="text-white font-bold text-[8px] tracking-wide">Not Sub.</p>
                                </div>
                                <div className="bg-[#ffe600] rounded-lg py-2 px-1">
                                    <p className="text-[#3d3400] font-black text-xs">{pendingCount}</p>
                                    <p className="text-[#3d3400] font-bold text-[8px] tracking-wide">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssignmentList;
