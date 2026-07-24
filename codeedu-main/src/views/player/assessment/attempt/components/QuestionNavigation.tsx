import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

interface QuestionNavigationProps {
    currentQuestion: number;
    setCurrentQuestion: (questionIndex: number) => void;
    markedForReview: Set<number>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<number, number | number[] | string | Record<number, string>>>>;
    questionsLength: number;
    finishAssesment: (skipConfirmation?: boolean) => void;
    timeLeft: number;
    answersLength: number;
    isSaving?: boolean;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = memo(({
    currentQuestion,
    setCurrentQuestion,
    markedForReview,
    setAnswers,
    questionsLength,
    finishAssesment,
    timeLeft,
    answersLength,
    isSaving,
}) => {

    const [onLastQuestion, setOnLastQuestion] = useState<boolean>(false);
    const [pendingNavigation, setPendingNavigation] = useState<boolean>(false);

    useEffect(() => {
        if (pendingNavigation && !isSaving) {
            setPendingNavigation(false);
            if (currentQuestion === questionsLength - 1) {
                setOnLastQuestion(true);
            } else {
                setCurrentQuestion(Math.min(questionsLength - 1, currentQuestion + 1));
            }
        }
    }, [isSaving, pendingNavigation, currentQuestion, questionsLength, setCurrentQuestion]);

    const nextQuestion = useCallback(() => {
        if (isSaving) {
            setPendingNavigation(true);
        } else {
            if (currentQuestion === questionsLength - 1) {
                setOnLastQuestion(true);
            } else {
                setCurrentQuestion(Math.min(questionsLength - 1, currentQuestion + 1));
            }
        }
    }, [currentQuestion, questionsLength, setCurrentQuestion, isSaving]);

    const finishAssesmentExam = useCallback(() => {
        setOnLastQuestion(false);
        finishAssesment(true);
    }, [finishAssesment]);

    const formatTime = useMemo(() => {
        return (seconds: number): string => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        };
    }, []);

    const handlePrevious = useCallback(() => {
        setCurrentQuestion(Math.max(0, currentQuestion - 1));
    }, [currentQuestion, setCurrentQuestion]);

    const handleClearResponse = useCallback(() => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestion];
            return newAnswers;
        });
    }, [currentQuestion, setAnswers]);

    return (
        <div>
            <div className="flex items-center gap-3">
                <Button variant="outline" className="text-primary" onClick={handleClearResponse}>Clear Response</Button>
                {/* Previous Button */}
                <Button
                    disabled={currentQuestion === 0}
                    className="text-white"
                    onClick={handlePrevious}
                >
                    <ChevronLeft />
                    Previous
                </Button>
                {/* Next Button */}
                <Button
                    className="text-white"
                    onClick={nextQuestion}
                >
                    {currentQuestion === questionsLength - 1 ? 'Save & Submit' : 'Save & Next'}
                    <ChevronRight />
                </Button>
            </div>
            <Dialog open={onLastQuestion} onOpenChange={setOnLastQuestion}>
                <DialogContent className="sm:max-w-md bg-[#121212] border border-white/10 p-0 overflow-hidden shadow-2xl rounded-2xl">
                <DialogTitle className="sr-only">Confirm Submission</DialogTitle>
                <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 border border-primary/20 mx-auto shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <AlertCircle className="text-primary w-7 h-7" />
                        </div>

                        <DialogHeader className="text-center mb-6">
                            <DialogTitle className="text-white text-2xl font-extrabold tracking-tight mb-2 text-center">
                                Ready to Submit?
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-[15px] text-center max-w-[280px] mx-auto leading-relaxed">
                                You have reached the end of the assessment. Please review your progress before you submit.
                            </DialogDescription>
                        </DialogHeader>

                        {timeLeft > 0 && (
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between mb-8 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-primary w-5 h-5" />
                                    <span className="text-primary/90 font-semibold text-sm tracking-wide">Time Remaining</span>
                                </div>
                                <span className="font-mono text-primary text-xl font-bold tracking-widest">{formatTime(timeLeft)}</span>
                            </div>
                        )}

                        <div className="grid gap-3 mb-8">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.08] group">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#20b2aa] group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-medium text-[15px]">Answered</span>
                                </div>
                                <span className="text-white font-bold text-lg">{answersLength}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.08] group">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 border-dashed group-hover:rotate-90 transition-transform" />
                                    <span className="text-white font-medium text-[15px]">Not Answered</span>
                                </div>
                                <span className="text-white font-bold text-lg">{questionsLength - answersLength}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.08] group">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-white font-medium text-[15px]">In Review</span>
                                </div>
                                <span className="text-white font-bold text-lg">{markedForReview.size}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 border-white/10 hover:bg-white/5 text-white bg-transparent h-12 font-semibold tracking-wide rounded-xl"
                                onClick={() => setOnLastQuestion(false)}
                            >
                                No, Go Back
                            </Button>
                            <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-black h-12 font-extrabold tracking-wide transition-all shadow-lg hover:shadow-xl rounded-xl"
                                onClick={finishAssesmentExam}
                            >
                                Yes, Submit Exam
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
});

QuestionNavigation.displayName = 'QuestionNavigation';

export default QuestionNavigation;