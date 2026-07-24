import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    value: string;
    isTyping: boolean;
    onChange: (val: string) => void;
    onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, isTyping, onChange, onSend }) => {
    return (
        <div className="px-3 py-3 sm:px-4 bg-zinc-900 border-t border-zinc-800 flex-shrink-0">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    disabled={isTyping}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isTyping && onSend(value)}
                    placeholder={isTyping ? "EduBot is thinking..." : "Ask EduBot anything..."}
                    className={`w-full bg-zinc-800 border border-zinc-700/50 text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <button
                    onClick={() => !isTyping && onSend(value)}
                    disabled={isTyping}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20 ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500 active:scale-90 active:shadow-none'}`}
                >
                    <Send className="w-4 h-4 text-white" />
                </button>
            </div>
            <p className="text-[10px] text-center text-zinc-600 mt-2 font-medium">
                EnBoat can help with course status, schedules, and more.
            </p>
        </div>
    );
};
