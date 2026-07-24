import PersonaInsightsDialog from "@/views/persona-insights/PersonaInsightsDialog";
import { useState } from "react";

interface PersonaProgressProps {
    currentQuestions: number;
    totalQuestions: number;
    onUpdate?: () => void;
}

const PersonaProgress = ({
    currentQuestions,
    totalQuestions,
    onUpdate,
}: PersonaProgressProps) => {
    const progress = (currentQuestions / totalQuestions) * 100;
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && onUpdate) {
            onUpdate();
        }
    };
    const hasAnswers = currentQuestions > 0;
    const isCompleted = currentQuestions >= totalQuestions;

    return (
        <div className="w-full flex gap-4 items-center ">
            <div className="w-full bg-[#1D1D1D] rounded-[20px] px-6 py-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-white text-[24px] font-bold">
                            Your Persona Journey
                        </h2>

                        <p className="text-[#868686] text-[14px] font-normal">
                            Track your {totalQuestions}-question persona journey across 4 phases
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="font-bold">
                            <span className="text-[#00AEEF] text-[20px]">
                                {currentQuestions}/
                            </span>
                            <span className="text-[#00AEEF]/80 text-[30px]">
                                {totalQuestions}
                            </span>
                        </div>

                        <p className="text-[#868686] text-[12px] font-normal">
                            Questions Completed
                        </p>
                    </div>
                </div>

                {/* Progress Labels */}
                <div className="flex justify-between items-center mt-4 mb-2">
                    <span className="text-white text-[14px] font-normal">
                        Overall Progress
                    </span>

                    <span className="text-[#7FC142] text-[14px] font-bold">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[12px] bg-[#323232] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background:
                                "linear-gradient(90deg, #1AA7EC 0%, #E8E600 50%, #79C143 100%)",
                        }}
                    />
                </div>
            </div>
            {!isCompleted && (<div className="w-[260px]" style={{ height: "stretch" }}>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center h-full bg-[#7568B1] text-[20px] font-normal text-white px-6 py-4 rounded-[20px] transition hover:scale-[1.02] hover:bg-[#9c8be0]">
                    {hasAnswers ? "Continue your User Persona Journey" : "Start your User Persona Journey"}
                </button>
            </div>)}

            <PersonaInsightsDialog open={open} onOpenChange={handleOpenChange} resumeMode={hasAnswers} isCompleted={isCompleted} />
        </div>
    );
};

export default PersonaProgress;