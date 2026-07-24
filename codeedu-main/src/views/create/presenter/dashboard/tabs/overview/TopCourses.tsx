import CourseProgressRow from "../course-sessions/CourseProgressRow"
import { useInstructorTopCourses } from "@/hooks/data/create/useInstructor"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const TopCourses = () => {
  const { data: topCourses } = useInstructorTopCourses()

  return (
    <Card className="bg-[#121212] border-none shadow-none rounded-2xl mt-6">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-white text-lg font-semibold">
          Top Performing Courses
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm font-normal">
          Highest completion rates
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {topCourses?.map((course, index) => (
            <CourseProgressRow
              title={course?.name}
              completion={course?.completion_rate}
              key={index}
              learners={course?.learners ?? 0}
              rating={course?.rating ?? 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopCourses
