import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, GraduationCap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import EnBoatChatbot from './EnBoatChatbot';
// 🚀 ~ Google Analytics: Import chatbot analytics hook
import { useChatbotAnalytics } from '@/hooks/useChatbotAnalytics';

const ChatbotTrigger = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // 🚀 ~ Google Analytics: Initialize chatbot analytics tracking
    const { trackChatbotOpen, trackChatbotClose } = useChatbotAnalytics();

    // 🚀 ~ Google Analytics: Track when chatbot opens/closes
    useEffect(() => {
        if (isOpen) {
            trackChatbotOpen();
        } else {
            trackChatbotClose();
        }
    }, [isOpen, trackChatbotOpen, trackChatbotClose]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    if (location.pathname.startsWith('/getting-started')) {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed bottom-16 right-6 z-[9999]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <div className="relative group">
                    {/* Tooltip hint */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-medium whitespace-nowrap shadow-xl hidden md:block"
                            >
                                Need help? Ask EduBot!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Trigger Image */}
                    <img
                        src="/img/help.png"
                        alt="Help"
                        className="w-14 h-14 cursor-pointer hover:scale-110 transition shadow-2xl relative z-50"
                        onClick={() => handleOpenChange(true)}
                    />

                    {/* Notification dot */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 flex shadow-sm animate-pulse z-[60]" />

                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                </div>
            </motion.div>

            {/* The Chatbot Panel */}
            <AnimatePresence>
                {isOpen && <EnBoatChatbot open={isOpen} onOpenChange={handleOpenChange} />}
            </AnimatePresence>
        </>
    );
};

export default ChatbotTrigger;
