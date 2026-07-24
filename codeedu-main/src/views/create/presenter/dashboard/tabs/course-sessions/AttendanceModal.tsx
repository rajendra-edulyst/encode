import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Download, UserCheck, UserX, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionUsers, markAttendance } from "@/services/faculty/SessionsService";
import { Learners } from "@/@types/faculty/session";
import { toast } from "sonner";

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number;
}

export default function AttendanceModal({ isOpen, onClose, sessionId }: AttendanceModalProps) {
    const navigate = useNavigate();
    const [learners, setLearners] = useState<Learners[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExternal, setIsExternal] = useState<boolean>(true);


    const fetchUsers = async (opts?: { showLoading?: boolean }) => {
        const showLoading = opts?.showLoading !== false;
        try {
            if (showLoading) setIsLoading(true);
            const data = await getSessionUsers(sessionId);
            setLearners(data.class_users || []);
            setIsExternal(data.content_details?.[0]?.is_external === 1);

        } catch (error) {
            console.error("Failed to fetch session users:", error);
            toast.error("Failed to fetch session users");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && sessionId) {
            fetchUsers({ showLoading: true });
        }
    }, [isOpen, sessionId]);

    const handleMarkAttendance = async (userId: number, status: 'attended' | 'absent') => {
        try {
            await markAttendance(sessionId, [userId], status);
            toast.success(`Marked as ${status}`);
            fetchUsers({ showLoading: false });
        } catch (error) {
            toast.error("Failed to update attendance");
        }
    };

    const handleMarkAll = async (status: 'attended' | 'absent') => {
        try {
            const userIds = learners.map(l => l.user_id);
            if (userIds.length === 0) return;
            await markAttendance(sessionId, userIds, status);
            toast.success(`All marked as ${status}`);
            fetchUsers({ showLoading: false });
        } catch (error) {
            toast.error("Failed to update attendance");
        }
    };

    const handleCloseButtonClick = () => {
        onClose();
    };

    const filteredLearners = learners.filter(student =>
        (student.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-[#1c1c1c] border-white/5 p-0 overflow-hidden rounded-3xl [&>button]:hidden">
                <div className="absolute top-2 right-2 z-50">
                    <button
                        type="button"
                        onClick={handleCloseButtonClick}
                        className="p-1 text-neutral-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex flex-col justify-between h-20 w-fit">
                            {/* <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mt-1">
                                Attendance Report
                            </h2> */}

                            {/* Search Filter */}
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 absolute left-4 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#82c91e]/50 transition-colors font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex flex-col items-center justify-center w-24 h-20 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                                <Download className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Export</span>
                            </button>

                            <button
                                onClick={() => handleMarkAll('attended')}
                                disabled={!isExternal}
                                className={cn(
                                    "flex flex-col items-center justify-center px-4 h-20 rounded-2xl bg-[#82c91e] hover:bg-[#74b816] text-[#1c1c1c] transition-all font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-[#82c91e]/20 active:scale-95",
                                    !isExternal && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                Mark<br />All Present
                            </button>

                            <button
                                onClick={() => handleMarkAll('absent')}
                                disabled={!isExternal}
                                className={cn(
                                    "flex flex-col items-center justify-center px-4 h-20 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-red-500/20 active:scale-95",
                                    !isExternal && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                Mark<br />All Absent
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-neutral-500 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p className="font-bold uppercase tracking-widest text-[10px]">Loading Students...</p>
                            </div>
                        ) : filteredLearners.length === 0 ? (
                            <div className="py-20 text-center text-neutral-500 font-medium bg-[#262626] rounded-2xl border border-white/5">
                                {searchQuery ? "No students match your search." : "No students found for this session."}
                            </div>
                        ) : (
                            filteredLearners.map((student) => {
                                const isPresent = student.status === "attended";
                                const isAbsent = student.status === "absent";
                                return (
                                    <div key={student.user_id} className="relative bg-[#262626] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
                                        {/* Status Badge - top-left on card (not on avatar) */}
                                        <span className={cn(
                                            "absolute top-3 left-3 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest",
                                            isPresent ? "bg-green-500/20 text-green-500" : isAbsent ? "bg-red-500/20 text-red-500" : "bg-sky-500/20 text-sky-500"
                                        )}>
                                            {student.status}
                                        </span>

                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div>
                                                <div className="w-12 h-12 rounded-xl bg-neutral-800 overflow-hidden border border-white/5 mt-3">
                                                    <img
                                                        src={student.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user_id}`}
                                                        alt={student.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <h4 className="text-white font-bold text-sm tracking-tight">{student.name}</h4>
                                                <p className="text-neutral-500 text-[11px] font-medium">{student.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            {/* Present Button */}
                                            <button
                                                onClick={() => handleMarkAttendance(student.user_id, 'attended')}
                                                disabled={!isExternal}
                                                className={cn(
                                                    "w-24 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border-2 uppercase font-bold text-[10px] tracking-widest",
                                                    isPresent
                                                        ? "bg-[#82c91e] border-transparent text-[#1c1c1c]"
                                                        : "bg-[#262626] border-[#82c91e]/20 text-neutral-500 hover:border-[#82c91e]/50",
                                                    !isExternal && "opacity-50 cursor-not-allowed"
                                                )}

                                            >
                                                <UserCheck className={cn("w-5 h-5", isPresent ? "text-[#1c1c1c]" : "text-neutral-500")} />
                                                <span>Present</span>
                                            </button>
                                            {/* Absent Button */}
                                            <button
                                                onClick={() => handleMarkAttendance(student.user_id, 'absent')}
                                                disabled={!isExternal}
                                                className={cn(
                                                    "w-24 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border-2 uppercase font-bold text-[10px] tracking-widest",
                                                    isAbsent
                                                        ? "bg-red-500 border-transparent text-white"
                                                        : "bg-[#262626] border-red-500/20 text-neutral-500 hover:border-red-500/50",
                                                    !isExternal && "opacity-50 cursor-not-allowed"
                                                )}

                                            >
                                                <UserX className={cn("w-5 h-5", isAbsent ? "text-white" : "text-neutral-500")} />
                                                <span>Absent</span>
                                            </button>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
