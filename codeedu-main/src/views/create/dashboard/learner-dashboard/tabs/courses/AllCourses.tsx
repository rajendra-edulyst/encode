import { useMyCourses } from "@/hooks/data/create/useCourses";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AllCoursesProps {
  timeFilter?: string;
}

export default function AllCourses({ timeFilter = 'yearly' }: AllCoursesProps) {
  const { data: coursesData, isLoading } = useMyCourses(timeFilter);
  const navigate = useNavigate();

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  const filteredCourses = {
    ongoing: coursesData?.filter(course => course.completion > 0 && course.completion < 100) || [],
    completed: coursesData?.filter(course => course.completion === 100) || [],
  };

  const handleCourseNavigation = (course: any) => {
    const courseId = course?.id;
    if (!courseId) return;
    navigate(`/courses/${courseId}`, { state: { courseSource: 'my-courses' } });
  };

  const renderCourseCard = (course: any, key: string) => (
    <Card
      key={key}
      className="group gap-0 bg-[#2f2f2f] border border-[#3a3a3a] rounded-xl shadow-none cursor-pointer transition-colors hover:border-primary/60"
      role="button"
      tabIndex={0}
      onClick={() => handleCourseNavigation(course)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCourseNavigation(course);
        }
      }}
    >
      <CardContent className="flex gap-3 p-3">
        <div className="w-full sm:w-[210px] h-[86px] rounded-md overflow-hidden shrink-0 bg-[#242424]">
          <img
            src={course?.image}
            alt={course?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between w-full min-w-0">
          <h3 className="text-[26px] font-semibold text-white leading-tight line-clamp-2 decoration-2 underline-offset-4 group-hover:underline">
            {course?.name}
          </h3>
          <div className="flex items-center gap-1 text-[#d6d6d6] text-[13px]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course?.module_completion_count}/{course?.total_module_count}</span>
          </div>
          <div className="flex items-center justify-between text-[12px] text-[#d0d0d0]">
            <span>Progress</span>
            <span>{course?.completion}%</span>
          </div>
          <Progress
            value={course?.completion}
            className="h-2 bg-[#595959] rounded-full"
            indicatorClassName="bg-[#0da7df] rounded-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderGrid = (courses: any[], emptyMessage?: string) => (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
      {courses.map((course, index) => renderCourseCard(course, `${course?.name ?? 'course'}-${index}`))}
      {courses.length === 0 && emptyMessage ? (
        <p className="text-gray-400 col-span-full">{emptyMessage}</p>
      ) : null}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-white text-[30px] leading-none">
            All Courses
          </CardTitle>
          <CardAction>
            <TabsList className='bg-[#575757] rounded-lg overflow-hidden p-0 h-auto'>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="all">All</TabsTrigger>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="completed">Completed</TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="gap-0 bg-[#2f2f2f] border border-[#3a3a3a] rounded-xl shadow-none">
                <CardContent className="flex gap-3 p-3">
                  <div className="w-full sm:w-[210px] h-[86px] rounded-md bg-zinc-700 animate-pulse" />
                  <div className="flex flex-col justify-between w-full gap-2">
                    <div className="h-5 bg-zinc-700 rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-zinc-700 rounded animate-pulse w-1/3" />
                    <div className="h-2 bg-zinc-700 rounded animate-pulse w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="all">
      <Card className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-white text-[30px] leading-none">
            All Courses
          </CardTitle>
          <CardAction>
            <TabsList className='bg-[#575757] rounded-lg overflow-hidden p-0 h-auto'>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="all">All</TabsTrigger>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger className='rounded-none text-white py-2 px-6 data-[state=active]:bg-primary text-sm' value="completed">Completed</TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <TabsContent value="all" className="pt-2 mt-0">
            {renderGrid(coursesData || [])}
          </TabsContent>
          <TabsContent value="ongoing" className="pt-2 mt-0">
            {renderGrid(
              filteredCourses.ongoing,
              `No ongoing courses found for ${getTimeFilterLabel()}.`
            )}
          </TabsContent>
          <TabsContent value="completed" className="pt-2 mt-0">
            {renderGrid(
              filteredCourses.completed,
              `No completed courses found for ${getTimeFilterLabel()}.`
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}