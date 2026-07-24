import { useInstructorOverview } from "@/hooks/data/instructor/useInstructor"
import CourseStatCard from "../course-sessions/CourseStatCard"

export default function CourseStats({ timeFilter = 'yearly' }: { timeFilter?: string }) {
  const { data: stats } = useInstructorOverview(timeFilter)

  const dashboardStats = [
    {
      title: "Total Courses",
      value: stats?.total_courses?.value ?? 0,
    },
    {
      title: "Active Courses",
      value: stats?.active_courses?.value ?? 0,
    },
    {
      title: "Completed Courses",
      value: stats?.completed_courses?.value ?? 0,
    },
    {
      title: "Active Learners",
      value: stats?.active_learners?.value ?? 0,
    },
    {
      title: "Avg Watch Time",
      value: stats?.avg_watch_time?.value ?? "0 m",
    },
    {
      title: "Avg Assignment Score",
      value: stats?.avg_assignment_score?.value ?? "0%",
    },
    {
      title: "Avg Rating",
      value: stats?.avg_rating?.value ?? 0,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dashboardStats.slice(0, 5).map((stat, index) => (
          <CourseStatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dashboardStats.slice(5).map((stat, index) => (
          <CourseStatCard key={index + 5} {...stat} />
        ))}
        <div className="hidden lg:block lg:col-span-3"></div>
      </div>
    </div>
  )
}

