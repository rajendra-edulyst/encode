import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GripVertical, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    option_id: number;
    option_statement: string;
    attempted: number;
}

interface MatchTheFollowingQuestionProps {
    options: Option[];
    correctAnswers: string[];
    selectedMatches: Record<number, string>; // { option_id: matched_answer }
    onAnswerChange: (matches: Record<number, string>) => void;
    showResults?: boolean;
}

const MatchTheFollowingQuestion: React.FC<MatchTheFollowingQuestionProps> = ({
    options,
    correctAnswers,
    selectedMatches,
    onAnswerChange,
    showResults = false
}) => {
    const [matches, setMatches] = useState<Record<number, string>>(selectedMatches || {});
    const [draggedAnswer, setDraggedAnswer] = useState<string | null>(null);
    const [draggedFromOption, setDraggedFromOption] = useState<number | null>(null);
    const [availableAnswers, setAvailableAnswers] = useState<string[]>([]);

    // Initialize available answers (shuffle them for better UX)
    useEffect(() => {
        if (correctAnswers && correctAnswers.length > 0) {
            // Shuffle answers to make it challenging
            const shuffled = [...correctAnswers].sort(() => Math.random() - 0.5);
            setAvailableAnswers(shuffled);
        }
    }, [correctAnswers]);

    // Sync with parent state
    useEffect(() => {
        setMatches(selectedMatches || {});
    }, [selectedMatches]);

    const handleDragStart = (answer: string, fromOption?: number) => {
        setDraggedAnswer(answer);
        if (fromOption !== undefined) {
            setDraggedFromOption(fromOption);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (optionId: number) => {
        if (draggedAnswer) {
            const newMatches = { ...matches };
            
            // If dragging from another option, remove it from there
            if (draggedFromOption !== null && draggedFromOption !== optionId) {
                delete newMatches[draggedFromOption];
            }
            
            // Add to new position
            newMatches[optionId] = draggedAnswer;
            
            setMatches(newMatches);
            onAnswerChange(newMatches);
        }
        
        setDraggedAnswer(null);
        setDraggedFromOption(null);
    };

    const handleRemoveMatch = (optionId: number) => {
        const newMatches = { ...matches };
        delete newMatches[optionId];
        setMatches(newMatches);
        onAnswerChange(newMatches);
    };

    const getUnusedAnswers = () => {
        const usedAnswers = new Set(Object.values(matches));
        return availableAnswers.filter(answer => !usedAnswers.has(answer));
    };

    const isCorrectMatch = (optionId: number, matchedAnswer: string) => {
        const optionIndex = options.findIndex(opt => opt.option_id === optionId);
        return correctAnswers[optionIndex] === matchedAnswer;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                    Match the items from Column A with Column B
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop the answers from the right column to match with the items in the left column
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column A - Questions/Options */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Column A
                    </h3>
                    {options.map((option) => (
                        <Card
                            key={option.option_id}
                            className={cn(
                                "p-4 transition-all duration-200",
                                matches[option.option_id] && "border-primary bg-primary/5"
                            )}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(option.option_id)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        {option.option_statement}
                                    </p>
                                    
                                    {/* Drop Zone */}
                                    {matches[option.option_id] ? (
                                        <div
                                            draggable
                                            className={cn(
                                                "flex items-center justify-between gap-2 p-3 rounded-lg border-2 cursor-move",
                                                showResults
                                                    ? isCorrectMatch(option.option_id, matches[option.option_id])
                                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                    : "border-primary bg-white dark:bg-gray-800"
                                            )}
                                            onDragStart={() => handleDragStart(matches[option.option_id], option.option_id)}
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {matches[option.option_id]}
                                                </span>
                                            </div>
                                            {showResults && (
                                                isCorrectMatch(option.option_id, matches[option.option_id]) ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-600" />
                                                )
                                            )}
                                            {!showResults && (
                                                <button
                                                    type="button"
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    onClick={() => handleRemoveMatch(option.option_id)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                                            <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                                                Drop answer here
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Column B - Answers (Draggable) */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Column B (Drag from here)
                    </h3>
                    <div className="space-y-3 sticky top-24">
                        {getUnusedAnswers().length > 0 ? (
                            getUnusedAnswers().map((answer, index) => (
                                <Card
                                    key={`answer-${index}`}
                                    draggable
                                    className="p-4 cursor-move hover:shadow-md hover:border-primary transition-all duration-200 bg-white dark:bg-gray-800"
                                    onDragStart={() => handleDragStart(answer)}
                                >
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            {answer}
                                        </span>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-6 text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {Object.keys(matches).length === options.length ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Check className="w-8 h-8 text-green-500" />
                                            <p className="font-medium text-green-600 dark:text-green-400">
                                                All items matched!
                                            </p>
                                        </div>
                                    ) : (
                                        "All available answers have been used"
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {Object.keys(matches).length} of {options.length} matched
                </span>
                <div className="flex gap-2">
                    {options.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-8 h-1 rounded-full transition-colors",
                                matches[options[index].option_id]
                                    ? "bg-primary"
                                    : "bg-gray-200 dark:bg-gray-700"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">i</span>
                    </div>
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                        <p className="font-medium mb-1">How to answer:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Drag items from Column B and drop them next to matching items in Column A</li>
                            <li>You can rearrange by dragging already placed items</li>
                            <li>Click the X icon to remove a match and try again</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MatchTheFollowingQuestion;
