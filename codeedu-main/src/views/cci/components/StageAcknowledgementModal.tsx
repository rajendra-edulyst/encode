import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/Dialog";

interface StageAcknowledgementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAcknowledge: () => void;
    stageNumber?: string;
    objective?: string;
    formatLabel?: string;
    questionFormat?: React.ReactNode;
    evaluation?: React.ReactNode;
    duration?: string;
    badgeColor?: string;
}

const StageAcknowledgementModal: React.FC<StageAcknowledgementModalProps> = ({
    isOpen,
    onClose,
    onAcknowledge,
    stageNumber = "01",
    objective = "To evaluate real-world application, initiative, and community interaction within the enCODE ecosystem.",
    formatLabel = "Question Format:",
    questionFormat = (
        <ul className="m-0 list-disc pl-5 space-y-0.5">
            <li>30 MCQs</li>
            <li>2 Scenario-based subjective responses</li>
        </ul>
    ),
    evaluation,
    duration = "30 Minutes",
    badgeColor = "#00b0f0"
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#2e2e2e] border-[2px] border-[#00b0f0] text-white w-[850px] max-w-[95%] h-auto p-0 rounded-[16px] shadow-2xl font-jacques-pro flex flex-col">
                <DialogTitle className="sr-only">Acknowledgement</DialogTitle>
                {/* Header Badge */}
                <div
                    className="absolute top-0 left-0 px-4 py-1 rounded-br-[16px] text-[13px] font-bold z-10"
                    style={{ backgroundColor: badgeColor }}
                >
                    Stage {stageNumber}
                </div>

                <div className="flex flex-col items-center px-7 pt-8 pb-6 gap-2.5">
                    <h2 className="text-[24px] font-bold m-0 tracking-tight">Acknowledgement</h2>

                    <div className="w-full flex flex-col gap-2">
                        {/* Objective Section */}
                        <div className="bg-[#4a4a4a] rounded-[10px] px-4 py-2 flex flex-col gap-0.5">
                            <span className="text-[13px] font-bold text-white">Objective:</span>
                            <p className="text-[12.5px] text-gray-200 leading-snug m-0">
                                {objective}
                            </p>
                        </div>

                        {/* Format Section */}
                        {questionFormat && (
                            <div className="bg-[#4a4a4a] rounded-[10px] px-4 py-2 flex flex-col gap-0.5">
                                <span className="text-[13px] font-bold text-white">{formatLabel}</span>
                                <div className="text-[12.5px] text-gray-200 m-0">
                                    {questionFormat}
                                </div>
                            </div>
                        )}

                        {/* Evaluation Section */}
                        {evaluation && (
                            <div className="bg-[#4a4a4a] rounded-[10px] px-4 py-2 flex flex-col gap-0.5">
                                <span className="text-[13px] font-bold text-white">Evaluation:</span>
                                <div className="text-[12.5px] text-gray-200 m-0">
                                    {evaluation}
                                </div>
                            </div>
                        )}

                        {/* Duration Section */}
                        <div className="bg-[#4a4a4a] rounded-[10px] px-4 py-2">
                            <span className="text-[13px] font-bold text-white">Duration: {duration}</span>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-5 mt-2 w-full justify-center">
                        <button
                            onClick={onClose}
                            className="bg-[#808080] hover:bg-[#666] text-black text-[14px] font-bold px-8 py-2.5 rounded-[10px] min-w-[150px] transition-colors"
                        >
                            No, I<br />Decline
                        </button>
                        <button
                            onClick={onAcknowledge}
                            className="bg-[#fcee0a] hover:bg-yellow-400 text-black text-[14px] font-bold px-8 py-2.5 rounded-[10px] min-w-[150px] transition-colors"
                        >
                            Yes, I<br />Acknowledge
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StageAcknowledgementModal;
