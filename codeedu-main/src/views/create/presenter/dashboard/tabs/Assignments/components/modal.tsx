import React, { useState } from 'react';
import { Eye, Download, Loader2, FileText, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { toast } from 'sonner';

const GRADES = ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1'] as const;

export interface SubmitGradingModalProps {
    open: boolean;
    onClose: () => void;
    /** Called when user clicks Submit Grade in modal; parent builds FormData and calls API */
    onSubmitGrade: (grade: string, feedback: string) => void | Promise<void>;
    isSubmitting?: boolean;
    studentName?: string;
    studentEmail?: string;
    studentProfileImage?: string;
    attachedFiles?: { name: string; url: string }[];
    isExternal?: boolean;
    initialFeedback?: string;
}


export default function SubmitGradingModal({
    open,
    onClose,
    onSubmitGrade,
    isSubmitting = false,
    studentName = 'Student',
    studentEmail = '',
    studentProfileImage,
    attachedFiles = [],
    isExternal = true,
    initialFeedback = '',
}: SubmitGradingModalProps) {

    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [feedback, setFeedback] = useState(initialFeedback);

    React.useEffect(() => {
        if (open) {
            setFeedback(initialFeedback);
        }
    }, [open, initialFeedback]);

    const handlePreviewAllFiles = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (attachedFiles.length === 0) {
            toast.info('No files to preview');
            return;
        }
        attachedFiles.forEach((f) => window.open(f.url, '_blank', 'noopener,noreferrer'));
    };

    const handleSubmitClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedGrade) {
            toast.error('Please select a grade');
            return;
        }
        void Promise.resolve(onSubmitGrade(selectedGrade, feedback));
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl bg-[#1c1c1c] text-white p-0 gap-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
                <DialogHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-white font-bold text-3xl">
                        Submit Grading
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 px-8 pb-8 gap-10">
                    {/* Left side: Profile, Files, Feedback */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#404040]/50 p-6 rounded-[30px] flex flex-col gap-6">
                            {/* Student profile card */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 rounded-full shrink-0">
                                    <AvatarImage src={studentProfileImage} alt={studentName} className="object-cover" />
                                    <AvatarFallback className="bg-[#404040] text-white">
                                        {studentName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-white font-semibold text-lg truncate">{studentName}</p>
                                    <p className="text-neutral-400 text-sm truncate">{studentEmail || '—'}</p>
                                </div>
                            </div>

                            {/* Attached Files */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-neutral-400 text-xs font-medium">Attached Files ({attachedFiles.length})</p>
                                    <p className="text-neutral-500 text-xs">Latest File (Top)</p>
                                </div>
                                <div className="space-y-2">
                                    {attachedFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-neutral-400" />
                                                <span className="text-neutral-200 text-sm truncate max-w-[200px]">{f.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => window.open(f.url, '_blank')}
                                                    className="text-sky-500 hover:text-sky-400 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <a href={f.url} download className="text-sky-500 hover:text-sky-400 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePreviewAllFiles}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00AEEF] hover:bg-[#0092c8] text-white text-sm font-semibold transition-colors mt-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview All Files
                                </button>
                            </div>
                        </div>


                        {/* Feedback Section */}
                        <div className="space-y-3">
                            <p className="text-neutral-400 text-sm font-medium">Feedback</p>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Write your detailed feedback for the student..."
                                className="w-full h-32 bg-[#404040]/50 text-white p-4 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder:text-neutral-500 text-sm"
                            />
                            <p className="text-neutral-500 text-xs">{feedback.length} characters</p>
                        </div>
                    </div>

                    {/* Right side: Marks and Submit */}
                    <div className="flex flex-col">
                        <p className="text-white text-lg font-medium mb-6">Mark the Student</p>
                        <div className="grid grid-cols-6 gap-2">
                            {GRADES.map((grade) => (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => setSelectedGrade(grade)}
                                    className={cn(
                                        'h-12 w-full rounded-lg text-sm font-medium transition-all flex items-center justify-center',
                                        selectedGrade === grade
                                            ? 'bg-[#82c91e] text-[#1c1c1c]'
                                            : 'bg-[#404040] text-neutral-300 hover:bg-[#4d4d4d]'
                                    )}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                        <p className="text-neutral-400 text-xs mt-4 text-right">Minimum Passing Marks = 6</p>

                        <div className="mt-auto flex justify-end">
                            <button
                                type="button"
                                onClick={(e) => handleSubmitClick(e)}
                                disabled={!selectedGrade || isSubmitting}
                                className={cn(
                                    'w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50',
                                    selectedGrade
                                        ? 'bg-[#82c91e] hover:bg-[#74b816] text-[#1c1c1c]'
                                        : 'bg-[#404040] text-neutral-500',
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <div className="bg-white/20 rounded-full p-2 mb-1">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        <span className="text-sm font-bold text-center leading-tight">Submit<br />Grade</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
