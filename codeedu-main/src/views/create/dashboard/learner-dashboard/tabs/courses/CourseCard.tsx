import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCurrentCourse, useCourseModules } from "@/hooks/data/create/useCourses";

interface LearnerCourseCardProps {
  timeFilter?: string;
}

export default function LearnerCourseCard({ timeFilter = 'yearly' }: LearnerCourseCardProps) {
  const navigate = useNavigate();
  const { data: currentCourse, isLoading } = useCurrentCourse(timeFilter);
  const { data: courseModules } = useCourseModules(currentCourse?.course_id?.toString());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white text-xl">
            Current Course
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-[1fr_260px] px-5">
          <div className="h-[360px] flex items-center justify-center bg-gray-800 rounded-xl">
            <div className="text-gray-400">Loading...</div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="bg-zinc-800 rounded-lg p-4 h-20 animate-pulse" />
            <div className="bg-zinc-800 rounded-lg p-4 h-20 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCourse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white text-xl">
            Current Course
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-[1fr_260px] px-5">
          <div className="h-[360px] flex items-center justify-center bg-gray-800 rounded-xl">
            <div className="text-gray-400">No active course for selected period</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white text-xl">
          Current Course
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-[1fr_260px] px-5">
        <div className="relative h-[360px] overflow-hidden rounded-xl">
          <img
            src={currentCourse?.image}
            alt={currentCourse.course_name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute right-6 bottom-5 z-10">
            <Button
              className='
              bg-codeblue p-8 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer'
              onClick={() => {
                const firstModuleId = courseModules?.[0]?.id;
                if (firstModuleId) {
                  navigate(`/courses/${currentCourse.course_id}/modules/${firstModuleId}`, { state: { courseSource: 'my-courses' } });
                } else {
                  navigate(`/courses/${currentCourse.course_id}`, { state: { courseSource: 'my-courses' } });
                }
              }}
            >
              <ArrowRight className="h-5 w-5" />
              Continue <br />Course
            </Button>
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <div className="px-6 pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h3 className="text-xl font-semibold text-white">
                {currentCourse.course_name}
              </h3>
              <p className="text-sm text-zinc-300 mt-1">
                {currentCourse.progress_percentage}% Completed
              </p>
            </div>
            <Progress value={currentCourse.progress_percentage} className="h-2 w-full rounded-none" />
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <StatBox label="Modules Completed" value={currentCourse.modules_completed} />
          <StatBox label="Assessment Completed" value={currentCourse.assessment_completed} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-white mt-1">
        {value}
      </p>
    </div>
  );
}