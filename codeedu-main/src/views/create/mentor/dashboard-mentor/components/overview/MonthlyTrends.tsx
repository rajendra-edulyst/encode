import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useMentorsMonthlyStats } from "@/hooks/data/create/useMentor";

export default function MonthlyTrends() {
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
          Monthly Trends
        </CardTitle>

        <CardDescription>
          Last 6 months performance
        </CardDescription>

        <CardAction className="flex gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#34d399] rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3b82f6] rounded-full" />
            <span>Hours</span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              cursor={{ stroke: "#262626" }}
              contentStyle={{
                background: "#171717",
                border: "1px solid #262626",
                color: "#fff",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="hours"
              name="Hours"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
