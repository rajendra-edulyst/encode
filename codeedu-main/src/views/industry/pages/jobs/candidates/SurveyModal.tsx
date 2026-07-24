import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import ApiService from '@/services/ApiService';
import { useSessionUser } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    userId: number | null;
    mecRegdId?: string | null;
    employType?: string | null;
    programId?: string | null;
    jobId?: string | null;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onSuccess, userId, mecRegdId, employType, programId, jobId }) => {
    const { user } = useSessionUser();
    const [loading, setLoading] = useState(false);

    const [answers, setAnswers] = useState<Record<number, string | number>>({});

    const handleAnswer = (questionId: number, answer: string | number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const { data: eventDetails } = useQuery({
        queryKey: ['eventDetails', programId],
        queryFn: async () => {
            const pid = programId || '9089';
            const res = await ApiService.fetchDataWithAxios<{ data: { competitions_details: any } }>({
                url: `competitins-details/${pid}?event_type=Career+Drive`,
                method: 'get'
            });
            return res.data?.competitions_details;
        },
        enabled: isOpen
    });

    const surveyContentId = eventDetails?.program?.contents?.find((c: any) => c.content_type === 'survey')?.id;

    const { data: fetchResult, isLoading: loadingQuestions } = useQuery({
        queryKey: ['surveyQuestions', surveyContentId, userId],
        queryFn: async () => {
            if (!surveyContentId) return null;
            const res = await ApiService.fetchDataWithAxios<{ data: { attempted_id: number, assessment_details: { questions: any[] } } }>({
                url: `assessment-detail/${surveyContentId}`,
                method: 'get',
                params: { student_id: userId }
            });
            return res.data;
        },
        enabled: !!surveyContentId && !!userId && isOpen
    });

    const surveyQuestions = fetchResult?.assessment_details?.questions || [];
    const attemptedId = fetchResult?.attempted_id;

    const mcqRatingQuestions = surveyQuestions?.filter((q: any) => q.question_type === 'MCQ' && q.options?.some((o: any) => o.option_statement === 'Poor')) || [];
    const otherMcqQuestions = surveyQuestions?.filter((q: any) => q.question_type === 'MCQ' && !q.options?.some((o: any) => o.option_statement === 'Poor')) || [];
    const subjectiveQuestions = surveyQuestions?.filter((q: any) => q.question_type === 'Text') || [];

    const handleSubmit = async () => {
        if (!userId || !surveyContentId) {
            toast.error("Survey details not loaded completely");
            return;
        }

        const missingAnswers = surveyQuestions.filter((q: any) => {
            const answer = answers[q.question_id];
            return answer === undefined || answer === null || answer === '';
        });

        if (missingAnswers.length > 0) {
            toast.error("Please answer all questions before submitting.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('content_id', surveyContentId.toString());
            formData.append('durationSec', '0');
            if (user?.id) {
                formData.append('user_id', user.id.toString());
            }
            formData.append('user_ref_id', userId.toString());
            if (attemptedId) {
                formData.append('attempted_id', attemptedId.toString());
            }

            if (mecRegdId) {
                formData.append('mec_regd_id', mecRegdId);
            }
            if (employType) {
                formData.append('employ_type', employType);
            }

            let index = 0;

            // Submit MCQs
            [...mcqRatingQuestions, ...otherMcqQuestions].forEach((q: any) => {
                formData.append(`answers[${index}][question_id]`, q.question_id.toString());
                formData.append(`answers[${index}][mark_review]`, '0');
                if (answers[q.question_id]) {
                    formData.append(`answers[${index}][option_id][]`, answers[q.question_id].toString());
                }
                index++;
            });

            // Submit Subjective
            subjectiveQuestions.forEach((q: any) => {
                formData.append(`answers[${index}][question_id]`, q.question_id.toString());
                formData.append(`answers[${index}][mark_review]`, '0');
                if (answers[q.question_id]) {
                    formData.append(`answers[${index}][answer_statement]`, answers[q.question_id].toString());
                }
                index++;
            });

            await ApiService.fetchDataWithAxios({
                url: '/assessment-submit-bulk',
                method: 'post',
                data: formData as any,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle Job Status Update based on 'Can be hired' question
            const hiredQuestion = surveyQuestions?.find((q: any) => q.question?.toLowerCase().includes('can be hired'));
            let jobStatusText = "application_under_process";

            if (hiredQuestion && answers[hiredQuestion.question_id]) {
                const selectedOptionId = answers[hiredQuestion.question_id];
                const selectedOption = hiredQuestion.options?.find((o: any) => o.option_id == selectedOptionId);

                if (selectedOption) {
                    const statement = selectedOption.option_statement?.toLowerCase();
                    if (statement === 'no') {
                        jobStatusText = 'unable_to_offer_position';
                    } else if (statement === 'yes') {
                        jobStatusText = 'congratulations_selected_for_the_position';
                    } else if (statement === 'shortlisted') {
                        jobStatusText = 'application_shortlised';
                    } else if (statement === 'round 2') {
                        jobStatusText = 'round_2';
                    } else if (statement === 'round 3') {
                        jobStatusText = 'round_3';
                    }
                }
            }

            if (jobId && userId) {
                await ApiService.fetchDataWithAxios({
                    url: '/job-status-update',
                    method: 'post',
                    data: {
                        program_id: String(jobId),
                        user_ref_id: String(userId),
                        job_status_text: String(jobStatusText),
                        auth_id: String(user?.id || '')
                    }

                });
            }

            toast.success("Survey submitted successfully");
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Error submitting survey", error);
            toast.error("Failed to submit survey");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-[#323232] dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-primary">Placement & Jobs Survey</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {loadingQuestions ? (
                        <div className="flex justify-center p-4"><p>Loading questions...</p></div>
                    ) : !surveyQuestions || surveyQuestions.length === 0 ? (
                        <div className="flex justify-center p-4"><p>No survey questions found.</p></div>
                    ) : (
                        <>
                            {mcqRatingQuestions.length > 0 && (
                                <>
                                    <div className="space-y-4 divide-y dark:divide-gray-700/50 border-b dark:border-gray-700 pb-4">
                                        {mcqRatingQuestions.map((q: any, i: number) => (
                                            <RadioGroup
                                                key={q.question_id}
                                                className="flex flex-col gap-2 py-3"
                                                value={answers[q.question_id]?.toString() || ""}
                                                onValueChange={(val) => handleAnswer(q.question_id, parseInt(val))}
                                            >
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                                    {i + 1}. {q.question} <span className="text-red-500">*</span>
                                                </div>

                                                <div className="flex justify-between sm:justify-start sm:gap-12 px-2">
                                                    {q.options?.map((opt: any, index: number) => {
                                                        const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
                                                        const labelText = opt.option_statement || labels[index] || (index + 1).toString();
                                                        return (
                                                            <label key={opt.option_id} className="flex flex-col items-center gap-2 cursor-pointer">
                                                                <span className="text-[10px] uppercase opacity-70 text-gray-500">{labelText}</span>
                                                                <RadioGroupItem
                                                                    value={opt.option_id.toString()}
                                                                    id={`q-${q.question_id}-${opt.option_id}`}
                                                                    className="w-5 h-5 border-2"
                                                                />
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </RadioGroup>
                                        ))}
                                    </div>
                                </>
                            )}

                            {subjectiveQuestions.length > 0 && (
                                <div className="grid grid-cols-1 gap-4 pt-2">
                                    {subjectiveQuestions.map((q: any, i: number) => (
                                        <div key={q.question_id} className="space-y-2">
                                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                                {mcqRatingQuestions.length + i + 1}. {q.question} <span className="text-red-500">*</span>
                                            </p>
                                            <Textarea
                                                placeholder="Enter remarks..."
                                                value={(answers[q.question_id] as string) || ""}
                                                onChange={(e) => handleAnswer(q.question_id, e.target.value)}
                                                rows={3}
                                                className="w-full resize-none dark:bg-[#404040] dark:border-gray-600 dark:text-gray-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {otherMcqQuestions.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {otherMcqQuestions.map((q: any, i: number) => (
                                        <div key={q.question_id} className="space-y-2">
                                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                                {mcqRatingQuestions.length + subjectiveQuestions.length + i + 1}. {q.question} <span className="text-red-500">*</span>
                                            </p>
                                            <Select
                                                value={answers[q.question_id]?.toString() || ""}
                                                onValueChange={(val) => handleAnswer(q.question_id, parseInt(val))}
                                            >
                                                <SelectTrigger className="w-full dark:bg-[#404040] dark:border-gray-600 dark:text-gray-200">
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-[#323232] dark:border-gray-700">
                                                    {q.options?.map((opt: any) => (
                                                        <SelectItem key={opt.option_id} value={opt.option_id.toString()}>
                                                            {opt.option_statement || opt.option_id}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading} className="!rounded-button">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || loadingQuestions || !surveyContentId} className="!rounded-button text-white">
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SurveyModal;
