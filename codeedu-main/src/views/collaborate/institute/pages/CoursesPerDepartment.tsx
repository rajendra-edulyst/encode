import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useDepartmentCourseStats } from '@/hooks/data/collaborate/useJobs'



/* ---------------- Custom Legend (2 per row) ---------------- */

const CustomLegend = () => (
  <div className="grid grid-cols-2  gap-y-2 mb-4">
    <LegendItem color="#00A8E9" label="Self-Paced" />
    <LegendItem color="#E60086" label="Live Online" />
    <LegendItem color="#7FBC42" label="In Class" />
    <LegendItem color="#FFEC00" label="Others" />
  </div>
)


const LegendItem = ({
  color,
  label,
}: {
  color: string
  label: string
}) => (
  <div className="flex items-center text-sm text-gray-300">
    <span
      className="w-3 h-3 rounded-full mr-2"
      style={{ backgroundColor: color }}
    />
    {label}
  </div>
)

/* ---------------- Component ---------------- */

interface CoursesPerDepartmentProps {
  filter?: string
}

const CoursesPerDepartment: React.FC<CoursesPerDepartmentProps> = ({ filter = 'yearly' }) => {
  const { data: deptCourseStats = [] } = useDepartmentCourseStats(filter);

  const coursesData = deptCourseStats.map(dept => ({
    department: dept.department,
    selfPaced: dept.self_paced,
    liveOnline: dept.live_online,
    inClass: dept.in_class,
    certifications: dept.certifications,
  }));
  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <h3 className="text-lg font-semibold text-white mb-4 lg:mb-0">
          Courses Per Department
        </h3>

        {/* Legend */}
        <CustomLegend />
      </div>

      {/* Chart */}
      <div className="flex items-center justify-center min-h-[350px]">
        {coursesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={coursesData} barSize={12} barGap={0} margin={{ bottom: 40 }}>
              <CartesianGrid
                stroke="#2a2a2a"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="department"
                tick={{ fill: '#9ca3af', fontSize: 6 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={120}
              />

              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Bar
                dataKey="selfPaced"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="liveOnline"
                fill="#ec4899"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="inClass"
                fill="#a3e635"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="certifications"
                fill="#facc15"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-400 text-sm font-medium py-10">
            No courses data available for the selected period
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPerDepartment