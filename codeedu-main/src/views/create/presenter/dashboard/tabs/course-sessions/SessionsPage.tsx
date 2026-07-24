import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SessionCard } from "./SessionCard";
import { SessionDetails } from "./SessionDetails";
import CourseTabs from "./CourseTabs";
import { fetchSessions } from "@/services/faculty/SessionsService";
import { Session } from "@/@types/faculty/session";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionsPage() {
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');
  
  const [activeTab, setActiveTab] = useState("all");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(sessionIdParam ? Number(sessionIdParam) : null);

  const getSessionTime = (startDate: string) => {
    const parsedTime = Date.parse(startDate.replace(" ", "T"));
    return Number.isNaN(parsedTime) ? 0 : parsedTime;
  };

  useEffect(() => {
    const getSessions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSessions();
        setSessions(data);
        
        // Use the param ID if it exists, otherwise default to first session
        if (data.length > 0) {
          const newestSession = [...data].sort(
            (a, b) => getSessionTime(b.start_date) - getSessionTime(a.start_date)
          )[0];
          const idToSelect = sessionIdParam ? Number(sessionIdParam) : newestSession.id;
          setSelectedId(idToSelect);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getSessions();
  }, [sessionIdParam]);

  const filteredSessions = useMemo(() => {
    const sortedSessions = [...sessions].sort(
      (a, b) => getSessionTime(b.start_date) - getSessionTime(a.start_date)
    );
    if (activeTab === "all") return sortedSessions;
    return sortedSessions.filter(s => s.status.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, sessions]);

  const selectedSession = useMemo(() => {
    return sessions.find(s => s.id === selectedId);
  }, [selectedId, sessions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Skeleton className="h-8 w-48 bg-white/5" />
          <Skeleton className="h-10 w-96 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="lg:col-span-7">
            <Skeleton className="h-[600px] w-full bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight">All Sessions</h2>
        <CourseTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredSessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              selected={selectedId === s.id}
              onClick={() => setSelectedId(s.id)}
            />
          ))}
          {filteredSessions.length === 0 && (
            <div className="py-20 text-center text-neutral-500 font-medium bg-[#1c1c1c] rounded-2xl border border-white/5">
              No {activeTab.toLowerCase()} sessions found.
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="lg:col-span-7 sticky top-0">
          {selectedSession ? (
            <SessionDetails session={selectedSession} />
          ) : (
            <div className="h-[600px] flex items-center justify-center rounded-2xl border border-white/5 bg-[#1c1c1c] text-neutral-500">
              Select a session to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
