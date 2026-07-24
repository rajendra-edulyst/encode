import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useMentorsMonthlyStats } from "@/hooks/data/create/useMentor";

export default function WeeklyActivity() {
  const { data, isLoading } = useMentorsMonthlyStats();

  if (isLoading || !data) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 h-[360px] flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading chart...</span>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader className="gap-0">
        <CardTitle className="text-white text-xl">
          Activity Overview
        </CardTitle>

        <CardDescription>
          Sessions and mentoring hours
        </CardDescription>

        <CardAction className="flex gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EC4899] rounded-full" />
            <span>Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#8B5CF6] rounded-full" />
            <span>Sessions</span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

            <XAxis
              dataKey="month"
              stroke="#a3a3a3"
              tickLine={false}
            />

            <YAxis
              stroke="#a3a3a3"
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                background: "#171717",
                border: "1px solid #262626",
                color: "#fff",
              }}
            />

            <Legend />

            <Bar
              dataKey="hours"
              name="Hours"
              fill="#EC4899"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="completed"
              name="Sessions"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
