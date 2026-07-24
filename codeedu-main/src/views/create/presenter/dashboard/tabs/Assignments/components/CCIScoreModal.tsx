import React, { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { toast } from 'sonner';
import ApiService from '@/services/ApiService';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CCIScoreModalProps {
    open: boolean;
    onClose: () => void;
    /** User (student) ID */
    userId: string | number;
    /** CCI stage number, e.g. 2 */
    cciStage: string | number;
    /** Content type string, e.g. "assessment" */
    contentType: string;
    /** Content (assignment) ID */
    contentId: string | number;
    /** Optional: display info */
    studentName?: string;
    studentEmail?: string;
    studentProfileImage?: string;
    /** Called after a successful submission */
    onSuccess?: () => void;
}

// ─── Grade options ────────────────────────────────────────────────────────────

const GRADES = [
    '10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5',
    '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1',
] as const;

// ─── API call ─────────────────────────────────────────────────────────────────

async function submitCciScore(params: {
    user_id: string | number;
    cci_stage: string | number;
    content_type: string;
    content_id: string | number;
    score: string;
    feedback: string;
}): Promise<void> {
    const formData = new FormData();
    formData.append('user_id', String(params.user_id));
    formData.append('cci_stage', String(params.cci_stage));
    formData.append('content_type', params.content_type);
    formData.append('content_id', String(params.content_id));
    formData.append('score', params.score);
    if (params.feedback) {
        formData.append('feedback', params.feedback);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ApiService.fetchDataWithAxios<any>({
        url: 'update-cci-score',
        method: 'post',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: formData as any,
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CCIScoreModal({
    open,
    onClose,
    userId,
    cciStage,
    contentType,
    contentId,
    studentName = 'Student',
    studentEmail = '',
    studentProfileImage,
    onSuccess,
}: CCIScoreModalProps) {
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setSelectedGrade(null);
            setFeedback('');
        }
    }, [open]);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedGrade) {
            toast.error('Please select a score');
            return;
        }

        try {
            setIsSubmitting(true);
            await submitCciScore({
                user_id: userId,
                cci_stage: cciStage,
                content_type: contentType,
                content_id: contentId,
                score: selectedGrade,
                feedback,
            });
            toast.success('CCI score submitted successfully');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to submit CCI score:', err);
            toast.error('Failed to submit CCI score. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-3xl bg-[#1c1c1c] text-white p-0 gap-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
                <DialogHeader className="px-8 pt-8 pb-4">
                    <DialogTitle className="text-white font-bold text-3xl">
                        Submit CCI Score
                    </DialogTitle>
                    <p className="text-neutral-400 text-sm mt-1">
                        Stage {cciStage} · {contentType}
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 px-8 pb-8 gap-10">
                    {/* Left — Student info + Feedback */}
                    <div className="flex flex-col gap-6">
                        {/* Student card */}
                        <div className="bg-[#404040]/50 p-5 rounded-[24px] flex items-center gap-4">
                            <Avatar className="h-14 w-14 rounded-full shrink-0">
                                <AvatarImage src={studentProfileImage} alt={studentName} className="object-cover" />
                                <AvatarFallback className="bg-[#404040] text-white text-lg font-bold">
                                    {studentName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="text-white font-semibold text-lg truncate">{studentName}</p>
                                <p className="text-neutral-400 text-sm truncate">{studentEmail || '—'}</p>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="space-y-3 flex-1 flex flex-col">
                            <p className="text-neutral-400 text-sm font-medium">
                                Feedback <span className="text-neutral-600">(Optional)</span>
                            </p>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Write your feedback for this CCI stage..."
                                className="flex-1 min-h-[120px] w-full bg-[#404040]/50 text-white p-4 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder:text-neutral-500 text-sm"
                            />
                            <p className="text-neutral-500 text-xs text-right">{feedback.length} characters</p>
                        </div>
                    </div>

                    {/* Right — Score grid + Submit */}
                    <div className="flex flex-col gap-4">
                        <p className="text-white text-lg font-medium">Score the Student</p>

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
                                            : 'bg-[#404040] text-neutral-300 hover:bg-[#4d4d4d]',
                                    )}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>

                        <p className="text-neutral-400 text-xs text-right">Minimum Passing Score = 6</p>

                        <div className="mt-auto flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
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
                                        <span className="text-sm font-bold text-center leading-tight">Submit<br />Score</span>
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
