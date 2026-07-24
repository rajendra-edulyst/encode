import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle2, Loader2, Paperclip, CircleSlash } from 'lucide-react';
import { fetchAssignmentSubmissionUsers } from '@/services/faculty/AssignmentService';
import { AssignmentLearner } from '@/@types/faculty/assignment';
import dayjs from 'dayjs';

interface StudentListProps {
    assignmentId: string | null;
    onSelect: (id: string) => void;
    selectedId: string | null;
    refreshKey?: number;
    searchQuery?: string;
    activeTab?: string;
}

/** Derive how many attachment URLs are in the submission field (comma/semicolon JSON array, or single URL). */
function getSubmissionFileCount(submission: string | null | undefined): number {
    if (submission == null || submission === '') return 0;
    const s = String(submission).trim();
    if (!s) return 0;
    try {
        const parsed = JSON.parse(s) as unknown;
        if (Array.isArray(parsed)) return parsed.filter(Boolean).length;
        if (parsed && typeof parsed === 'object' && 'files' in (parsed as Record<string, unknown>)) {
            const files = (parsed as { files?: unknown }).files;
            if (Array.isArray(files)) return files.filter(Boolean).length;
        }
    } catch {
        // not JSON
    }
    const parts = s.split(/[,;|]/).map((x) => x.trim()).filter(Boolean);
    if (parts.length > 0) return parts.length;
    return s.length > 0 ? 1 : 0;
}

const StudentList = ({ assignmentId, onSelect, selectedId, refreshKey, searchQuery = "", activeTab = "all" }: StudentListProps) => {
    const [learners, setLearners] = useState<AssignmentLearner[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getLearners = async () => {
            if (!assignmentId) return;
            try {
                setIsLoading(true);
                const data = await fetchAssignmentSubmissionUsers(assignmentId);
                setLearners(data);
                // Optionally select the first student if none selected
                // if (data.length > 0 && !selectedId) {
                //     onSelect(data[0].user_id.toString());
                // }
            } catch (error) {
                console.error("Failed to fetch learners:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getLearners();
    }, [assignmentId, refreshKey]);

    const stats = useMemo(() => {
        const total = learners.length;
        const submitted = learners.filter(l => l.latest_attempt_id !== null).length;
        const reviewed = learners.filter(l => l.grade !== null && l.grade !== "").length;
        const avgGrading = submitted > 0 ? Math.round((reviewed / submitted) * 100) : 0;

        return {
            total,
            submitted,
            reviewed,
            avgGrading
        };
    }, [learners]);

    const filteredLearners = useMemo(() => {
        let filtered = learners;

        // Apply tab filtering
        if (activeTab && activeTab !== "all") {
            filtered = filtered.filter(student => {
                const isGraded = student.grade && student.grade !== "";
                const isSubmitted = student.latest_attempt_id !== null;

                switch (activeTab) {
                    case "pending review":
                        return isSubmitted && !isGraded;
                    case "graded":
                        return isGraded;
                    case "active":
                        return !isSubmitted;
                    default:
                        return true;
                }
            });
        }

        if (!searchQuery) return filtered;
        const query = searchQuery.toLowerCase();
        return filtered.filter(l =>
            l.user_name.toLowerCase().includes(query) ||
            l.email.toLowerCase().includes(query)
        );
    }, [learners, searchQuery, activeTab]);

    if (!assignmentId) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1c1c1c] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <FileText className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    Select an assignment to<br />view students
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Loading Students...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-[1px] rounded-xl overflow-hidden bg-[#3f3f3f] border border-[#4a4a4a]">
                <div className="bg-[#343434] p-2.5 text-center">
                    <p className="text-white font-semibold text-[20px] leading-none">{stats.total}</p>
                    <p className="text-[#9d9d9d] text-xs mt-1">Total</p>
                </div>
                <div className="bg-[#343434] p-2.5 text-center">
                    <p className="text-[#8fd35a] font-semibold text-[20px] leading-none">{stats.submitted}</p>
                    <p className="text-[#9d9d9d] text-xs mt-1">Submitted</p>
                </div>
                <div className="bg-[#343434] p-2.5 text-center">
                    <p className="text-[#1db5ee] font-semibold text-[20px] leading-none">{stats.avgGrading}%</p>
                    <p className="text-[#9d9d9d] text-xs mt-1">Avg Grading</p>
                </div>
            </div>

            {/* Students List */}
            <div className="space-y-3">
                {filteredLearners.length === 0 ? (
                    <div className="py-20 text-center text-neutral-500 font-medium bg-[#1c1c1c] rounded-2xl border border-white/5">
                        {searchQuery ? "No students match your search." : "No students found for this assignment."}
                    </div>
                ) : (
                    filteredLearners.map((student) => {
                        const isGraded = student.grade && student.grade !== "";
                        const isSubmitted = student.submission_date !== null;
                        const hasSubmitted = student.latest_attempt_id !== null;
                        const isReviewed = isGraded;

                        // Only count files when there is a real submission; API may still send a stale `submission` string for non-submitters
                        const fileCount = hasSubmitted ? getSubmissionFileCount(student.submission) : 0;
                        const attachmentLabel =
                            !hasSubmitted || fileCount === 0 ? 'No File' : `${fileCount} file(s)`;

                        return (
                            <div
                                key={student.user_id}
                                onClick={() => onSelect(student.user_id.toString())}
                                className={cn(
                                    "bg-[#303030] border rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden",
                                    selectedId === student.user_id.toString()
                                        ? "border-sky-500 ring-1 ring-sky-500/50"
                                        : "border-[#3c3c3c] hover:border-[#4b4b4b]"
                                )}
                            >
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/5">
                                        <img src={student.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user_id}`} alt={student.user_name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-bold text-sm tracking-tight">{student.user_name}</h4>
                                                <p className="text-neutral-500 text-[10px] font-semibold">{student.email}</p>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                                !isSubmitted && "bg-pink-500/10 text-pink-500",
                                                isSubmitted && !isGraded && "bg-yellow-500/10 text-yellow-500",
                                                isGraded && "bg-sky-500/10 text-sky-400"
                                            )}>
                                                {isGraded ? "Graded" : isSubmitted ? "Submitted" : "Not Submitted"}
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {/* Status + attachment on one line (matches design: Submitted … paperclip N file(s) / Not Done … No File) */}
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px]">
                                                {hasSubmitted ? (
                                                    <>
                                                        <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                                                            <CheckCircle2 className="w-3 h-3 shrink-0 text-[#82c91e]" />
                                                            <span>Submitted</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 font-semibold text-neutral-400">
                                                            <Paperclip className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                                                            <span>{attachmentLabel}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-1.5 font-bold text-rose-400/90">
                                                            <CircleSlash className="w-3 h-3 shrink-0" />
                                                            <span>Not Done</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 font-semibold text-neutral-400">
                                                            <Paperclip className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                                                            <span>No File</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            {hasSubmitted && student.submission_date && (
                                                <p className="text-[9px] text-neutral-600 font-medium">
                                                    {dayjs(student.submission_date).format('MMM DD, YYYY, hh:mm A')}
                                                </p>
                                            )}
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

export default StudentList;
