import React, { useState } from 'react';
import { Button } from '@/components/ui/ShadcnButton';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import ApiService from '@/services/ApiService';
import { useSessionUser } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Loader2, ArrowRight } from "lucide-react";

interface AcknowledgementSurveyProps {
    onSuccess?: () => void;
}

const AcknowledgementSurvey: React.FC<AcknowledgementSurveyProps> = ({ onSuccess }) => {
    const { user } = useSessionUser();
    const userId = user?.id;
    const { id: programId } = useParams<{ id: string }>();
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
        }
    });

    const surveys = eventDetails?.program?.contents?.filter((c: any) => c.content_type === 'survey') || [];
    const surveyContentId = surveys.find((c: any) => c.title === 'Acknowledge Survey' || c.id === 9730)?.id || surveys[0]?.id;

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
        enabled: !!surveyContentId && !!userId
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
            formData.append('user_id', userId.toString());
            formData.append('user_ref_id', userId.toString());

            if (attemptedId) {
                formData.append('attempted_id', attemptedId.toString());
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

            toast.success("Survey submitted successfully");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error submitting survey", error);
            toast.error("Failed to submit survey");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h4 className="text-white font-bold mb-4">We value your feedback</h4>
            <div className="flex-grow flex flex-col gap-5 overflow-y-auto pr-2 pb-6">
                {loadingQuestions ? (
                    <div className="flex justify-center p-8"><p className="text-gray-400">Loading questions...</p></div>
                ) : !surveyQuestions || surveyQuestions.length === 0 ? (
                    <div className="flex justify-center p-8"><p className="text-gray-400">No survey questions found for this event.</p></div>
                ) : (
                    <div className="space-y-6">
                        {mcqRatingQuestions.length > 0 && (
                            <div className="space-y-4">
                                <div className="space-y-4 divide-y dark:divide-gray-700/50">
                                    {mcqRatingQuestions.map((q: any, i: number) => (
                                        <RadioGroup
                                            key={q.question_id}
                                            className="flex flex-col gap-2 py-3"
                                            value={answers[q.question_id]?.toString() || ""}
                                            onValueChange={(val) => handleAnswer(q.question_id, parseInt(val))}
                                        >
                                            <div className="text-sm font-medium text-gray-200 mb-2">
                                                {i + 1}. {q.question} <span className="text-red-500">*</span>
                                            </div>

                                            <div className="flex justify-between sm:justify-start sm:gap-12 px-2">
                                                {q.options?.map((opt: any, index: number) => {
                                                    const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
                                                    const labelText = opt.option_statement || labels[index] || (index + 1).toString();
                                                    return (
                                                        <label key={opt.option_id} className="flex flex-col items-center gap-2 cursor-pointer">
                                                            <span className="text-[10px] uppercase opacity-70 text-gray-400">{labelText}</span>
                                                            <RadioGroupItem
                                                                value={opt.option_id.toString()}
                                                                id={`q-${q.question_id}-${opt.option_id}`}
                                                                className="w-5 h-5 border border-gray-400 text-[#8cc63f]"
                                                            />
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </RadioGroup>
                                    ))}
                                </div>
                            </div>
                        )}

                        {subjectiveQuestions.length > 0 && (
                            <div className="space-y-4 pt-4 border-t dark:border-gray-700/50">
                                {subjectiveQuestions.map((q: any, i: number) => (
                                    <div key={q.question_id} className="space-y-2">
                                        <p className="font-medium text-xs text-gray-200">
                                            {mcqRatingQuestions.length + i + 1}. {q.question} <span className="text-red-500">*</span>
                                        </p>
                                        <Textarea
                                            placeholder="Type your answer here..."
                                            value={(answers[q.question_id] as string) || ""}
                                            onChange={(e) => handleAnswer(q.question_id, e.target.value)}
                                            rows={3}
                                            className="w-full resize-none bg-[#424242] border-none text-white rounded-lg px-4 py-3 focus-visible:ring-1 focus-visible:ring-[#8cc63f]"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {otherMcqQuestions.length > 0 && (
                            <div className="space-y-4 pt-4 border-t dark:border-gray-700/50">
                                {otherMcqQuestions.map((q: any, i: number) => (
                                    <div key={q.question_id} className="space-y-2">
                                        <p className="font-medium text-xs text-gray-200">
                                            {mcqRatingQuestions.length + subjectiveQuestions.length + i + 1}. {q.question} <span className="text-red-500">*</span>
                                        </p>
                                        <Select
                                            value={answers[q.question_id]?.toString() || ""}
                                            onValueChange={(val) => handleAnswer(q.question_id, parseInt(val))}
                                        >
                                            <SelectTrigger className="w-full bg-[#424242] border-none text-white rounded-lg px-4 h-11 focus:ring-1 focus:ring-[#8cc63f]">
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#323232] border-gray-700 text-white rounded-lg">
                                                {q.options?.map((opt: any) => (
                                                    <SelectItem key={opt.option_id} value={opt.option_id.toString()} className="focus:bg-[#424242] focus:text-white cursor-pointer py-2">
                                                        {opt.option_statement || opt.option_id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-auto flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={loading || loadingQuestions || !surveyContentId}
                    className="bg-[#8cc63f] hover:bg-[#7ab133] text-black font-medium w-[100px] h-[80px] rounded-[18px] flex flex-col items-center justify-center gap-1.5 p-0 shrink-0"
                >
                    {loading ? <Loader2 size={22} className="animate-spin text-black" /> : <ArrowRight size={22} className="stroke-[2] text-black" />}
                    <span className="text-base font-medium leading-none tracking-wide text-black">{loading ? '...' : 'Submit'}</span>
                </Button>
            </div>
        </div>
    );
};

export default AcknowledgementSurvey;
