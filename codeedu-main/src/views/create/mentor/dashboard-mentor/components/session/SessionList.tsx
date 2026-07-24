import { useEffect } from "react";
import SessionCard from "./SessionCard";
import { useMentorUpcomingSessions } from "@/hooks/data/create/useMentor";
import { AcceptInvite, RejectInvite } from "@/views/create/old_calendar/services/CalendarService";


import { useQueryClient } from "@tanstack/react-query";

interface Props {
  selectedSessionId: number | null;
  onSelect: (id: number) => void;
  initialSelectedId?: number | null;
  timeFilter?: string;
}

export default function SessionList({
  onSelect,
  selectedSessionId,
  initialSelectedId,
  timeFilter,
}: Props) {
  const { data, isLoading, refetch } = useMentorUpcomingSessions(timeFilter);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialSelectedId && data) {
      const exists = data.some(s => s.id === initialSelectedId);
      if (exists) onSelect(initialSelectedId);
    }
  }, [initialSelectedId, data, onSelect]);

  const handleApprove = async (id: number) => {
    await AcceptInvite(id);
    refetch();
    // Invalidate stats to update the counts instantly
    queryClient.invalidateQueries({ queryKey: ['upcoming-session-stats'] });
  };

  const handleDecline = async (id: number) => {
    await RejectInvite(id);
    refetch();
    // Invalidate stats to update the counts instantly
    queryClient.invalidateQueries({ queryKey: ['upcoming-session-stats'] });
  };

  if (isLoading || !data) {
    return <div className="space-y-4">Loading sessions…</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((session) => (
        <SessionCard
          key={session.id}
          id={session.id}
          name={session.name}
          title={session.topic}
          time={`${session.start_date} – ${session.end_date}`}
          image={session.profile_pic ?? undefined}
          status={session?.is_approved === 1 ? 1 : 2}
          approvalStatus={session.is_approved}
          isActive={session.id === selectedSessionId}
          meeting_link={session.meeting_link ?? undefined}
          onClick={() => onSelect(session.id)}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      ))}
    </div>
  );
}
