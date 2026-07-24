import React, { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Question } from "@/@types/learner/assessment";

interface QuestionPaletteProps {
    questions: Question[];
    answers: Record<number, number | number[] | string | Record<number, string>>;
    markedForReview: Set<number>;
    setCurrentQuestion: (index: number) => void;
    getQuestionStatus: (index: number) => string;
    activeQuestion: number;
}

const QuestionPalette: React.FC<QuestionPaletteProps> = memo(({
    questions,
    answers,
    markedForReview,
    setCurrentQuestion,
    getQuestionStatus,
    activeQuestion
}) => {
    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
    const reviewCount = useMemo(() => markedForReview.size, [markedForReview]);
    const notAnsweredCount = useMemo(() => questions?.length - answeredCount, [questions?.length, answeredCount]);
    return (
        <Card className="p-4 sticky top-28">
            <h3 className="text-lg font-semibold mb-4">Question Palette</h3>
            <div className="flex flex-wrap gap-2 mb-6">
                {questions && questions?.map((question, index) => (
                    <Button key={index} className={`h-10 w-10 dark:text-white ${getQuestionStatus(index) === "answered" ? "bg-[#20b2aa] hover:bg-[#20b2aa]/70" : getQuestionStatus(index) === "review" ? " hover:bg-[#f19e2a]/70 bg-[#f19e2a]" : ""}`}
                        variant={activeQuestion === index ? 'default' : 'outline'}
                        onClick={() => setCurrentQuestion(index)}
                    >
                        <span className={`${question?.question_type_id === 8 && 'border-b border-white'}`}>{index + 1}</span>
                    </Button>
                ))}
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#20b2aa] rounded"></div>
                    <span>Answered</span>
                    <span className="ml-auto">{answeredCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#f19e2a] rounded"></div>
                    <span>Marked for Review</span>
                    <span className="ml-auto">{reviewCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Not Answered</span>
                    <span className="ml-auto">{notAnsweredCount}</span>
                </div>
            </div>
        </Card>
    );
});

QuestionPalette.displayName = 'QuestionPalette';

export default QuestionPalette;
