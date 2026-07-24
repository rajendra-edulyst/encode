import React from 'react';
import { motion } from 'framer-motion';
import { MessageItem } from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    scrollRef: React.Ref<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onSendMessage: (text: string) => void;
    onSelectCourse: (id: string) => void;
    onSelectModule: (id: string) => void;
    onCloseChatbot: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    scrollRef,
    containerRef,
    onSendMessage,
    onSelectCourse,
    onSelectModule,
    onCloseChatbot
}) => {
    return (
        <div
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 scroll-smooth"
        >
            <div className="space-y-4 min-w-0 pb-2">
                {messages.map((msg) => (
                    <MessageItem
                        key={msg.id}
                        msg={msg}
                        isTyping={isTyping}
                        onSendMessage={onSendMessage}
                        onSelectCourse={onSelectCourse}
                        onSelectModule={onSelectModule}
                        onCloseChatbot={onCloseChatbot}
                    />
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                )}

                <div ref={scrollRef} />
            </div>
        </div>
    );
};
