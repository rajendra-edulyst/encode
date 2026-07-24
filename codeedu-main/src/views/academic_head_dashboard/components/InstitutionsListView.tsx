import React, { useState } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';
import { INST_LIST_STATS, INSTITUTION_ALLOCATIONS } from '../data';

interface InstitutionsListViewProps {
    onViewDetail: (id: string) => void;
    onUpdateExportData?: (data: { sheets: { name: string; data: any[] }[] }) => void;
}

const TYPE_OPTIONS = ['All', 'University', 'College', 'Institute'] as const;
type TypeOption = typeof TYPE_OPTIONS[number];

const InstitutionsListView: React.FC<InstitutionsListViewProps> = ({ onViewDetail, onUpdateExportData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<TypeOption>('All');
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    // Filter allocations based on search query and type select
    const filteredAllocations = INSTITUTION_ALLOCATIONS.filter((inst) => {
        const matchesSearch =
            inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'All' || inst.type === selectedType;

        return matchesSearch && matchesType;
    });

    React.useEffect(() => {
        if (onUpdateExportData) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Institutions List',
                        data: filteredAllocations.map(inst => ({
                            'Institution ID': inst.id,
                            'Institution Name': inst.name,
                            'Type': inst.type,
                            'Location': inst.location,
                            'Licenses Sold': inst.licensesSold,
                            'Total Licenses': inst.licensesTotal,
                            'Students Enrolled': inst.studentsCount,
                            'Faculty Count': inst.facultyCount,
                            'Utilization Rate': inst.utilization + '%',
                            'Engagement': inst.engagement
                        }))
                    }
                ]
            });
        }
    }, [filteredAllocations, onUpdateExportData]);

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'University':
                return 'bg-[#4c1d95]/40 text-[#a78bfa] border border-[#6d28d9]/50';
            case 'College':
                return 'bg-[#831843]/40 text-[#f472b6] border border-[#9d174d]/50';
            case 'Institute':
                return 'bg-[#1e1b4b]/40 text-[#818cf8] border border-[#312e81]/50';
            default:
                return 'bg-zinc-800 text-zinc-300';
        }
    };

    const getUtilizationColor = (util: number) => {
        if (util >= 85) return 'bg-[#7FBC42]'; // brand green
        if (util >= 50) return 'bg-[#ffc531]'; // brand yellow / goldenrod
        return 'bg-[#E60086]'; // brand pink
    };

    const getUtilizationTextColor = (util: number) => {
        if (util >= 85) return 'text-[#7FBC42]';
        if (util >= 50) return 'text-[#ffc531]';
        return 'text-[#E60086]';
    };

    const getEngagementClass = (engagement: string) => {
        switch (engagement) {
            case 'High':
                return 'bg-[#7FBC42]/10 text-[#7FBC42] border border-[#7FBC42]/30';
            case 'Medium':
                return 'bg-[#ffc531]/10 text-[#ffc531] border border-[#ffc531]/30';
            case 'Low':
                return 'bg-[#E60086]/10 text-[#E60086] border border-[#E60086]/30';
            default:
                return 'bg-zinc-800/30 text-zinc-400';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Stat Cards Row */}
            <div className="flex flex-wrap gap-4">
                {INST_LIST_STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[#121212] border border-zinc-800/70 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-200 group w-full sm:w-[240px]"
                    >
                        <span className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wide">
                            {stat.label}
                        </span>
                        <div className="flex items-baseline mt-2">
                            <span className="text-2xl sm:text-3xl font-black group-hover:scale-105 transition-transform duration-200 origin-left">
                                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by Name, ID, City..."
                        value={searchQuery}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative w-full sm:w-auto">
                    <button
                        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition-all w-full sm:w-[150px] cursor-pointer"
                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    >
                        <span>{selectedType === 'All' ? 'All Types' : selectedType}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showTypeDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showTypeDropdown && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                            <div className="absolute right-0 mt-2 py-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {TYPE_OPTIONS.map((t) => (
                                    <button
                                        key={t}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-all ${
                                            selectedType === t 
                                            ? 'text-[#0ea5e9] bg-zinc-800/50' 
                                            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                                        }`}
                                        onClick={() => {
                                            setSelectedType(t);
                                            setShowTypeDropdown(false);
                                        }}
                                    >
                                        <span>{t === 'All' ? 'All Types' : t}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Institutions Allocation Table Card */}
            <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl overflow-hidden hover:border-zinc-800 transition-all duration-200 shadow-xl">
                <div className="p-6 border-b border-zinc-800/70">
                    <h3 className="text-lg font-bold text-white">Institutions & License Allocation</h3>
                </div>

                {/* Table container with responsive overflow scroll */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                <th className="px-6 py-4">Institution Details</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Licenses</th>
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4">Utilization</th>
                                <th className="px-6 py-4">Engagement</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAllocations.map((inst) => (
                                <tr key={inst.id} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                    {/* Name + ID */}
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm sm:text-base tracking-tight">{inst.name}</div>
                                        <div className="text-zinc-500 text-xs font-semibold mt-0.5">{inst.id}</div>
                                    </td>

                                    {/* Type badge */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeBadgeClass(inst.type)}`}>
                                            {inst.type}
                                        </span>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">
                                        {inst.location}
                                    </td>

                                    {/* Licenses fraction and available status */}
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-white text-sm">
                                            {inst.licensesSold.toLocaleString()}/{inst.licensesTotal.toLocaleString()}
                                        </div>
                                        <div className="text-zinc-500 text-[11px] font-bold mt-0.5">
                                            {(inst.licensesTotal - inst.licensesSold).toLocaleString()} available
                                        </div>
                                    </td>

                                    {/* Students count and faculty */}
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-white text-sm">
                                            {inst.studentsCount.toLocaleString()}
                                        </div>
                                        <div className="text-zinc-500 text-[11px] font-bold mt-0.5">
                                            {inst.facultyCount.toLocaleString()} Faculty
                                        </div>
                                    </td>

                                    {/* Utilization progress bar and value */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${getUtilizationColor(inst.utilization)}`} 
                                                    style={{ width: `${inst.utilization}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-black min-w-[30px] ${getUtilizationTextColor(inst.utilization)}`}>
                                                {inst.utilization}%
                                            </span>
                                        </div>
                                    </td>

                                    {/* Engagement pill */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${getEngagementClass(inst.engagement)}`}>
                                            {inst.engagement}
                                        </span>
                                    </td>

                                    {/* View more button */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg text-xs transition-all shadow-[0_2px_10px_rgba(14,165,233,0.2)] cursor-pointer"
                                            onClick={() => onViewDetail(inst.id)}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>View More</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAllocations.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500 text-sm font-semibold">
                                        No institutions found matching the search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstitutionsListView;
