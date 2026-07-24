
import { useEffect } from "react";
import HistorySessionCard from "./HistorySessionCard";
import { useMentorSessionHistory } from "@/hooks/data/create/useMentor";

interface Props {
  selectedSessionId: number | null;
  onSelect: (id: number) => void;
  timeFilter?: string;
  initialSelectedId?: number | null;
}

export default function SessionHistoryList({
  selectedSessionId,
  onSelect,
  timeFilter,
  initialSelectedId,
}: Props) {
  const { data, isLoading } = useMentorSessionHistory(timeFilter);

  useEffect(() => {
    if (initialSelectedId && data) {
      const exists = data.some((s) => s.id === initialSelectedId);
      if (exists) onSelect(initialSelectedId);
    }
  }, [initialSelectedId, data, onSelect]);

  if (isLoading || !data) {
    return <div className="space-y-4">Loading history…</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((session, index) => (
        <HistorySessionCard
          key={`${session.id}-${index}`}
          session={session}
          isActive={session.id === selectedSessionId}
          onClick={() => onSelect(session.id)}
        />
      ))}
    </div>
  );
}
