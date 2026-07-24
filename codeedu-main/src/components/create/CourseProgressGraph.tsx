import { useCoursesProgress } from '@/hooks/data/create/useCourses';
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '@/lib/utils';

interface CourseProgressGraphProps {
  className?: string;
  timeFilter?: string;
}

const CourseProgressGraph = ({ className, timeFilter = 'yearly' }: CourseProgressGraphProps) => {
  const { data: coursesProgress, isLoading } = useCoursesProgress(timeFilter);

  const chartData = React.useMemo(() => {
    if (!coursesProgress) return [];

    return [
      {
        name: 'Assigned',
        self_paced: coursesProgress.assigned.self_paced,
        live_online: coursesProgress.assigned.live_online,
        in_class: coursesProgress.assigned.in_class,
      },
      {
        name: 'Pending',
        self_paced: coursesProgress.pending.self_paced,
        live_online: coursesProgress.pending.live_online,
        in_class: coursesProgress.pending.in_class,
      },
      {
        name: 'Completed',
        self_paced: coursesProgress.completed.self_paced,
        live_online: coursesProgress.completed.live_online,
        in_class: coursesProgress.completed.in_class,
      },
      {
        name: 'In Progress',
        self_paced: coursesProgress.in_progress.self_paced,
        live_online: coursesProgress.in_progress.live_online,
        in_class: coursesProgress.in_progress.in_class,
      },
    ];
  }, [coursesProgress]);

  return (
    <Card className={cn('bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800', className)}>
      <CardHeader>
        <CardTitle className="text-black dark:text-white text-xl">
          Courses Progress
        </CardTitle>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white font-['Jacques_Pro']">
          <LegendItem color="bg-[#00a8e9]" label="Self-Paced" />
          <LegendItem color="bg-[#e60086]" label="Live Online" />
          <LegendItem color="bg-[#7fbc42]" label="In Class" />
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <div className="h-[320px] flex items-end justify-between px-4">
            <Skeleton className="w-[8%] h-[40%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[20%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[60%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[30%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[10%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[45%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[35%] bg-gray-700/50 rounded-t-lg" />
            <Skeleton className="w-[8%] h-[15%] bg-gray-700/50 rounded-t-lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                stroke="#4B5563"
                tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'system-ui' }}
                tickLine={false}
                axisLine={{ stroke: '#4B5563' }}
              />

              <YAxis
                stroke="#4B5563"
                axisLine={{ stroke: '#4B5563' }}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'system-ui' }}
              />

              <Tooltip
                cursor={{ fill: 'rgba(31, 41, 55, 0.6)' }}
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#f9fafb',
                }}
                labelStyle={{
                  color: '#f9fafb',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
                itemStyle={{
                  fontSize: 13,
                }}
              />

              <Bar
                dataKey="self_paced"
                fill="#00a8e9"
                radius={[8, 8, 0, 0]}
                barSize={12}
                minPointSize={4}
              />
              <Bar
                dataKey="live_online"
                fill="#e60086"
                radius={[8, 8, 0, 0]}
                barSize={12}
                minPointSize={4}
              />
              <Bar
                dataKey="in_class"
                fill="#7fbc42"
                radius={[8, 8, 0, 0]}
                barSize={12}
                minPointSize={4}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const LegendItem = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded ${color}`} />
    <span className='text-gray-500 dark:text-gray-300 pt-1'>{label}</span>
  </div>
);

export default CourseProgressGraph;