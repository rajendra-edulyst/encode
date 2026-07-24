import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseQuestionAnswerProps {
    questionId: number;
    questionType: string;
    contentId: string;
    markedForReview: boolean;
    timeLeft: number;
    durationInMinutes: number;
    saveAnswerFn: (data: SaveAnswerData) => Promise<void>;
}

interface SaveAnswerData {
    content_id: string;
    question_id: number;
    option_id?: number | number[];
    answer_statement?: string;
    mark_review: number;
    durationSec: number;
}

export const useQuestionAnswer = ({
    questionId,
    questionType,
    contentId,
    markedForReview,
    timeLeft,
    durationInMinutes,
    saveAnswerFn,
}: UseQuestionAnswerProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced save function
    const debouncedSave = useCallback(
        async (value: number | number[] | string) => {
            // Clear any existing timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Set new timeout for debouncing
            saveTimeoutRef.current = setTimeout(async () => {
                setIsSaving(true);

                try {
                    const data: SaveAnswerData = {
                        content_id: contentId,
                        question_id: questionId,
                        mark_review: markedForReview ? 1 : 0,
                        durationSec: durationInMinutes * 60 - timeLeft,
                    };

                    // Add appropriate field based on question type
                    if (questionType === 'Text') {
                        data.answer_statement = value as string;
                    } else {
                        data.option_id = value as number | number[];
                    }

                    await saveAnswerFn(data);
                } catch (error) {
                    console.error('Save error:', error);
                    toast.error('Failed to save answer');
                } finally {
                    setIsSaving(false);
                }
            }, 1000); // 1 second debounce for text, immediate for options
        },
        [contentId, questionId, markedForReview, timeLeft, durationInMinutes, questionType, saveAnswerFn]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        isSaving,
        saveAnswer: debouncedSave,
    };
};
