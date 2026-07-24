import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    type: "true-false" | "single-choice";
    text: string;
    options: Option[];
    correctAnswer: string | boolean;
    marks: number;
}


const Questions = () => {


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [questions, setQuestions] = React.useState<Question[]>([]);

    if (!questions || questions.length === 0) {
        return (
            <div className="p-4 border-t border-gray-200 mt-4">
                <p className="text-gray-500 text-sm">No questions available</p>
            </div>
        )
    }

    return (
        <div className="p-4 border-t border-gray-200 mt-4">
            <h2 className="font-semibold text-gray-700 mb-3">Questions List</h2>
            <ScrollArea className="h-[300px]">
                {questions.length === 0 ? (
                    <p className="text-gray-500 text-sm p-2">
                        No questions added yet
                    </p>
                ) : (
                    questions.map((q, index) => (
                        <div
                            key={q.id}
                            className="mb-2 p-2 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Q{index + 1}</span>
                                <Badge
                                    variant={
                                        q.type === "true-false" ? "outline" : "secondary"
                                    }
                                    className="text-xs"
                                >
                                    {q.type === "true-false"
                                        ? "True/False"
                                        : "Single Choice"}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-700 truncate mt-1">
                                {q.text}
                            </p>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    )
}

export default Questions