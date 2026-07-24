import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Option } from "@/@types/learner/assessment";

interface MRQQuestionProps {
    options: Option[];
    selectedAnswers: number[];
    onAnswerChange: (value: number[]) => void;
}

const MRQQuestion: React.FC<MRQQuestionProps> = ({
    options,
    selectedAnswers,
    onAnswerChange
}) => {
    const handleCheckboxChange = (optionId: number, checked: boolean) => {
        if (checked) {
            onAnswerChange([...selectedAnswers, optionId]);
        } else {
            onAnswerChange(selectedAnswers.filter(id => id !== optionId));
        }
    };

    return (
        <div className="space-y-3">
            {options.map((option) => (
                <div
                    key={option.option_id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${selectedAnswers.includes(option.option_id)
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 dark:bg-gray-900/50'
                        }`}
                >
                    <Checkbox
                        id={`option-${option.option_id}`}
                        checked={selectedAnswers.includes(option.option_id)}
                        className="mt-1"
                        onCheckedChange={(checked) =>
                            handleCheckboxChange(option.option_id, checked as boolean)
                        }
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
    );
};

export default MRQQuestion;
