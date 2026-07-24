import { FileText, Video, Users, ListFilter } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import AttendanceModal from "./AttendanceModal";
import { Session } from "@/@types/faculty/session";
import dayjs from "dayjs";
import { fetchLcLoad } from "@/services/learner/MyClassService";
import { Loader } from "lucide-react";

interface Props {
  session: Session;
}

export function SessionDetails({ session }: Props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (action === 'attendance' && session.id) {
      setIsAttendanceModalOpen(true);

      // Clear the action param after opening to avoid repeat triggers
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });
    }
  }, [action, session.id, searchParams, setSearchParams]);
  const joinMeetingNow = async () => {
    setIsJoining(true);
    try {
      await fetchLcLoad(String(session.id));
    } catch (error) {
      console.error("Error calling lc load:", error);
    }

    try {
      navigate(`/zoom/meeting/${session.id}`);
    } catch (error) {
      console.error("Error opening Zoom meeting:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const formattedDate = dayjs(session.start_date).format("MMM DD, YYYY");
  const formattedTime = `${dayjs(session.start_date).format("hh:mm A")} - ${dayjs(session.end_date).format("hh:mm A")}`;
  const contentTypeLabel = session.content_type
    ? session.content_type.replace(/[-_]/g, " ")
    : "Live Session";

  return (
    <>
      <div className="h-full rounded-2xl border border-[#3f3f3f] bg-[#2f2f2f] p-8 flex flex-col shadow-none">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[37px] font-bold text-white tracking-tight leading-none">
              {session.title}
            </h2>
            <div className="flex gap-2 mt-4">
              <div className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                session.is_external === 1 
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              )}>
                  {session.is_external === 1 ? "External" : "Internal"}
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-3 font-medium">
              {session.course_name || session.program_name || "—"}
            </p>
            <p className="text-neutral-400 text-sm mt-1.5 font-medium">
              {session.module_name || "—"}
            </p>
          </div>

          {/* TOP ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="w-24 h-20 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] font-bold leading-tight uppercase text-center">
                Attendance<br />Report
              </span>
            </button>

            <button
              onClick={joinMeetingNow}
              disabled={isJoining}
              className="w-24 h-20 rounded-2xl bg-[#6a6a6a] hover:bg-[#747474] text-white flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 border border-transparent disabled:opacity-50"
            >
              {isJoining ? (
                <Loader className="w-5 h-5 text-sky-500 animate-spin" />
              ) : (
                <Video className="w-5 h-5 text-neutral-400" />
              )}
              <span className="text-[10px] font-bold leading-tight uppercase text-center">
                Join<br />Session
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <DetailBox label="Type" value={contentTypeLabel} />
          <DetailBox label="Duration" value={`${session.expected_duration} min`} />
          <DetailBox label="Date" value={formattedDate} />
          <DetailBox label="Time" value={formattedTime} />
        </div>

        {/* SESSION DETAILS SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-neutral-500" />
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Session Details</h4>
          </div>
          <div className="bg-[#313131] border border-[#474747] rounded-2xl p-5">
            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">Registered Students</p>
            <p className="text-white font-black text-3xl">{session.total_users}</p>
          </div>
        </div>

        {/* AGENDA SECTION */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <ListFilter className="w-4 h-4 text-neutral-500" />
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Agenda</h4>
          </div>
          <div className="text-neutral-400 text-xs font-semibold">
            {session.content ? (
              <div dangerouslySetInnerHTML={{ __html: session.content }} />
            ) : (
              <ul className="space-y-3">
                <AgendaItem text="No agenda provided" />
              </ul>
            )}
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

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#313131] border border-[#474747] rounded-2xl p-4">
      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-white font-semibold text-[22px] leading-tight tracking-tight">{value}</p>
    </div>
  );
}

function AgendaItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-sky-500/50" />
      <span className="text-neutral-400 text-xs font-semibold hover:text-white transition-colors cursor-default">{text}</span>
    </li>
  );
}
