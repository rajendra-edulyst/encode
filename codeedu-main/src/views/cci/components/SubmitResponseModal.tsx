import React from "react";
import { Loader2, X } from "lucide-react";

interface SubmitResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    step: 'confirm' | 'submitting' | 'success';
    onContinue: () => void;
    confirmText?: React.ReactNode;
    successText?: React.ReactNode;
    cancelText?: string;
}

const SubmitResponseModal: React.FC<SubmitResponseModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    step,
    onContinue,
    confirmText,
    successText,
    cancelText = "Review Buzz"
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={(e) => {
                if (step !== 'submitting' && e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative bg-[#2b2b2b] border border-[#5A5A5A] rounded-[20px] w-[520px] max-w-[95vw] p-8 flex flex-col items-center text-white font-jacques-pro shadow-2xl">

                {/* Close button */}
                {step !== 'submitting' && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
                    >
                        <X size={22} strokeWidth={2} />
                    </button>
                )}

                {/* Title */}
                <h2 className="text-[22px] font-bold text-center mb-6">
                    {step === 'success' ? 'Thank You! ✨' : 'Submit Response'}
                </h2>

                {/* Body */}
                {step === 'success' ? (
                    <>
                        <p className="text-[15px] text-gray-200 leading-relaxed text-center mb-10">
                            {successText || "Your response has been successfully submitted. Start the next phase from section II page."}
                        </p>
                        <button
                            onClick={onContinue}
                            className="bg-[#fcee0a] hover:bg-yellow-400 text-black text-[15px] font-bold w-[140px] h-[60px] rounded-[12px] transition-colors"
                        >
                            Continue
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-[15px] text-gray-200 leading-relaxed text-center mb-10">
                            {confirmText || "You have successfully created a Buzz for your Problem Statement. Would you like to mark it your final response? You will not be able to change it later."}
                        </p>
                        <div className="flex items-center justify-center gap-5">
                            {/* Gray "Review Buzz" button */}
                            <button
                                onClick={onClose}
                                disabled={step === 'submitting'}
                                className="bg-[#5a5a5a] hover:bg-[#6a6a6a] text-white text-[14px] font-bold w-[130px] h-[70px] rounded-[12px] transition-colors disabled:opacity-50 flex items-center justify-center text-center leading-tight"
                            >
                                {cancelText}
                            </button>

                            {/* Yellow "Submit Response" button */}
                            <button
                                onClick={onConfirm}
                                disabled={step === 'submitting'}
                                className="bg-[#fcee0a] hover:bg-yellow-400 text-black text-[14px] font-bold w-[130px] h-[70px] rounded-[12px] transition-colors disabled:opacity-50 flex items-center justify-center gap-1 leading-tight text-center"
                            >
                                {step === 'submitting'
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <span>Submit<br/>Response</span>
                                }
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubmitResponseModal;
