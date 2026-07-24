import { Card, CardContent } from "@/components/ui/card";
import { useMyCourses } from "@/hooks/data/create/useCourses";

interface CourseStatsProps {
  timeFilter?: string;
}

export default function CourseStats({ timeFilter = 'yearly' }: CourseStatsProps) {
  const { data: myCourses = [] } = useMyCourses(timeFilter);

  const completedCourses = myCourses.filter((course) => course.completion === 100);
  const inProgressCourses = myCourses.filter((course) => course.completion > 0 && course.completion < 100);
  const pendingCourses = myCourses.filter((course) => course.completion === 0);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="gap-0">
        <CardContent>
          <p className="text-sm dark:text-white">
            Courses Assigned
          </p>
          <div className="flex items-end justify-between mt-3">
            <h2 className="text-2xl font-semibold dark:text-white">
              {myCourses.length}
            </h2>
          </div>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardContent>
          <p className="text-sm dark:text-white">
            Courses Completed
          </p>
          <div className="flex items-end justify-between mt-3">
            <h2 className="text-2xl font-semibold dark:text-white">
              {completedCourses.length}
            </h2>
          </div>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardContent>
          <p className="text-sm dark:text-white">
            Courses In Progress
          </p>
          <div className="flex items-end justify-between mt-3">
            <h2 className="text-2xl font-semibold dark:text-white">
              {inProgressCourses.length}
            </h2>
          </div>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardContent>
          <p className="text-sm dark:text-white">
            Courses Pending
          </p>
          <div className="flex items-end justify-between mt-3">
            <h2 className="text-2xl font-semibold dark:text-white">
              {pendingCourses.length}
            </h2>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}