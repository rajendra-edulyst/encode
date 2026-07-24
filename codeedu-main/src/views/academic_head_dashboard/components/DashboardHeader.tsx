import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

interface DashboardHeaderProps {
    currentTime: string;
    fallbackDate: string;
    onExport: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    currentTime,
    fallbackDate,
    onExport,
}) => {
    const navigate = useNavigate();

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
                    title="Go back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                    Academic Head Dashboard
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 self-end sm:self-auto">
                <div className="flex flex-col items-end text-right">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                        Last Updated
                    </span>
                    <span className="text-zinc-300 text-sm font-medium">
                        {currentTime || fallbackDate}
                    </span>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] active:scale-95 text-white font-semibold rounded-xl text-sm shadow-[0_4px_20px_rgba(14,165,233,0.3)] transition-all duration-200 cursor-pointer"
                    onClick={onExport}
                >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
