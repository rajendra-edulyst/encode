import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
    title?: string;
    description?: string;
    isLoading: boolean;
    className?: string;
}

export default function LoadingSection({ title, description, isLoading, className }: LoadingProps) {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        "Please wait...",
        `We are fetching ${title || "data"}...`,
        `Loading ${title || "content"}...`,
        `Almost done, hang tight!`,
        description || "",
    ].filter(Boolean);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000); // change every 2s
        return () => clearInterval(interval);
    }, [isLoading, messages.length]);

    if (!isLoading) return null;

    return (
        <div className={cn('flex flex-col items-center justify-center min-h-[200px] space-y-6 border rounded-lg bg-white dark:bg-black', className)}>
            <Loader className="w-8 h-8 text-gray-500 dark:text-gray-200 animate-spin" />
            <div className="h-6 overflow-hidden relative text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-700 dark:text-gray-200 text-sm font-medium"
                    >
                        {messages[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}