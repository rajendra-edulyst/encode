import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StatItem } from '../types';

interface StatCardsGridProps {
    stats: StatItem[];
}

const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-[#121212] border border-zinc-800/70 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-200 group"
                >
                    <span className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wide">
                        {stat.label}
                    </span>
                    <div className="flex items-baseline justify-between mt-2 gap-2">
                        <span className="text-2xl sm:text-3xl font-black group-hover:scale-105 transition-transform duration-200 origin-left">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </span>
                        {stat.change && (
                            <span
                                className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                                    stat.isPositive
                                        ? 'text-[#7FBC42] bg-[#7FBC42]/10'
                                        : 'text-[#E60086] bg-[#E60086]/10'
                                }`}
                            >
                                {stat.isPositive ? (
                                    <TrendingUp className="w-3 h-3 mr-0.5" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 mr-0.5" />
                                )}
                                {stat.change}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCardsGrid;
