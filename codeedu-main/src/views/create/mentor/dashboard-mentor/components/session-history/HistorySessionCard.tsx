import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MentorSessionHistoryItem } from "@/@types/create/mentor";
import { useState } from "react";
import VideoPlayer from '@/views/player/video'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CommonModuleContent } from '@/@types/learner/Courses'

interface Props {
  session: MentorSessionHistoryItem;
  isActive?: boolean;
  onClick?: () => void;
}

/* ---------- Avatar Component ---------- */
function Avatar({
  src,
  name,
}: {
  src?: string | null;
  name?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=random&size=400`;

  return (
    <img
      src={!src || imgError ? avatarFallback : src}
      alt={name}

      className="h-12 w-12 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

/* ---------- Main Component ---------- */
export default function HistorySessionCard({
  session,
  isActive,
  onClick,
}: Props) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayerOpen(true);
  };

  const activeContent: CommonModuleContent = {
    url: session.recording_url || "",
    title: session.topic,
    program_content_id: session.id,
  } as any;
  return (
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
        <div className="flex gap-4">
          <Avatar
            src={session.profile_pic}
            name={session.name}
          />

          <div>
            <p className="text-white font-medium">
              {session.name || "Unknown User"}
            </p>
            <p className="text-sm text-neutral-400">
              {session.topic}
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {session.date}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={12} />
                {session.duration}
              </span>
            </div>

            {/* Rating */}
            {session.rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[...Array(session.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
                <span className="text-xs text-neutral-400 ml-1">
                  ({session.rating}.0)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* STATUS & ACTIONS */}
        <div className="flex items-center gap-3">
          {session?.recording_url && session?.status === "Completed" && (
            <button
              onClick={handleVideoClick}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="View Recording"
            >
              <Video size={18} />
            </button>
          )}

          <Badge
            className={cn(
              "flex items-center gap-1",
              session.status === "Completed"
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {session.status === "Completed" ? (
              <>
                <CheckCircle size={12} />
                Completed
              </>
            ) : (
              <>
                <XCircle size={12} />
                Rejected
              </>
            )}
          </Badge>
        </div>
      </div>

      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-black border-none" onClick={(e) => e.stopPropagation()}>
          <DialogHeader className="p-4 bg-card border-b">
            <DialogTitle className="text-white">{session.topic}</DialogTitle>
          </DialogHeader>
          <div className="w-full flex items-center justify-center bg-black">
            {isPlayerOpen && <VideoPlayer content={activeContent} />}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
