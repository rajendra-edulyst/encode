import { Card, CardContent } from "@/components/ui/card";
import { useMentorSessionHistoryStat } from "@/hooks/data/create/useMentor";


export default function SessionStats({ timeFilter }: { timeFilter?: string }) {
  const { data, isLoading } = useMentorSessionHistoryStat(timeFilter);

  if (isLoading || !data) {
    return <div className="h-[96px]" />;
  }

  const stats = [
    {
      label: "Total Sessions",
      value: data.total_sessions,
    },
    {
      label: "Completed",
      value: data.completed,
    },
    {
      label: "Total Hours",
      value: data.total_hours,
    },
    {
      label: "Avg Rating",
      value: data.avg_rating,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <p className="text-sm text-white">{s.label}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[32px] font-bold text-white">
                {s.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
