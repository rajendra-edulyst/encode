import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { assessmentQuestionSave, fetchQuestions, assesmentFinesh } from '@/services/learner/AssesmentService';
import { useAssesmentStore } from '@/store/learner/assesmentStore';
import { AssessmentAttempt } from '@/@types/learner/assessment';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Flag, Clock, ChevronLeft, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import Report from './components/Report';
import QuestionPalette from './components/QuestionPalette';
import QuestionNavigation from './components/QuestionNavigation';
import AssesmentHeader from './components/AssesmentHeader';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Review = React.lazy(() => import('./components/Review'));


const AssesmentAttempt: React.FC = () => {
    const { id, courseId } = useParams<{ id: string, courseId: string }>();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
    const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
    const [reviewDialog, setReviewDialog] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { assesment, setAssesment, loading, setLoading, error, setError } = useAssesmentStore();
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const autoSubmitRef = useRef<boolean>(false);

        };
    }, [timeLeft, assesment, handleAutoSubmit]);

    // Initial fetch
    useEffect(() => {    // Fetch assessment data
    const fetchAssessment = useCallback(async () => {
        setLoading(true);
        setError('');
        
        if (!id) {
            setError('Assessment Not Found, Please try again later');
            setLoading(false);
            return;
        }

        try {
            const assesmentData: AssessmentAttempt = await fetchQuestions(id);
            setAssesment(assesmentData);
            setTimeLeft(assesmentData.duration_in_minutes * 60);
            
            // Initialize answers from previous attempt if any
            const previousAnswers: Record<number, number | number[]> = {};
            assesmentData.questions.forEach((question, index) => {
                if (question.attempted) {
                    const attemptedOptions = question.options.filter(opt => opt.attempted);
                    if (attemptedOptions.length > 0) {
                        if (question.question_type === 'MSQ') {
                            previousAnswers[index] = attemptedOptions.map(opt => opt.option_id);
                        } else {
                            previousAnswers[index] = attemptedOptions[0].option_id;
                        }
                    }
                }
            });
            setAnswers(previousAnswers);
            
        } catch (error) {
            setError('Failed to fetch assessment, please try again later');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, setAssesment, setLoading, setError]);

    // Timer countdown with auto-submit
    useEffect(() => {
        if (timeLeft <= 0 || !assesment) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    // Auto-submit when time is up
                    if (!autoSubmitRef.current) {
                        autoSubmitRef.current = true;
                        handleAutoSubmit();
                    }
                    return 0;
                }
                
                // Warning when 5 minutes left
                if (prev === 300) {
                    toast.warning('Only 5 minutes remaining!', {
                        duration: 5000,
                    });
                }
                
                // Warning when 1 minute left
                if (prev === 60) {
                    toast.error('Only 1 minute remaining!', {
                        duration: 5000,
                    });
                }
                
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeLeft, assesment, handleAutoSubmit]);

    // Auto-submit handler
    // const handleAutoSubmit = useCallback(async () => {
        if (!id) return;
        
        try {
            await assesmentFinesh(id);
            toast.success('Assessment submitted successfully!');
            setReviewDialog(true);
        } catch (error) {
            console.error('Auto-submit failed:', error);
            toast.error('Failed to submit assessment. Please try again.');
        }
    }, [id]);

    // Initial fetch
    useEffect(() => {
        fetchAssessment();
    }, [fetchAssessment]);

    // Handle answer change with debouncing
    const handleAnswerChange = useCallback((value: number | number[]) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: value,
        }));

        if (!id || !assesment) {
            setError('Assessment Not Found, Please try again later');
            return;
        }

        setIsSaving(true);
        const data = {
            content_id: id,
            question_id: assesment.questions[currentQuestion].question_id,
            option_id: value,
            mark_review: markedForReview.has(currentQuestion) ? 1 : 0,
            durationSec: (assesment.duration_in_minutes * 60) - timeLeft,
        };

        assessmentQuestionSave(data)
            .then(() => {
                setIsSaving(false);
            })
            .catch((error: string) => {
                console.error('Save error:', error);
                toast.error('Failed to save answer');
                setIsSaving(false);
            });
    }, [currentQuestion, id, assesment, markedForReview, timeLeft, setError]);

    // Get question status
    const getQuestionStatus = useCallback((index: number): string => {
        if (markedForReview.has(index)) return 'review';
        if (answers[index] !== undefined) return 'answered';
        return 'unanswered';
    }, [answers, markedForReview]);

    // Toggle mark for review
    const toggleMarkForReview = useCallback(() => {
        setMarkedForReview((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion)) {
                newSet.delete(currentQuestion);
            } else {
                newSet.add(currentQuestion);
            }
            return newSet;
        });
    }, [currentQuestion]);

    // Finish assessment
    const finishAssesment = useCallback(() => {
        const answeredCount = Object.keys(answers).length;
        const totalQuestions = assesment?.questions?.length ?? 0;
        const unansweredCount = totalQuestions - answeredCount;

        Swal.fire({
            title: 'Submit Assessment?',
            html: `
                <div class="text-left">
                    <p class="mb-2"><strong>Total Questions:</strong> ${totalQuestions}</p>
                    <p class="mb-2"><strong>Answered:</strong> ${answeredCount}</p>
                    <p class="mb-2"><strong>Unanswered:</strong> ${unansweredCount}</p>
                    ${unansweredCount > 0 ? '<p class="text-red-600 mt-4">You have unanswered questions!</p>' : ''}
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'Review answers'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!id) {
                    setError('Assessment Not Found, Please try again later');
                    return;
                }
                
                setLoading(true);
                assesmentFinesh(id)
                    .then(() => {
                        setLoading(false);
                        toast.success('Assessment submitted successfully!');
                        setReviewDialog(true);
                    })
                    .catch((error: string) => {
                        setLoading(false);
                        Swal.fire('Error!', error, 'error');
                    });
            }
        });
    }, [answers, assesment, id, setError, setLoading]);

    // Exit fullscreen warning
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                toast.warning('Please stay in fullscreen mode during the exam', {
                    duration: 3000,
                });
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loading loading={loading} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <Alert title={error} type='danger' />
            </div>
        );
    }

    const currentQuestionData = assesment?.questions?.[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <AssesmentHeader
                    title={assesment?.title}
                    timeLeft={timeLeft}
                    progress={(Object.keys(answers).length / (assesment?.questions?.length ?? 1)) * 100}
                    onEndExam={finishAssesment}
                />

                {/* Main Content */}
                <div className="pt-28 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Question Section */}
                        <div className="lg:col-span-8">
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Question {currentQuestion + 1}
                                                </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    of {assesment?.questions?.length ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                    Marks: {currentQuestionData?.marks ?? 'N/A'}
                                                </span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                                onClick={() => setShowReportDialog(true)}
                                            >
                                                <Flag className="w-4 h-4 mr-2" />
                                                Report
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Saving Indicator */}
                                    {isSaving && (
                                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Saving answer...
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="p-4 sm:p-6">
                                    {/* Question Text */}
                                    <div className="mb-8">
                                        <div className="prose dark:prose-invert max-w-none mb-6">
                                            <p className="text-base sm:text-lg text-gray-900 dark:text-white leading-relaxed">
                                                {currentQuestionData?.question ?? 'N/A'}
                                            </p>
                                        </div>

                                        {/* Question Image if exists */}
                                        {currentQuestionData?.question_image && currentQuestionData.question_image.length > 0 && (
                                            <div className="mb-6">
                                                {currentQuestionData.question_image.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`Question ${currentQuestion + 1}`}
                                                        className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Options */}
                                        {(currentQuestionData?.question_type === 'MCQ' ||
                                            currentQuestionData?.question_type === 'TRUE/FALSE') ? (
                                            <RadioGroup
                                                value={answers[currentQuestion] !== undefined ? answers[currentQuestion].toString() : ""}
                                                className="space-y-3"
                                                onValueChange={(value: string) => handleAnswerChange(Number(value))}
                                            >
                                                {currentQuestionData?.options.map((option) => (
                                                    <div
                                                        key={option?.option_id}
                                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                                                            answers[currentQuestion]?.toString() === option?.option_id?.toString()
                                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50'
                                                        }`}
                                                    >
                                                        <RadioGroupItem
                                                            value={option?.option_id?.toString()}
                                                            id={`option-${option?.option_id}`}
                                                            className="mt-1"
                                                        />
                                                        <Label
                                                            htmlFor={`option-${option?.option_id}`}
                                                            className="flex-1 cursor-pointer text-sm sm:text-base text-gray-700 dark:text-gray-300"
                                                        >
                                                            {option?.option_statement}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        ) : (
                                            <div className="space-y-3">
                                                {currentQuestionData?.options.map((option) => (
                                                    <div
                                                        key={option.option_id}
                                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                                                            (answers[currentQuestion] as number[] || []).includes(option.option_id)
                                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50'
                                                        }`}
                                                    >
                                                        <Checkbox
                                                            id={`option-${option.option_id}`}
                                                            checked={(answers[currentQuestion] as number[] || []).includes(option.option_id)}
                                                            className="mt-1"
                                                            onCheckedChange={(checked) => {
                                                                const currentAnswers = answers[currentQuestion] as number[] || [];
                                                                if (checked) {
                                                                    handleAnswerChange([...currentAnswers, option.option_id]);
                                                                } else {
                                                                    handleAnswerChange(currentAnswers.filter(id => id !== option.option_id));
                                                                }
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor={`option-${option.option_id}`}
                                                            className="flex-1 cursor-pointer text-sm sm:text-base text-gray-700 dark:text-gray-300"
                                                        >
                                                            {option.option_statement}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Difficulty: <span className="font-medium capitalize">{currentQuestionData?.difficulty_level}</span></span>
                                        </div>
                                        {currentQuestionData?.negative_marks > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Negative Marks: {currentQuestionData?.negative_marks}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Question Palette Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28">
                                <QuestionPalette
                                    questions={assesment?.questions}
                                    answers={answers}
                                    markedForReview={markedForReview}
                                    setCurrentQuestion={setCurrentQuestion}
                                    getQuestionStatus={getQuestionStatus}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <QuestionNavigation
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    markedForReview={markedForReview}
                    toggleMarkForReview={toggleMarkForReview}
                    setAnswers={setAnswers}
                    questionsLength={assesment?.questions?.length ?? 0}
                    answersLength={Object.keys(answers).length}
                    finishAssesment={finishAssesment}
                    timeLeft={timeLeft}
                />
            </div>

            {/* Report Dialog */}
            <Report
                show={showReportDialog}
                question={currentQuestionData?.question_id}
                onClose={() => setShowReportDialog(false)}
            />

            {/* Review Dialog */}
            {reviewDialog && (
                <Review
                    show={reviewDialog}
                    assessment_id={id || null}
                    courseId={courseId || null}
                    onClose={(value: boolean) => setReviewDialog(value)}
                />
            )}
        </div>
    );
};

export default AssesmentAttempt;