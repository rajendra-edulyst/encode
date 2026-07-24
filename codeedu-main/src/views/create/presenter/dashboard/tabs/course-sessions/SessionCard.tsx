import { useState } from "react";
import { FileText, ArrowRight, User, Calendar, Hourglass } from "lucide-react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoTimer } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { cn } from "@/lib/utils";
import AttendanceModal from "./AttendanceModal";
import { Session } from "@/@types/faculty/session";
import dayjs from "dayjs";

interface Props {
    session: Session;
    selected?: boolean;
    onClick?: () => void;
}

export function SessionCard({ session, selected, onClick }: Props) {
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

    const normalizedStatus = (session.class_status || session.status || "").toLowerCase();
    const isCompleted = ["completed", "published", "concluded"].includes(normalizedStatus);
    const isScheduled = ["scheduled", "upcoming"].includes(normalizedStatus);
    const isOngoing = ["ongoing", "active"].includes(normalizedStatus);
    const statusLabel = isCompleted
        ? "Completed"
        : isScheduled
            ? "Scheduled"
            : isOngoing
                ? "Ongoing"
                : (session.status || "Unknown");

    const handleAttendanceClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAttendanceModalOpen(true);
    };

    const formattedDate = dayjs(session.start_date).format("MMM DD, YYYY");
    const formattedTime = `${dayjs(session.start_date).format("hh:mm A")} - ${dayjs(session.end_date).format("hh:mm A")}`;

    return (
        <>
            <div
                onClick={onClick}
                className={cn(
                    "rounded-2xl p-5 border transition-all duration-300 cursor-pointer bg-[#2f2f2f]",
                    selected
                        ? "border-sky-500 ring-1 ring-sky-500/60"
                        : "border-[#3f3f3f] hover:border-[#4e4e4e]"
                )}
            >
                <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-4">

                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            isCompleted && "bg-green-500/10 text-green-500",
                            isScheduled && "bg-sky-500/10 text-sky-500",
                            isOngoing && "bg-yellow-500/10 text-yellow-500"
                        )}>
                            {isCompleted && <FaCircleCheck className="w-5 h-5" />}
                            {isScheduled && <Calendar className="w-5 h-5" />}
                            {isOngoing && <Hourglass className="w-5 h-5" />}
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-sm leading-tight tracking-tight">
                                {session.title}
                            </h3>
                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">
                                {session.course_name || session.program_name || "—"}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">
                                {session.module_name || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <div className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                            isCompleted && "bg-green-500/10 text-green-400",
                            isScheduled && "bg-sky-500/10 text-sky-400",
                            isOngoing && "bg-yellow-500/10 text-yellow-500",
                            !isCompleted && !isScheduled && !isOngoing && "bg-neutral-700/70 text-neutral-200"
                        )}>
                            {statusLabel}
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                            session.is_external === 1
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>
                            {session.is_external === 1 ? "External" : "Internal"}
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div className="space-y-2 text-[11px] text-neutral-400">
                        <div className="flex items-center gap-2">
                            <CiCalendarDate className="text-sm" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IoTimer className="text-sm" />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-3 font-medium">
                            <span className="flex items-center gap-1.5">
                                Attendance: <span className="text-green-500">
                                    {session.total_users > 0 ? Math.round((session.attended_count / session.total_users) * 100) : 0}%
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {session.total_users}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Attendance Report Button */}
                        {!isScheduled && (
                            <button
                                onClick={handleAttendanceClick}
                                className="h-16 w-[92px] rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="text-[9px] font-bold leading-none text-center px-1">
                                    Attendance<br />Report
                                </span>
                            </button>
                        )}

                        {/* View Details Button */}
                        <button className="h-16 w-[92px] rounded-xl bg-[#6a6a6a] hover:bg-[#747474] text-white flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95">
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-[9px] font-bold leading-none text-center">
                                View<br />Details
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <AttendanceModal
                isOpen={isAttendanceModalOpen}
                onClose={() => setIsAttendanceModalOpen(false)}
                sessionId={session.id}
            />
        </>
    );
}
