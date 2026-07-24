import React from 'react';
import { Star } from 'lucide-react';

interface StatItemProps {
    label: string;
    value: string | number;
    showStar?: boolean;
    showSeparator?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, showStar, showSeparator }) => (
    <div className="text-center relative flex-1">
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <div className="flex items-center justify-center gap-2">
            {showStar && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        {showSeparator && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-gray-700 hidden md:block"></div>
        )}
    </div>
);

const IndustryStats = () => {
    return (
        <div className="bg-[#1A1A1A] rounded-3xl border border-gray-800 py-8 px-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
                <StatItem label="Mode" value="Online" showSeparator />
                <StatItem label="Registered Users" value="250+" showSeparator />
                <StatItem label="Skills" value="12" showSeparator />
                <StatItem label="Rating" value="4.8" showStar />
            </div>
        </div>
    );
};

export default IndustryStats;
