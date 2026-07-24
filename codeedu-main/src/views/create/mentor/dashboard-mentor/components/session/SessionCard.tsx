import { Card } from "@/components/ui/card";
import { Check, X, Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";
import { fetchMentorLcLoad } from "@/services/learner/MyClassService";

type Props = {
  id: number;
  name: string;
  title: string;
  time: string;
  status: 1 | 2;
  image?: string | null;
  isActive?: boolean;
  meeting_link?: string;
  onClick?: () => void;
  onApprove?: (id: number) => void;
  onDecline?: (id: number) => void;
};

/* ---------- Avatar ---------- */
function Avatar({ src, name }: { src?: string | null; name: string }) {
  const [error, setError] = useState(false);

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=random&size=400`;

  return (
    <img
      src={!src || error ? fallback : src}
      alt={name}
      className="h-12 w-12 rounded-full object-cover"
      onError={() => setError(true)}
    />
  );
}

/* ---------- Helper ---------- */
function formatSessionTime(timeStr: string) {
  try {
    const matches = timeStr.match(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/g);
    if (matches && matches.length >= 2) {
      const start = new Date(matches[0].replace(' ', 'T'));
      const end = new Date(matches[1].replace(' ', 'T'));

      const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
      }
    }
  } catch (e) { /* ignore */ }
  return timeStr;
}

/* ---------- Countdown Hook ---------- */
function useSessionCountdown(timeStr: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const sessionMs = (() => {
    try {
      const match = timeStr.match(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/);
      if (match) {
        const d = new Date(match[1].replace(' ', 'T'));
        if (!isNaN(d.getTime())) return d.getTime();
      }
    } catch { /* ignore */ }
    return NaN;
  })();

  const diffMs = sessionMs - now;
  const diffSec = Math.floor(diffMs / 1000);
  // Enable join within 5 min before session and up to 30 min after
  const canJoin = diffMs <= 5 * 60 * 1000 && diffMs > -30 * 60 * 1000;

  const days = Math.max(0, Math.floor(diffSec / (3600 * 24)));
  const hours = Math.max(0, Math.floor((diffSec % (3600 * 24)) / 3600));
  const minutes = Math.max(0, Math.floor((diffSec % 3600) / 60));
  const seconds = Math.max(0, diffSec % 60);

  return { canJoin, days, hours, minutes, seconds, diffMs, timeUnknown: isNaN(sessionMs) };
}

/* ---------- Tooltip (Portal) ---------- */
function SessionTooltip({
  anchorRef,
  visible,
  title,
  name,
  time,
  canJoin,
  minutes,
  seconds,
  showCountdown,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  title: string;
  name: string;
  time: string;
  canJoin: boolean;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  showCountdown?: boolean;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (visible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [visible, anchorRef]);

  if (!visible) return null;

  return createPortal(
    <>
      <style>{`
        .session-tooltip-box {
          position: fixed !important;
          z-index: 99999 !important;
          background: #111 !important;
          opacity: 1 !important;
          border: 1px solid #009BD8 !important;
          border-radius: 10px !important;
          padding: 12px 14px !important;
          box-shadow: 0 4px 30px rgba(0,0,0,1) !important;
          pointer-events: none !important;
          isolation: isolate !important;
          width: 250px !important;
        }
      `}</style>
      <div
        className="session-tooltip-box"
        style={{
          bottom: `${window.innerHeight - pos.top}px`,
          right: `${pos.right}px`,
        }}
      >
        <p style={{ color: '#009BD8', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>
          {canJoin ? '✅ Your Mentoring Session' : 'Your Mentoring Session'}
        </p>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: '0 0 4px 0' }}>{title}</p>
        <p style={{ color: '#ccc', fontSize: '12px', margin: '0 0 4px 0' }}>with <span style={{ color: '#fff' }}>{name}</span></p>
        <p style={{ color: '#009BD8', fontSize: '11px', fontWeight: 600, margin: '0 0 4px 0' }}>🕐 {time}</p>
        {showCountdown && minutes !== undefined && seconds !== undefined && (
          <p style={{ color: '#009BD8', fontSize: '11px', fontWeight: 500, margin: 0 }}>Starts in {minutes}m {seconds}s</p>
        )}
        {!canJoin && !showCountdown && (
          <p style={{ color: '#facc15', fontSize: '11px', fontWeight: 500, margin: 0 }}>Join button enables 5 min before start</p>
        )}
      </div>
    </>,
    document.body
  );
}

/* ---------- Card ---------- */
export default function SessionCard({
  id,
  name,
  title,
  time,
  status,
  image,
  isActive = false,
  meeting_link,
  onClick,
  onApprove,
  onDecline,
  approvalStatus,
}: Props & { approvalStatus?: number }) {
  const navigate = useNavigate();
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipAnchorRef = useRef<HTMLDivElement>(null);

  const { canJoin, days, hours, minutes, seconds, diffMs, timeUnknown } = useSessionCountdown(time);
  const showCountdown = status === 1 && diffMs > 0 && !timeUnknown;

  return (
    <>
      <Card
        className={cn(
          "bg-[#1F1F1F] border rounded-2xl px-6 py-5 cursor-pointer transition-all",
          "border-[#2A2A2A] hover:border-neutral-500",
          isActive && "border-blue-500 bg-[#242424]"
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Avatar src={image} name={name} />
            <div>
              <p className="text-white font-medium">{name}</p>
              <p className="text-sm text-neutral-400">{title}</p>
              <p className="text-xs text-neutral-500 mt-1">{formatSessionTime(time)}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex gap-3 items-center">
            {status === 1 ? (
              <>
                {showCountdown && (
                  /* — Countdown flip clock style — */
                  <div
                    className="flex flex-col items-center justify-center mr-4"
                    ref={tooltipAnchorRef}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <span className="text-[#a0a0a0] text-[9px] font-semibold uppercase tracking-widest mb-1.5">Starts In</span>
                    <div className="flex gap-1.5">
                      {days !== undefined && days > 0 && (
                        <div className="flex flex-col items-center">
                          <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                            <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                            <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                              {String(days).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Days</span>
                        </div>
                      )}

                      <div className="flex flex-col items-center">
                        <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                          <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                          <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(hours).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Hours</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                          <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                          <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(minutes).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Mins</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="relative bg-[#1A1A1A] border border-[#333] rounded shadow-inner px-1.5 py-1 flex items-center justify-center min-w-[32px]">
                          <div className="absolute inset-0 h-[1px] bg-black/40 top-1/2 w-full z-10" />
                          <span className="text-gray-200 font-mono font-bold text-sm leading-none z-0">
                            {String(seconds).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-[#888888] text-[8px] font-bold uppercase mt-1 tracking-wider">Secs</span>
                      </div>
                    </div>
                    <SessionTooltip anchorRef={tooltipAnchorRef} visible={showTooltip} title={title} name={name} time={time} canJoin={canJoin} days={days} hours={hours} minutes={minutes} seconds={seconds} showCountdown />
                  </div>
                )}

                {/* — Join Session button: enabled within 5 min — */}
                <div
                  className={cn(
                    "relative bg-[#9810FA] px-3 py-3 rounded-xl w-[115px] text-white flex items-center justify-center transition-colors",
                    canJoin && !isJoining
                      ? "cursor-pointer hover:bg-[#8000D4]"
                      : "opacity-50 cursor-not-allowed"
                  )}
                  ref={!showCountdown ? tooltipAnchorRef : undefined}
                  onMouseEnter={() => !showCountdown && setShowTooltip(true)}
                  onMouseLeave={() => !showCountdown && setShowTooltip(false)}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!canJoin || isJoining) return;
                    setIsJoining(true);
                    try {
                      if (!meeting_link || meeting_link.trim() === '') {
                        await ApiService.fetchDataWithAxios({
                          url: `/create-calendar-zoom/${id}`,
                          method: 'post',
                          data: { calender_id: id }
                        });
                        await fetchMentorLcLoad(String(id));
                      }
                      navigate(`/zoom/meeting/${id}?is_mentoring=1`);
                    } catch (error) {
                      console.error("Error creating zoom meeting or lc load:", error);
                      toast.error("Failed to prepare session");
                    } finally {
                      setIsJoining(false);
                    }
                  }}
                >
                  {isJoining ? (
                    <Loader className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <span className="font-semibold text-sm">Join Session</span>
                  )}
                  {!showCountdown && (
                    <SessionTooltip anchorRef={tooltipAnchorRef} visible={showTooltip} title={title} name={name} time={time} canJoin={canJoin} />
                  )}
                </div>

                <div className="bg-[#5A5A5A] px-3 py-3 rounded-xl w-[112px] text-white flex items-center justify-center cursor-not-allowed opacity-50">
                  Reschedule
                </div>
              </>
            ) : approvalStatus === 2 ? (
              <div
                className="bg-[#5A5A5A] px-3 py-3 rounded-xl w-[112px] text-white flex items-center justify-center cursor-not-allowed opacity-50"
                onClick={(e) => e.stopPropagation()}
              >
                Rejected
              </div>
            ) : (
              <>
                <div
                  className="bg-[#7FBC42] hover:bg-[#7FBC42]/70 px-3 py-3 rounded-xl w-[112px] text-black flex flex-col items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove?.(id);
                  }}
                >
                  <Check size={18} />
                  Approve
                </div>

                <div
                  className="bg-[#FF1F29] hover:bg-[#FF1F29]/70 px-3 py-3 rounded-xl w-[112px] text-white flex flex-col items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeclineConfirm(true);
                  }}
                >
                  <X size={18} />
                  Decline
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeclineConfirm} onOpenChange={setShowDeclineConfirm}>
        <AlertDialogContent className="bg-[#1E1E1E] border-[#686868] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Do you want to reject this request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-600 hover:bg-gray-800 text-white hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#FF1F29] hover:bg-[#FF1F29]/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDecline?.(id);
                setShowDeclineConfirm(false);
              }}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
