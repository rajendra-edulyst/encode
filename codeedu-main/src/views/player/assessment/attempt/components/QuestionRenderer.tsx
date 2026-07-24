import React, { memo } from "react";
import { Question } from "@/@types/learner/assessment";
import MCQQuestion from "./questionTypes/MCQQuestion";
// import MRQQuestion from "./questionTypes/MRQQuestion";
import TextQuestion from "./questionTypes/TextQuestion";
// import MatchTheFollowingQuestion from "./questionTypes/MatchTheFollowingQuestion";
import SafeHtml from "@/components/SafeHtml";

interface QuestionRendererProps {
    question: Question;
    currentAnswer: number | number[] | string | Record<number, string> | undefined;
    onAnswerChange: (value: number | number[] | string | Record<number, string>) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    question,
    currentAnswer,
    onAnswerChange,
}) => {
    const renderQuestionByType = () => {
        switch (question.question_type) {
            case 'MCQ':
            case 'TRUE/FALSE':
                return (
                    <MCQQuestion
                        options={question.options}
                        selectedAnswer={currentAnswer as number | undefined}
                        onAnswerChange={(value) => onAnswerChange(value)}
                    />
                );

            // case 'MRQ':
            // case 'MSQ':
            //     return (
            //         <MRQQuestion
            //             options={question.options}
            //             selectedAnswers={(currentAnswer as number[]) || []}
            //             onAnswerChange={(value) => onAnswerChange(value)}
            //         />
            //     );

            case 'Text':
                return (
                    <TextQuestion
                        answer={(currentAnswer as string) || ''}
                        placeholder="Type your detailed answer here..."
                        onAnswerChange={(value) => onAnswerChange(value)}
                    />
                );

            // case 'Match The Following':
            //     return (
            //         <MatchTheFollowingQuestion
            //             options={question.options}
            //             correctAnswers={question.correct_answer_statement || []}
            //             selectedMatches={(currentAnswer as Record<number, string>) || {}}
            //             onAnswerChange={(value) => onAnswerChange(value)}
            //         />
            //     );

            default:
                return (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200">
                            Question type &quot;{question.question_type}&quot; is not supported yet.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="mb-8">
            <div className="prose dark:prose-invert max-w-none mb-6">
                <div className="text-base sm:text-lg text-gray-900 dark:text-white leading-relaxed">
                    <SafeHtml html={question.question} className="prose prose-p:dark:text-white prose-p:text-black prose-div:dark:text-white prose-div:text-black" />
                </div>
            </div>

            {/* Question Image if exists */}
            {question.question_image && question.question_image.length > 0 && (
                <div className="mb-6 space-y-4">
                    {question.question_image.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Question illustration ${idx + 1}`}
                            className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        />
                    ))}
                </div>
            )}
            {/* Render Question Input */}
            {renderQuestionByType()}
        </div>
    );
};

export default memo(QuestionRenderer);
