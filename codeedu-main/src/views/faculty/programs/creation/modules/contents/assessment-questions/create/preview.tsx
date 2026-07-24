import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'


interface Option {
    id: string;
    text: string;
}

interface PreviewProps {
    questionText: string;
    activeQuestionType: 1 | 2;
    options: Option[];
    correctAnswer: string | boolean;
    marks: number;
}

const Preview: React.FC<PreviewProps> = ({
    questionText,
    activeQuestionType,
    options,
    correctAnswer,
    marks,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-6 col-span-1 md:col-span-1">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">Question Preview</h2>
            </div>
            <div className="p-4">
                <Card className="p-4 bg-gray-50">
                    {questionText ? (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline" className="font-normal">
                                    {activeQuestionType === 1
                                        ? "True/False"
                                        : "Single Choice"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {marks} {marks === 1 ? "mark" : "marks"}
                                </span>
                            </div>
                            <p className="font-medium mb-4">{questionText}</p>
                            {activeQuestionType === 1 ? (
                                <div className="space-y-2">
                                    <div
                                        className={`p-2 rounded-md border ${correctAnswer === true ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-3 flex items-center justify-center">
                                                {correctAnswer === true && (
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <span>True</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`p-2 rounded-md border ${correctAnswer === false ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-3 flex items-center justify-center">
                                                {correctAnswer === false && (
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <span>False</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {options.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`p-2 rounded-md border ${correctAnswer === option.id ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full border border-gray-300 mr-3 flex items-center justify-center">
                                                    {correctAnswer === option.id && (
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <span>{option.text || `Option ${option.id}`}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <i className="fas fa-eye text-3xl mb-2"></i>
                            <p>Your question preview will appear here</p>
                        </div>
                    )}
                </Card>
                <Separator className="my-6" />
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Keep questions clear and concise</span>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>For single choice, make sure options are distinct</span>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Assign appropriate marks based on difficulty</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Preview