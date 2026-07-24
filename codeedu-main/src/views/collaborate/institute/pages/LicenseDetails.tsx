import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDepartmentStudentActivity, useDepartmentCourseProgress, useInstituteDepartmentOverview } from '@/hooks/data/collaborate/useJobs'
import LoadingSection from "@/components/LoadingSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface LicenseDetailsProps {
  department_id: number;
}

const LicenseDetails = ({ department_id }: LicenseDetailsProps) => {
  const deptId = department_id || 1;

  const [activeTab, setActiveTab] = useState("course_detail")
  const [selectedCourseType, setSelectedCourseType] = useState<string>("all")
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null)

  const { data: studentActivity = [], isLoading: isActivityLoading } = useDepartmentStudentActivity(deptId);
  const { data: courseProgress = [], isLoading: isProgressLoading } = useDepartmentCourseProgress(deptId);
  const { data: overview, isLoading: isOverviewLoading } = useInstituteDepartmentOverview(deptId);

  // Get unique course types from data
  const courseTypes = useMemo(() => {
    const types = new Set(courseProgress.map(p => p.course_type));
    return Array.from(types).filter(Boolean).sort();
  }, [courseProgress]);

  // Filter course progress based on selected course type
  const filteredProgress = courseProgress.filter(p =>
    selectedCourseType === "all" || p.course_type === selectedCourseType
  );

  const isLoading = isOverviewLoading || isActivityLoading || isProgressLoading;

  if (isLoading) return <LoadingSection isLoading={isLoading} />;

  return (
    <div className="min-h-screen bg-black">
      <Card>
        <CardContent>
          {/* Header Card */}
          <Card className="bg-[#323232] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Department Icon */}
                  <div className="bg-gray-700 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none">
                      <rect width="128" height="128" rx="6" fill="#5A5A5A" />
                      <mask id="mask0_4961_2444" maskUnits="userSpaceOnUse" x="14" y="14" width="100" height="100">
                        <rect x="14" y="14" width="100" height="100" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_4961_2444)">
                        <path d="M41.5 102C39.4375 102 37.6719 101.266 36.2031 99.7969C34.7344 98.3281 34 96.5625 34 94.5V34.5C34 32.4375 34.7344 30.6719 36.2031 29.2031C37.6719 27.7344 39.4375 27 41.5 27H86.5C88.5625 27 90.3281 27.7344 91.7969 29.2031C93.2656 30.6719 94 32.4375 94 34.5V94.5C94 96.5625 93.2656 98.3281 91.7969 99.7969C90.3281 101.266 88.5625 102 86.5 102H41.5ZM41.5 94.5H86.5V34.5H79V60.75L69.625 55.125L60.25 60.75V34.5H41.5V94.5Z" fill="white" />
                      </g>
                    </svg>
                  </div>
                  {/* Department Info */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {overview?.department_name || 'Dept. UX Design'}
                    </h1>
                    <p className="text-gray-400 text-sm">HOD- {overview?.hod_name || 'Rahul Jain'}</p>

                    {/* Stats Badges */}
                    <div className="flex gap-3 mt-4">
                      <Badge
                        variant="outline"
                        className="bg-[#2b2b2b] border-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Courses Assigned- <span className="font-bold ml-1">{overview?.number_of_courses || 25}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-[#2b2b2b] border-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Students Enrolled- <span className="font-bold ml-1">{overview?.number_of_user || 12}</span>
                      </Badge>

                    </div>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>

          {/* tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <div className="flex items-center justify-between my-6">
              <TabsList className="bg-[#2b2b2b] p-1 rounded-lg">
                <TabsTrigger
                  value="course_detail"
                  className="
                    px-6 py-3
                    rounded-md
                    text-gray-400
                    data-[state=active]:bg-[#8BC34A]
                    data-[state=active]:text-[#000000]
                    data-[state=active]:shadow-none
                    focus-visible:ring-0
                  "
                >
                  Course Detail
                </TabsTrigger>

                <TabsTrigger
                  value="student_detail"
                  className="
                    px-6 py-3
                    rounded-md
                    text-gray-400
                    data-[state=active]:bg-[#8BC34A]
                    data-[state=active]:text-[#000000]
                    data-[state=active]:shadow-none
                    focus-visible:ring-0
                  "
                >
                  Student Detail
                </TabsTrigger>
              </TabsList>

              {activeTab === "course_detail" && (
                <Select
                  value={selectedCourseType}
                  onValueChange={setSelectedCourseType}
                >
                  <SelectTrigger className="w-[180px] bg-[#2b2b2b] border-none text-white rounded-lg">
                    <SelectValue placeholder="Course Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2b2b2b] border-gray-700 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    {courseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <TabsContent value="course_detail">
              {/* Students Table Card */}
              <Card className="bg-[#323232]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Course Detail & Progress
                  </h2>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left text-white font-bold text-sm pb-4 pr-4 w-[25%]">
                            Course
                          </th>
                          <th className="text-left text-white font-bold text-sm pb-4 pr-4 w-[15%]">
                            Courses Type
                          </th>
                          <th className="text-center text-white font-bold text-sm pb-4 pr-4 w-[10%]">
                            Students
                          </th>
                          <th className="text-left text-white font-bold text-sm pb-4 pr-4 w-[20%]">
                            Avg. Progress
                          </th>
                          <th className="text-center text-white font-bold text-sm pb-4 pr-4 w-[15%]">
                            Grade & Certificate
                          </th>
                          <th className="text-left text-white font-bold text-sm pb-4 w-[15%]">
                            End Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProgress.map((item, index) => (
                          <tr
                            key={index}
                            className={`${index !== filteredProgress.length - 1
                              ? 'border-b border-gray-800'
                              : ''
                              }`}
                          >
                            <td className="py-6 pr-4">
                              <span className="text-white font-medium text-sm">
                                {item?.course_name}
                              </span>
                            </td>

                            <td className="py-6 pr-4">
                              <span className="text-gray-400 text-sm">
                                {item?.course_type}
                              </span>
                            </td>

                            <td className="py-6 pr-4 text-center">
                              <span className="text-white text-sm">
                                {item?.students}
                              </span>
                            </td>

                            <td className="py-6 pr-4">
                              <div className="space-y-2 min-w-[150px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400 text-xs">
                                    Avg Progress
                                  </span>
                                  <span className="text-[#8BC34A] text-xs font-bold">
                                    {item.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={item.progress}
                                  className="h-2 bg-[#2b2b2b]"
                                  indicatorClassName="bg-[#8BC34A]"
                                />
                              </div>
                            </td>

                            <td className="py-6 pr-4 text-center">
                              <span className="text-white text-sm">
                                {item.grade_certificate}
                              </span>
                            </td>

                            <td className="py-6">
                              <span className="text-white text-sm">
                                {item.end_date}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="student_detail">
              {/* Students Table Card */}
              <Card className="bg-[#323232]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Students Details & Progress
                  </h2>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left text-gray-400 font-semibold text-sm pb-4 pr-4 w-[20%]">
                            Student
                          </th>
                          <th className="text-center text-gray-400 font-semibold text-sm pb-4 pr-4 w-[35%]">
                            Current Course
                          </th>
                          <th className="text-center text-gray-400 font-semibold text-sm pb-4 pr-4 w-[15%]">
                            Learning Hours
                          </th>
                          <th className="text-left text-gray-400 font-semibold text-sm pb-4 pr-4 w-[20%]">
                            Progress
                          </th>
                          <th className="text-center text-gray-400 font-semibold text-sm pb-4 w-[10%]">
                            Last Active
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentActivity.map((student, index) => {
                          const displayedCourse = selectedProgramId
                            ? student.current_courses?.find(c => c.course_id === selectedProgramId)
                            : student.current_courses?.[0];

                          return (
                            <tr
                              key={index}
                              className={`${index !== studentActivity.length - 1
                                ? 'border-b border-gray-800'
                                : ''
                                }`}
                            >
                              {/* Student Info */}
                              <td className="py-4 pr-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={student.profile_image || ''} />
                                    <AvatarFallback className="bg-gray-700 text-white">
                                      {student.student_name
                                        ?.split(' ')
                                        ?.map(n => n[0])
                                        ?.join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-white font-medium text-sm">
                                      {student.student_name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {student.student_email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Current Course */}
                              <td className="py-4 pr-4 text-center">
                                {student.current_courses && student.current_courses.length > 0 ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center justify-center gap-1 text-white text-sm hover:text-green-500 transition-colors focus:outline-none w-full">
                                      <span className="text-left line-clamp-1">
                                        {displayedCourse?.course_name || student.current_courses[0].course_name}
                                      </span>
                                      {student.current_courses.length > 1 && (
                                        <ChevronDown className="w-4 h-4 shrink-0" />
                                      )}
                                    </DropdownMenuTrigger>
                                    {student.current_courses.length > 1 && (
                                      <DropdownMenuContent className="bg-[#2b2b2b] border-gray-700 text-white max-w-[300px]">
                                        {student.current_courses.map((course, i) => (
                                          <DropdownMenuItem
                                            key={i}
                                            className="focus:bg-[#3a3a3a] cursor-pointer"
                                            onClick={() => setSelectedProgramId(course.course_id)}
                                          >
                                            {course.course_name}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    )}
                                  </DropdownMenu>
                                ) : (
                                  <span className="text-gray-500 text-sm">-</span>
                                )}
                              </td>

                              {/* Learning Hours */}
                              <td className="py-4 pr-4 text-center">
                                <span className="text-white text-sm">
                                  {displayedCourse?.learning_hours || '-'}
                                </span>
                              </td>

                              {/* Completion Rate */}
                              <td className="py-4 pr-4">
                                <div className="space-y-2 min-w-[180px]">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs">
                                      Progress
                                    </span>
                                    <span className="text-green-500 text-xs font-bold">
                                      {displayedCourse?.completion_rate || 0}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={displayedCourse?.completion_rate || 0}
                                    className="h-2 bg-gray-700"
                                  />
                                </div>
                              </td>

                              {/* Last Active */}
                              <td className="py-4 text-center">
                                <div className="text-center">
                                  <p className="text-white font-bold text-lg">
                                    {displayedCourse?.last_active?.split(' ')[0] || '-'}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {displayedCourse?.last_active?.split(' ').slice(1).join(' ') || ''}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default LicenseDetails

