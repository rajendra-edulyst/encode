import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TabType, PeriodType } from '../types';
import { TABS, PERIODS } from '../types';

interface TabSwitcherProps {
    activeTab: TabType;
    period: PeriodType;
    onTabChange: (tab: TabType) => void;
    onPeriodChange: (period: PeriodType) => void;
    hidePeriodDropdown?: boolean;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
    activeTab,
    period,
    onTabChange,
    onPeriodChange,
    hidePeriodDropdown = false,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
            {/* Tab pills & Draft status badge */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full sm:w-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-[#0ea5e9] text-white shadow-md'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Draft Badge next to tab switcher on the right */}
                {(activeTab === 'institutions_licenses') && (
                    <span className="px-2.5 py-1 bg-[#7FBC42]/15 text-[#7FBC42] border border-[#7FBC42]/30 rounded-lg text-xs font-black tracking-wider uppercase select-none animate-in fade-in duration-300">
                        Draft
                    </span>
                )}
            </div>

            {/* Period dropdown */}
            {!hidePeriodDropdown && (
                <div className="relative self-end sm:self-auto">
                    <button
                        className="flex items-center justify-between gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition-all duration-200 min-w-[120px] cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <span className="capitalize">{period}</span>
                        <ChevronDown
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-2 py-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {PERIODS.map((p) => (
                                    <button
                                        key={p}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-all ${
                                            period === p
                                                ? 'text-[#0ea5e9] bg-zinc-800/50'
                                                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                                        }`}
                                        onClick={() => {
                                            onPeriodChange(p);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <span className="capitalize">{p}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TabSwitcher;
