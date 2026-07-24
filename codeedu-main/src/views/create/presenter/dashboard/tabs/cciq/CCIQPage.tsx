import React, { useState } from 'react';
import CourseStatCard from '../course-sessions/CourseStatCard';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';
import CourseTabs from '../course-sessions/CourseTabs';
import { Progress } from '@/components/ui/progress';
import CCIQParticipantDetail from './CCIQParticipantDetail';
import { useCCIProgressReport } from '@/hooks/data/create/useInstructor';

const CCIQPage = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

    const { data: reportData, isLoading } = useCCIProgressReport();

    const stats = [
        { title: "Total Participants", value: reportData?.total_participants ?? "0" },
        { title: "Active Participants", value: reportData?.active_participants ?? "0" },
        { title: "CCIQ Completed", value: reportData?.cciq_completed ?? "0" },
    ];

    const getStageIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-[#0AA3CF]" />;
            case 'ongoing':
            case 'inprogress':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-pink-500" />;
            case 'not_started':
                return <div className="w-4 h-4 rounded-full border-2 border-neutral-600" />;
            default:
                return null;
        }
    };

    const participants = reportData?.data || [];

    // Filter participants based on active tab and search query
    const filteredParticipants = participants.filter((p: any) => {
        const matchesSearch = p.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(p.user_id)?.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        if (activeTab.toLowerCase() === 'on going') {
            matchesTab = p.overall_progress > 0 && p.overall_progress < 100;
        } else if (activeTab.toLowerCase() === 'completed') {
            matchesTab = p.overall_progress === 100;
        }

        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <CourseStatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 shadow-2xl space-y-6">
                {selectedParticipant ? (
                    <CCIQParticipantDetail
                        participant={selectedParticipant}
                        onBack={() => setSelectedParticipant(null)}
                    />
                ) : (
                    <>
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <Input
                                    placeholder="Search Participants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-[#1c1c1c] border-white/5 text-white placeholder:text-neutral-600 rounded-xl h-11"
                                />
                            </div>
                            <CourseTabs
                                active={activeTab}
                                onChange={setActiveTab}
                                tabs={["All", "On going", "Completed"]}
                            />
                        </div>

                        {/* Table Area */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                        <th className="px-4 py-4 font-bold">Participant</th>
                                        <th className="px-4 py-4 font-bold">ID</th>
                                        <th className="px-4 py-4 font-bold text-center">Stage 1</th>
                                        <th className="px-4 py-4 font-bold text-center">Stage 2</th>
                                        <th className="px-4 py-4 font-bold text-center">Stage 3</th>
                                        <th className="px-4 py-4 font-bold">Overall Progress</th>
                                        <th className="px-4 py-4 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-neutral-500">Loading participants...</td>
                                        </tr>
                                    ) : filteredParticipants.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-neutral-500">No participants found.</td>
                                        </tr>
                                    ) : (
                                        filteredParticipants.map((participant: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">{participant.user_name}</span>
                                                        <span className="text-neutral-500 text-xs mt-1">{participant.user_email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-neutral-300 font-medium">STU-{participant.user_id}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex justify-center">{getStageIcon(participant.stage_1)}</div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex justify-center">{getStageIcon(participant.stage_2)}</div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex justify-center">{getStageIcon(participant.stage_3)}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Progress
                                                            value={participant.overall_progress}
                                                            className="h-1.5 w-32 bg-[#4b4b4b]"
                                                            indicatorClassName={participant.overall_progress === 100 ? "bg-[#7fbc42]" : "bg-yellow-500"}
                                                        />
                                                        <span className="text-neutral-300 font-medium tabular-nums text-xs">{participant.overall_progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedParticipant(participant)}
                                                        className="inline-flex items-center gap-2 bg-[#0AA3CF]/10 text-[#0AA3CF] hover:bg-[#0AA3CF]/20 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Progress
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CCIQPage;
