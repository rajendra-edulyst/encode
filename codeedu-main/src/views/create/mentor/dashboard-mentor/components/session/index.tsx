import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SessionDetails from "./SessionDetails";
import SessionList from "./SessionList";
import SessionStats from "./SessionStats";

export function SessionIndex({ timeFilter }: { timeFilter: string }) {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    if (eventId) {
      const id = parseInt(eventId);
      if (!isNaN(id)) {
        setSelectedSessionId(id);
      }
    }
  }, [eventId]);

  return (
    <div className="space-y-6">
      <SessionStats timeFilter={timeFilter} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SessionList
            selectedSessionId={selectedSessionId}
            initialSelectedId={eventId ? parseInt(eventId) : null}
            onSelect={setSelectedSessionId}
            timeFilter={timeFilter}
          />
        </div>
        <SessionDetails sessionId={selectedSessionId} />
      </div>
    </div>
  );
}
export default function SessionPage() {
  return <SessionIndex timeFilter="yearly" />;
}