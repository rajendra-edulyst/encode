import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Option } from "@/@types/learner/assessment";

interface MCQQuestionProps {
    options: Option[];
    selectedAnswer: number | undefined;
    onAnswerChange: (value: number) => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
    options,
    selectedAnswer,
    onAnswerChange
}) => {
    return (
        <RadioGroup
            value={selectedAnswer !== undefined ? selectedAnswer.toString() : ""}
            className="space-y-3"
            onValueChange={(value: string) => onAnswerChange(Number(value))}
        >
            {options.map((option) => (
                <Label
                    key={option.option_id}
                    htmlFor={`option-${option.option_id}`}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${selectedAnswer === option.option_id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700'}`}
                >
                    <RadioGroupItem
                        value={option.option_id.toString()}
                        id={`option-${option.option_id}`}
                        className="mt-1"
                    />
                    <span className="flex-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {option.option_statement}
                    </span>
                </Label>
            ))}
        </RadioGroup>
    );
};

export default MCQQuestion;
