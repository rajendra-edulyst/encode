import React from 'react';
import { Bot, X } from 'lucide-react';

interface ChatHeaderProps {
    onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
    return (
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Bot className="text-white w-5 h-5" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-sm" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base font-black tracking-tight text-white leading-tight truncate">
                            EduBot AI
                        </h2>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block truncate">Academic Assistant</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center justify-center flex-shrink-0 active:scale-95"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
