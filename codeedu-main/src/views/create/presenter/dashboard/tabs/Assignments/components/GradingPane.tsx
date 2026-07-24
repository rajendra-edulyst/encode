import React, { useEffect, useState } from 'react';
import { User, Star, Download, MessageSquareQuote, Loader2, FileText as FileIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { fetchAssignment, fetchUserAssignmentSubmission, fetchAssignmentSubmissionUsers, addReviewComment, assignAssignmentCertificate } from '@/services/faculty/AssignmentService';
import { Assignment, AssignmentSubmission, AssignmentLearner } from '@/@types/faculty/assignment';
import { toast } from 'sonner';
import SubmitGradingModal from './modal';

interface GradingPaneProps {
    assignmentId: string | null;
    studentId: string | null;
    onGradeUpdate?: () => void;
}

const GradingPane = ({ assignmentId, studentId, onGradeUpdate }: GradingPaneProps) => {
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
    const [feedback, setFeedback] = useState("");
    const [marks, setMarks] = useState<number | string>("");
    const [status, setStatus] = useState<string>("1");
    const [teacherFile, setTeacherFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCertifying, setIsCertifying] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState<AssignmentLearner | null>(null);

    const fetchData = async () => {
        if (!assignmentId || !studentId) return;
        try {
            setIsLoading(true);
            const [assignmentData, submissionData, learnersData] = await Promise.all([
                fetchAssignment(assignmentId),
                fetchUserAssignmentSubmission(assignmentId, parseInt(studentId)),
                fetchAssignmentSubmissionUsers(assignmentId),
            ]);
            setAssignment(assignmentData);
            const learner = learnersData?.find((l) => l.user_id === parseInt(studentId)) ?? null;
            setSelectedLearner(learner);
            if (submissionData && submissionData.length > 0) {
                const latestSubmission = submissionData[0];
                setSubmission(latestSubmission);
                setFeedback(latestSubmission.teacher_notes || "");
                setMarks(latestSubmission.marks_obtained !== null ? latestSubmission.marks_obtained : "");
                setStatus(latestSubmission.review_status?.toString() || "1");
            } else {
                setSubmission(null);
                setFeedback("");
                setMarks("");
                setStatus("1");
            }
        } catch (error) {
            console.error("Failed to fetch grading details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [assignmentId, studentId]);

    const handleOpenSubmitModal = () => {
        if (!submission || !assignment) return;
        setSubmitModalOpen(true);
    };

    const handleSubmitGrade = async (selectedGrade: string, modalFeedback: string) => {
        if (!submission || !assignment) return;

        const maximumMarks = assignment.maximum_marks ?? 0;
        if (maximumMarks !== 0 && marks !== "") {
            const numericMarks = Number(marks);
            if (numericMarks < 0 || numericMarks > maximumMarks) {
                toast.error(`Marks must be between 0 and ${maximumMarks}`);
                return;
            }
        }
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('content_id', assignment.id.toString());
            formData.append('user_id', studentId!);
            formData.append('id', submission.id.toString());
            formData.append('review_status', status);
            formData.append('teacher_notes', modalFeedback);
            formData.append('marks_obtained', selectedGrade);
            formData.append('is_graded', assignment.is_graded.toString());
            if (teacherFile) {
                formData.append('teacher_file', teacherFile);
            }
            await addReviewComment(formData);
            toast.success("Grade submitted successfully");
            setSubmitModalOpen(false);
            await fetchData();
            onGradeUpdate?.();
        } catch (error) {
            console.error("Failed to submit grade:", error);
            toast.error("Failed to submit grade");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignCertificate = async () => {
        if (!assignmentId || !studentId) return;
        try {
            setIsCertifying(true);
            await assignAssignmentCertificate(parseInt(assignmentId), parseInt(studentId));
            toast.success("Certificate assigned successfully");
            if (onGradeUpdate) onGradeUpdate();
        } catch (error) {
            console.error("Failed to assign certificate:", error);
            toast.error("Failed to assign certificate");
        } finally {
            setIsCertifying(false);
        }
    };

    if (!studentId) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1c1c1c] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <User className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    Select a student to grade<br />their assignment
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Loading Submission Details...</p>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1c1c1c] rounded-3xl border border-white/5 border-dashed p-10 text-center">
                <FileIcon className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-bold text-sm tracking-tight leading-relaxed">
                    Student has not submitted<br />this assignment yet.
                </p>
            </div>
        );
    }

    // Build attached files list
    const attachedFiles: { name: string; url: string }[] = [];
    if (submission.file) {
        attachedFiles.push({ name: submission.file.split('/').pop() || 'submission_file', url: submission.file });
    }
    if ((submission as any).teacher_file) {
        attachedFiles.push({ name: (submission as any).teacher_file.split('/').pop() || 'feedback_file', url: (submission as any).teacher_file });
    }

    // Submission status label
    const reviewStatusMap: Record<string, { label: string; color: string }> = {
        '0': { label: 'Pending Review', color: 'bg-yellow-600/80 text-yellow-100' },
        '1': { label: 'Reviewed', color: 'bg-sky-600/80 text-sky-100' },
        '2': { label: 'Accepted', color: 'bg-green-600/80 text-green-100' },
        '3': { label: 'Rejected', color: 'bg-red-600/80 text-red-100' },
    };
    const isGraded = (!!submission?.grade && submission?.grade !== "");
    const isDisabled = isGraded || selectedLearner?.is_external === 0;
    const reviewInfo = isGraded ? reviewStatusMap['1'] : reviewStatusMap['0'];

    const submittedDate = (submission as any).created_at
        ? new Date((submission as any).created_at).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
        })
        : null;

    return (
        <div className="bg-[#303030] border border-[#3f3f3f] rounded-2xl p-5 h-full flex flex-col gap-5 overflow-y-auto custom-scrollbar scrollbar-hide">

            {/* Header: Title + Student Info + Submit Grade button */}
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-medium text-xl leading-tight tracking-tight">Grade Assignment</h3>
                    <div className="flex items-center gap-3">
                        {selectedLearner?.profile_image ? (
                            <img
                                src={selectedLearner.profile_image}
                                alt={selectedLearner.user_name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-white/10"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-neutral-700 flex items-center justify-center border-2 border-white/10">
                                <User className="w-5 h-5 text-neutral-400" />
                            </div>
                        )}
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">
                                {selectedLearner?.user_name || 'Student'}
                            </p>
                            <p className="text-neutral-400 text-xs mt-0.5">
                                {selectedLearner?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOpenSubmitModal}
                    disabled={isDisabled}
                    className={cn(
                        "transition-all rounded-2xl w-24 h-24 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
                        isDisabled
                            ? "bg-transparent border-2 border-[#82c91e]/50 cursor-not-allowed opacity-60 grayscale"
                            : "bg-[#82c91e] hover:bg-[#74b816] shadow-lg shadow-[#82c91e]/20 active:scale-95"
                    )}
                >
                    <Star className={cn("w-5 h-5", isDisabled ? "text-[#82c91e]" : "text-[#1c1c1c]")} />
                    <span className={cn(
                        "font-black text-[9px] uppercase tracking-wider text-center leading-tight",
                        isDisabled ? "text-[#82c91e]" : "text-[#1c1c1c]"
                    )}>
                        {isGraded ? "Reviewed" : "Submit Grade"}
                    </span>
                </button>

            </div>

            {/* Submission Status */}
            <div className="space-y-2">
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                    Submission Status
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold", reviewInfo?.color)}>
                        {reviewInfo?.label}
                    </span>
                    {(submission?.grade) && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/80 text-purple-100">
                            Grade: {submission?.grade}
                        </span>
                    )}
                    {submittedDate && (
                        <span className="text-neutral-400 text-xs">Submitted: {submittedDate}</span>
                    )}
                </div>
            </div>

            {/* Attached Files */}
            <div className="space-y-3">
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                    Attached Files ({attachedFiles.length})
                </p>

                <div className="space-y-2">
                    {attachedFiles.map((file, idx) => (
                        <FileRow key={idx} name={file.name} url={file.url} />
                    ))}
                    {attachedFiles.length === 0 && (
                        <p className="text-neutral-600 text-xs italic">No files attached</p>
                    )}
                </div>

                {attachedFiles.length > 0 && (
                    <a
                        href={attachedFiles[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 active:scale-[0.98] transition-all rounded-xl py-2.5 text-white font-bold text-sm shadow-lg shadow-sky-500/20"
                    >
                        <Eye className="w-4 h-4" />
                        Preview All Files
                    </a>
                )}
            </div>


            <div className="flex-grow space-y-3 flex flex-col min-h-[140px]">
                <div className="flex items-center justify-between">
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                        Feedback <span className="text-neutral-600 font-normal">(Optional)</span>
                    </p>
                    <MessageSquareQuote className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="flex-grow min-h-0 relative">
                    <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={selectedLearner?.is_external === 0}
                        placeholder="Write your feedback for the student (optional)..."
                        className={cn(
                            "h-full min-h-[120px] bg-[#5a5a5a] border-white/5 text-white placeholder:text-neutral-200 rounded-2xl resize-none p-4 custom-scrollbar text-sm font-medium leading-relaxed",
                        )}
                    />
                    <span className="absolute bottom-4 right-4 text-neutral-700 text-[10px] font-black uppercase tracking-widest pointer-events-none">
                        {feedback.length} chars
                    </span>
                </div>
            </div>

            <SubmitGradingModal
                open={submitModalOpen}
                onClose={() => setSubmitModalOpen(false)}
                onSubmitGrade={handleSubmitGrade}
                isSubmitting={isSubmitting}
                studentName={selectedLearner?.user_name}
                studentEmail={selectedLearner?.email}
                studentProfileImage={selectedLearner?.profile_image}
                attachedFiles={attachedFiles}
                isExternal={selectedLearner?.is_external === 1}
                initialFeedback={feedback}
            />

        </div>
    );
};

const FileRow = ({ name, url }: { name: string; url: string }) => (
    <div className="flex items-center justify-between bg-[#2a2a2a] border border-white/[0.08] hover:border-white/15 transition-colors p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <FileTextIcon className="w-4 h-4 text-neutral-400" />
            </div>
            <span className="text-neutral-200 font-semibold text-sm truncate max-w-[160px]">{name}</span>
        </div>
        <a
            href={url}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-sky-400 hover:text-sky-300 transition-colors flex-shrink-0"
        >
            <Download className="w-4 h-4" />
        </a>
    </div>
);

const FileTextIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

export default GradingPane;