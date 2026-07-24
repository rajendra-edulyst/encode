import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useInstructorActivityStats } from "@/hooks/data/create/useInstructor"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const MonthlyEnrollmentChart = () => {
  const { data: enrollmentTrends } = useInstructorActivityStats()
  const apiData = enrollmentTrends?.monthly_enrollment_trends ?? []
  const chartData = apiData

  return (
    <Card className="bg-[#121212] border-none shadow-none rounded-2xl h-[360px] flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-white text-lg font-semibold">
          Monthly Enrollment Trends
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          Last 6 months performance
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-6 pt-3 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            stroke="#52525b"
            tickLine={false}
            axisLine={{ stroke: "#404040" }}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
          />

          <YAxis
            stroke="#52525b"
            tickLine={false}
            axisLine={{ stroke: "#404040" }}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#2a2a2a",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="courses_assigned"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#enrollGradient)"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default MonthlyEnrollmentChart
