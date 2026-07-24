/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

interface ScoreboardProps {
    assessmentData: {
        score: number;
        total_questions: number;
        correct_answers: number;
        wrong_answers: number;
        attempt_count: number;
        batch_average?: {
            score: number;
            correct_answers: number;
            time_per_question: number;
            accuracy: number;
        };
    };
}
const Scoreboard: React.FC<ScoreboardProps> = ({ assessmentData }) => {
    const [timer, setTimer] = useState<number>(0);
    const total = assessmentData?.total_questions ?? 0;
    const correct = assessmentData?.correct_answers ?? 0;
    const wrong = assessmentData?.wrong_answers ?? 0;
    const attempted = correct + wrong;
    const score = assessmentData?.score ?? 0;
    const maxScore = 100;

    // Calculate derived stats
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const batchAccuracy = assessmentData?.batch_average?.accuracy || 0;
    // const avgTimePerQuestion = assessmentData.questions.reduce((acc, q) => acc + (q.time_taken || 0), 0) / attempted;
    const batchAvgTime = assessmentData?.batch_average?.time_per_question || 0;
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
            console.log('timer', timer)
        }, 1000);
        return () => clearInterval(interval);
    },);

    return (
        <div className="min-h-screen bg-[#323232] p-8">
            <div className="max-w-[1440px] mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-16">SCORECARD</h1>
                <div className="flex justify-center gap-20 mb-16">
                    <div className="text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center mb-4">
                            <div className="text-white">
                                <div className="text-2xl font-bold">{attempted}/{total}</div>
                                <div className="text-sm mt-1">ATTEMPTED</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center mb-4">
                            <div className="text-white">
                                <div className="text-2xl font-bold">{correct}</div>
                                <div className="text-sm mt-1">CORRECT</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center mb-4">
                            <div className="text-white">
                                <div className="text-2xl font-bold">{score}</div>
                                <div className="text-sm mt-1">SCORE</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#424242] text-white text-center py-2 px-4 rounded-md w-fit mx-auto mb-16">
                    Attempt: {assessmentData?.attempt_count}
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-8">QUESTIONS ATTEMPTED</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Batch`s average</span>
                                    <span>{attempted}</span>
                                </div>
                                <Progress value={100} className="h-8 bg-[#B3E5FC]">
                                    <div className="h-full bg-[#323232] rounded-md" style={{ width: '100%' }}></div>
                                </Progress>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>You</span>
                                    <span>{attempted}</span>
                                </div>
                                <Progress value={total > 0 ? (attempted / total) * 100 : 0} className="h-8 bg-[#B3E5FC]">
                                    <div className="h-full bg-[#B3E5FC] rounded-md" style={{ width: `${total > 0 ? (attempted / total) * 100 : 0}%` }}></div>
                                </Progress>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-8">MAX SCORE: {maxScore}</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Batch`s average</span>
                                    <span>{assessmentData?.batch_average?.score || 0}</span>
                                </div>
                                <Progress value={assessmentData?.batch_average?.score || 0} className="h-8 bg-[#B3E5FC]">
                                    <div className="h-full bg-[#323232] rounded-md" style={{ width: `${assessmentData?.batch_average?.score || 0}%` }}></div>
                                </Progress>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>You</span>
                                    <span>{score}</span>
                                </div>
                                <Progress value={score} className="h-8 bg-[#B3E5FC]">
                                    <div className="h-full bg-[#B3E5FC] rounded-md" style={{ width: `${score}%` }}></div>
                                </Progress>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-8 text-center">CORRECT ANSWERS</h2>
                        <div className="flex justify-center gap-16">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{assessmentData?.batch_average?.correct_answers || 0}</div>
                                <div className="text-sm text-gray-600">Avg Correct ans in the batch</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">{correct}</div>
                                <div className="text-sm text-gray-600">Your correct answers</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-8">* Subjective is not considered in this analytics</div>
                    </Card>
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-8 text-center">AVG TIME PER QUESTION</h2>
                        <div className="flex justify-center gap-16">
                            <div className="text-center">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 border-8 border-[#323232] rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[#323232]">
                                        <div>
                                            <span className="text-2xl font-bold">{Math.round(batchAvgTime)}</span>s
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">Batch`s Avg Time</div>
                            </div>
                            <div className="text-center">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 border-8 border-[#B3E5FC] rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[#B3E5FC]">
                                        {/* <div>
                                            <span className="text-2xl font-bold">{Math.round(avgTimePerQuestion)}</span>s
                                        </div> */}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">Your Avg Time</div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-8 text-center">ACCURACY</h2>
                        <div className="flex justify-center gap-16">
                            <div className="text-center">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 border-8 border-[#B3E5FC] rounded-full"></div>
                                    <div className="absolute inset-0 border-8 border-[#323232] rounded-full" style={{ clipPath: `polygon(0 0, ${batchAccuracy}% 0, ${batchAccuracy}% 100%, 0 100%)` }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-2xl font-bold">{batchAccuracy}%</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">Batch`s Avg accuracy</div>
                            </div>
                            <div className="text-center">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 border-8 border-[#B3E5FC] rounded-full"></div>
                                    <div className="absolute inset-0 border-8 border-[#323232] rounded-full" style={{ clipPath: `polygon(0 0, ${accuracy}% 0, ${accuracy}% 100%, 0 100%)` }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-2xl font-bold">{accuracy}%</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">Your Accuracy</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-8">* Subjective is not considered in this analytics</div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;