import React from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Progress } from "@/components/ui/progress";

interface AssesmentHeaderProps {
    title: string;
    timeLeft: number;
    progress: number;
    onEndExam: () => void;
}

const AssesmentHeader: React.FC<AssesmentHeaderProps> = ({ title, timeLeft, progress, onEndExam }) => {

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // ?course=Creative%20Photography&module=Unit-2%20Light,%20Color,%20and%20Mood
    // get current query params
    const queryParams = new URLSearchParams(window.location.search);
    const course = queryParams.get('course') || 'Course';
    const module = queryParams.get('module') || 'Module';

    return (
        <header className="fixed top-0 left-0 right-0 bg-card shadow-md z-40 p-4">
            <div className="flex items-center justify-between max-w-[1440px] mx-auto">
                <div>
                    <h1 className="text-xl font-bold dark:text-white">{title}</h1>
                    <div className="flex gap-5">
                        <div className="text-sm text-gray-600 dark:text-gray-300">Course : <span className="font-bold dark:text-white">{course}</span></div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Module : <span className="font-bold dark:text-white">{module}</span></div>
                    </div>
                </div>
                <div className="text-2xl font-mono bg-gray-200 dark:bg-[#323232] dark:text-white px-6 py-2 rounded-lg">
                    {formatTime(timeLeft)}
                </div>
                <Button variant="destructive" className="text-white" onClick={onEndExam}>
                    End Exam
                </Button>
            </div>
            <Progress value={progress} className="mt-4" />
        </header>
    );
};

export default AssesmentHeader;
