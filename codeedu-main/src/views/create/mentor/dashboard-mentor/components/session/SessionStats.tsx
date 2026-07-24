import { Card, CardContent } from "@/components/ui/card";
import { useUpcomingSessionStats } from "@/hooks/data/create/useMentor";

export default function SessionStats({ timeFilter }: { timeFilter?: string }) {
  const { data, isLoading } = useUpcomingSessionStats(timeFilter);

  if (isLoading || !data) {
    return <div className="h-[72px]" />;
  }

  const stats = [
    { label: "Total Upcoming", value: data.total_upcoming },
    { label: "Today", value: data.today },
    { label: "Approved", value: data.approved },
    { label: "Declined", value: data.declined },
    { label: "Pending Approval", value: data.pending_approval },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 auto-rows-min">
      {stats.map((item) => (
        <Card key={item.label} className="gap-0">
          <CardContent className="p-4">
            <p className="text-sm text-white">{item.label}</p>
            <p className="text-[32px] font-semibold text-white">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
