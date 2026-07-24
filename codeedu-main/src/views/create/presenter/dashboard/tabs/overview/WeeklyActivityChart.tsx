
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { useInstructorActivityStats } from "@/hooks/data/create/useInstructor"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const WeeklyActivityChart = () => {
  const { data: weeklyActivity } = useInstructorActivityStats()
  const apiData = weeklyActivity?.monthly_enrollment_trends ?? []
  const maxCompletion = Math.max(...apiData.map((item) => Number(item?.completion) || 0), 0)
  const maxEnrollments = Math.max(...apiData.map((item) => Number(item?.enrollments) || 0), 0)
  const useFallback = !apiData.length || (maxCompletion <= 1 && maxEnrollments <= 1)
  const chartData = apiData

  return (
    <Card className="bg-[#121212] border-none shadow-none rounded-2xl h-[360px] flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-white text-lg font-semibold">
            Weekly Activity
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            New enrollments vs completions
          </CardDescription>
        </div>

        {/* Custom Legend */}
        <div className="flex gap-4 text-xs font-medium text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
            Completion
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
            Enrollments
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={6}
            barCategoryGap="14%"
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              stroke="#52525b"
              tickLine={false}
              axisLine={{ stroke: '#404040' }}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              stroke="#52525b"
              tickLine={false}
              axisLine={{ stroke: '#404040' }}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#1c1c1c",
                border: "1px solid #262626",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Bar
              dataKey="completion"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="enrollments"
              fill="#10b981"
              radius={[3, 3, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default WeeklyActivityChart
