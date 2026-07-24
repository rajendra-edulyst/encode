import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAction {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface ActionGroup {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
    actions: QuickAction[];
}

interface QuickActionsProps {
    groups: ActionGroup[];
    isTyping: boolean;
    onAction: (text: string) => void;
}

/* ─────────────────────────────────────────────────────────
   Design tokens (consistent with MessageItem.tsx)
   ───────────────────────────────────────────────────────── */
const BTN_BASE = 'flex items-center justify-center gap-1.5 transition-all flex-shrink-0 font-bold';
const GROUP_BTN = (isExpanded: boolean, isTyping: boolean, colorClass: string) => `
    flex-1 ${BTN_BASE} px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-wider border
    ${isExpanded
        ? `${colorClass} scale-[1.02] shadow-lg`
        : isTyping
            ? 'bg-zinc-800/50 border-zinc-700/30 text-zinc-600 cursor-not-allowed'
            : 'bg-zinc-800/80 border-zinc-700/50 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200 hover:scale-[1.02] active:scale-95'
    }
`;

const SUB_BTN = (isTyping: boolean) => `
    inline-flex ${BTN_BASE} px-3 py-2
    bg-zinc-800 border border-zinc-700/50 rounded-lg
    text-[11px] font-medium text-zinc-300
    ${isTyping
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:bg-zinc-700 hover:text-white hover:border-zinc-600 active:scale-95'
    }
`;
/* ───────────────────────────────────────────────────────── */

export const QuickActions: React.FC<QuickActionsProps> = ({ groups, isTyping, onAction }) => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const toggleGroup = (groupId: string) => {
        if (isTyping) return;
        setExpandedGroup(prev => prev === groupId ? null : groupId);
    };

    return (
        <div className="border-t border-zinc-800 bg-zinc-900/40 flex-shrink-0">
            {/* ── Group Toggle Buttons (Grid for perfect alignment) ── */}
            <div className="grid grid-cols-2 gap-2.5 px-3 pt-3 pb-1.5 sm:px-4">
                {groups.map((group) => {
                    const isExpanded = expandedGroup === group.id;
                    return (
                        <button
                            key={group.id}
                            onClick={() => toggleGroup(group.id)}
                            disabled={isTyping}
                            className={GROUP_BTN(isExpanded, isTyping, group.color)}
                        >
                            <group.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{group.label}</span>
                            <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    );
                })}
            </div>

            {/* ── Expanded Sub-buttons (Flex Wrap for responsiveness) ── */}
            <AnimatePresence>
                {expandedGroup && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 pt-1.5 sm:px-4">
                            <div className="flex flex-wrap gap-2">
                                {groups
                                    .find(g => g.id === expandedGroup)
                                    ?.actions.map((action) => (
                                        <button
                                            key={action.id}
                                            onClick={() => {
                                                if (isTyping) return;
                                                onAction(`Tell me about my ${action.label}`);
                                            }}
                                            disabled={isTyping}
                                            className={SUB_BTN(isTyping)}
                                        >
                                            <action.icon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                            {action.label}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
