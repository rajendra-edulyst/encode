import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import {
  Calendar,
  Clock,
  Check,
  X,
  Star,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMentorSessionDetails } from "@/hooks/data/create/useMentor";
import { useState } from "react";
import { AcceptInvite, RejectInvite } from "@/views/create/old_calendar/services/CalendarService";

interface Props {
  sessionId: number | null;
}

type MentorSessionDetailStatus = "completed" | "pending" | "upcoming";

export default function SessionDetails({ sessionId }: Props) {
  const { data, isLoading, refetch } = useMentorSessionDetails(
    sessionId as number,

  );

  const [actionLoading, setActionLoading] = useState<
    "approve" | "decline" | null
  >(null);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);

  if (!sessionId) {
    return (
      <Card className="bg-[#1F1F1F] border-[#2A2A2A] h-full flex items-center justify-center">
        <span className="text-sm text-neutral-400">
          Select a session to view details
        </span>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="bg-[#1F1F1F] h-full flex items-center justify-center">
        <span className="text-sm text-neutral-400">
          Loading session details…
        </span>
      </Card>
    );
  }

  const status = data.status as MentorSessionDetailStatus;
  const isPending = status === "pending";
  const displayRating = Math.max(data.rating || 0, 3);
  const isFileAvailable = data.file && data.file.trim() !== "";
  const fileExtension = isFileAvailable ? data.file.split('.').pop()?.toLowerCase() : "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "");
  const isPDF = fileExtension === "pdf";

  /* ---------- Handlers ---------- */
  const handleApprove = async () => {
    try {
      setActionLoading("approve");
      await AcceptInvite(sessionId);
      await refetch();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async () => {
    try {
      setActionLoading("decline");
      await RejectInvite(sessionId);
      await refetch();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Card className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl h-full">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Session Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Top Row */}
          <div className="flex justify-between gap-6">
            {/* Mentor Info */}
            <div className="flex items-center gap-4">
              <img
                src={
                  data.image ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    data.mentor_name
                  )}`
                }
                className="h-12 w-12 rounded-full object-cover"
                alt={`${data.mentor_name}'s profile`}
              />

              <div>
                <p className="text-white font-medium">
                  {data.mentor_name}
                </p>
                <p className="text-sm text-neutral-400">
                  Mentee
                </p>
              </div>
            </div>

            {/* Approve / Decline */}
            {isPending && (
              <div className="flex gap-4">
                <Button
                  disabled={actionLoading !== null}
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-black h-[96px] w-[96px] rounded-xl flex flex-col items-center justify-center gap-2"
                  onClick={handleApprove}
                >
                  <Check size={22} />
                  <span className="text-sm font-medium text-center">
                    {actionLoading === "approve" ? "Approving…" : "Approve"}
                    <br />
                    Session
                  </span>
                </Button>

                <Button
                  disabled={actionLoading !== null}
                  className="bg-[#F44336] hover:bg-[#E53935] text-white h-[96px] w-[96px] rounded-xl flex flex-col items-center justify-center gap-2"
                  onClick={handleDecline}
                >
                  <X size={22} />
                  <span className="text-sm font-medium text-center">
                    {actionLoading === "decline" ? "Declining…" : "Decline"}
                    <br />
                    Session
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Topic */}
          <div>
            <p className="text-sm text-neutral-400">Topic</p>
            <p className="text-white">{data.topic}</p>
          </div>

          {/* Date / Time / Duration / Rating */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-neutral-400">Date</p>
              <p className="text-white flex items-center gap-2">
                <Calendar size={14} />
                {data.date}
              </p>
            </div>

            <div>
              <p className="text-neutral-400">Duration</p>
              <p className="text-white flex items-center gap-2">
                <Clock size={14} />
                {data.duration}
              </p>
            </div>

            <div>
              <p className="text-neutral-400">Time</p>
              <p className="text-white">{data.time}</p>
            </div>

            <div>
              <p className="text-neutral-400">Rating</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < displayRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          {!isPending && (
            <div>
              <p className="text-neutral-400 text-sm">Status</p>
              <span className="text-green-400 flex items-center gap-1 capitalize">
                <CheckCircle size={14} /> {status}
              </span>
            </div>
          )}

          {/* Attendance */}
          <div>
            <p className="text-neutral-400 text-sm">Attendance</p>
            <p className="text-white">On time</p>
          </div>

          {/* Session Notes */}
          <div>
            <p className="text-neutral-400 text-sm mb-2">
              Session Notes
            </p>
            {isFileAvailable ? (
              <div
                onClick={() => setFilePreviewOpen(true)}
                className="bg-[#2A2A2A] rounded-xl p-4 text-sm text-neutral-300 cursor-pointer hover:bg-[#333333] transition-colors flex items-center gap-2"
              >
                <FileText size={16} className="text-primary" />
                <span>Click to view attached file</span>
              </div>
            ) : (
              <div className="bg-[#2A2A2A] rounded-xl p-4 text-sm text-neutral-300">
                {data.session_notes || "No notes available"}
              </div>
            )}
          </div>

          {/* Feedback (only show if available) */}
          {data.feedback && (
            <div>
              <p className="text-neutral-400 text-sm mb-2">
                Your Feedback
              </p>
              <div className="bg-[#2A2A2A] rounded-xl p-4 text-sm text-neutral-300">
                {data.feedback}
              </div>
            </div>
          )}

          {/* Session Outcomes (only show if available) */}
          {data.outcomes && data.outcomes.length > 0 && (
            <div>
              <p className="text-neutral-400 text-sm mb-2">Session Outcomes</p>
              <ul className="space-y-2">
                {data.outcomes.map((outcome: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} /> {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview Dialog */}
      <Dialog open={filePreviewOpen} onOpenChange={setFilePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[#1F1F1F] border-[#2A2A2A]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Session Notes - File Preview
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[70vh]">
            {isImage && (
              <img
                src={data.file}
                alt="Session notes"
                className="w-full h-auto rounded-lg"
              />
            )}
            {isPDF && (
              <iframe
                src={data.file}
                className="w-full h-[70vh] rounded-lg"
                title="PDF Preview"
              />
            )}
            {!isImage && !isPDF && (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
                <p className="text-neutral-400 mb-4">Preview not available for this file type</p>
                <a
                  href={data.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Open file in new tab
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
