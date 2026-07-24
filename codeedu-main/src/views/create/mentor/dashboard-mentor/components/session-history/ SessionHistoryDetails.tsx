import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Calendar, Clock, MapPin, FileText, X } from "lucide-react";
import { useMentorSessionDetails } from "@/hooks/data/create/useMentor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  sessionId: number | null;
}

export default function SessionHistoryDetails({ sessionId }: Props) {
  const { data, isLoading } = useMentorSessionDetails(sessionId as number);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);

  if (!sessionId) {
    return (
      <Card className="bg-neutral-900 h-full flex items-center justify-center">
        <span className="text-sm text-neutral-400">
          Select a session to view details
        </span>
      </Card>
    );
  }

  if (isLoading || !data) {
    return <Card className="bg-neutral-900 h-full" />;
  }

  const displayRating = Math.max(data.rating || 0, 3);
  const isFileAvailable = data.file && data.file.trim() !== "";
  const fileExtension = isFileAvailable ? data.file.split('.').pop()?.toLowerCase() : "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "");
  const isPDF = fileExtension === "pdf";

  return (
    <>
      <Card className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl h-full">
        <CardHeader>
          <CardTitle className="text-white text-xl">Session Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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
          <div>
            <p className="text-neutral-400 text-sm">Status</p>
            <span className="text-green-400 flex items-center gap-1 capitalize">
              <CheckCircle size={14} /> {data.status}
            </span>
          </div>

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

          {/* Feedback */}
          <div>
            <p className="text-neutral-400 text-sm mb-2">
              Your Feedback
            </p>
            <div className="bg-[#2A2A2A] rounded-xl p-4 text-sm text-neutral-300">
              {data.feedback || "No feedback provided"}
            </div>
          </div>

          {/* Session Outcomes */}
          <div>
            <p className="text-neutral-400 text-sm mb-2">Session Outcomes</p>
            <ul className="space-y-2">
              {data.outcomes && data.outcomes.length > 0 ? (
                data.outcomes.map((outcome: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} /> {outcome}
                  </li>
                ))
              ) : (
                <li className="text-neutral-500">No outcomes recorded</li>
              )}
            </ul>
          </div>
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


