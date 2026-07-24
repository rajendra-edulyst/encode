import React, { useState, useEffect, memo } from "react";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface TextQuestionProps {
    answer: string;
    onAnswerChange: (value: string) => void;
    placeholder?: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
    answer,
    onAnswerChange,
}) => {
    const [localAnswer, setLocalAnswer] = useState(answer);

    // Update local state when answer prop changes (e.g., when navigating between questions)
    useEffect(() => {
        setLocalAnswer(answer);
    }, [answer]);

    const handleBlur = () => {
        // Call API when textarea loses focus (always, even if unchanged, to ensure save)
        onAnswerChange(localAnswer);
    };

    const handleChange = (value: string) => {
        setLocalAnswer(value);
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="text-answer" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer:
            </Label>
            <RichTextEditor
                value={localAnswer}
                maxLength={5000}
                onChange={handleChange}
                onBlur={handleBlur}
                hideUploads={true}
            />
        </div>
    );
};

export default memo(TextQuestion);
