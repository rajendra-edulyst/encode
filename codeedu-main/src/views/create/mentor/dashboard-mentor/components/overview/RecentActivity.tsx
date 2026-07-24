import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Star } from "lucide-react";
import { useRecentActivity } from "@/hooks/data/create/useMentor";


const activityIconMap = {
  completed_session: {
    icon: CheckCircle,
    color: "bg-green-500/20 text-green-400",
  },
  session_request: {
    icon: Clock,
    color: "bg-blue-500/20 text-blue-400",
  },
  review: {
    icon: Star,
    color: "bg-yellow-500/20 text-yellow-400",
  },
} as const;

export default function RecentActivity({ timeFilter }: { timeFilter?: string }) {
  const { data, isLoading } = useRecentActivity(timeFilter);

  if (isLoading || !data) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 h-full flex items-center justify-center">
        <span className="text-sm text-neutral-400">Loading activity...</span>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800 h-full">
      <CardHeader>
        <CardTitle className="text-white text-lg">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-neutral-400">
          Latest updates and interactions
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.map((item, i) => {
          const config = activityIconMap[item.type as keyof typeof activityIconMap] || {
            icon: Clock,
            color: "bg-gray-500/20 text-gray-400",
          };
          const Icon = config.icon;

          return (
            <div
              key={i}
              className="flex justify-between bg-[#323232] items-end rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${config.color}`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-white font-medium">
                    {item.name}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {item.action}
                  </p>
                </div>
              </div>

              <span className="text-xs text-neutral-500">
                {item.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
