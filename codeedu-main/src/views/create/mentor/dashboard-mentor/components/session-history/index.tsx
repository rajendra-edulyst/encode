import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SessionHistoryList from "./SessionHistoryList";
import SessionHistoryDetails from "./ SessionHistoryDetails";
import SessionStats from "./SessionStats";

// Named export: used by parent dashboard that passes timeFilter as a prop
export function SessionHistoryIndex({ timeFilter }: { timeFilter: string }) {
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
                    <SessionHistoryList
                        selectedSessionId={selectedSessionId}
                        initialSelectedId={eventId ? parseInt(eventId) : null}
                        onSelect={setSelectedSessionId}
                        timeFilter={timeFilter}
                    />
                </div>

                <SessionHistoryDetails sessionId={selectedSessionId} />
            </div>
        </div>
    );
}

// Default export: standalone route component that manages its own timeFilter state
export default function SessionHistoryPage() {
    return <SessionHistoryIndex timeFilter="month" />;
}
