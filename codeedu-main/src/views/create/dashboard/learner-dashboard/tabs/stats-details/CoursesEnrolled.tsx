import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/breadcrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/ShadcnInput'
import { Search, Eye, Download, Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { fetchEnrolledCoursesList } from '@/services/learner/CourseService'
import { EnrolledCourse } from '@/@types/learner/Courses'

import dayjs from 'dayjs'

const breadcrumbItems = [
  { label: 'Overview', path: '/dashboard/learner' },
  { label: 'Courses' },
]

const CoursesEnrolled = () => {
  const [searchParams] = useSearchParams()
  const timeFilter = searchParams.get('timeFilter') || 'yearly'
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        const data = await fetchEnrolledCoursesList(timeFilter)
        setEnrolledCourses(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [timeFilter])

  const filteredCourses = enrolledCourses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Course"
            className="pl-9 bg-[#1f1f1f] border-[#2a2a2a] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-[#1c1c1c] border-[#2a2a2a] rounded-xl overflow-hidden">
        <Table className="table-fixed w-full">
          {/* Header */}
          <TableHeader className="bg-[#2a2a2a]">
            <TableRow>
              <TableHead className="w-[8%] text-center px-4">S.no.</TableHead>

              <TableHead className="w-[20%] text-left px-4">
                Course Name
              </TableHead>

              <TableHead className="w-[23%] text-center px-4 hidden md:table-cell">
                Delivery Mode
              </TableHead>

              <TableHead className="w-[18%] text-center px-4">
                Completion %
              </TableHead>

              <TableHead className="w-[22%] text-center px-4 hidden lg:table-cell">
                Assigned Date
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-codeblue" />
                    <span className="ml-2 text-gray-400">Loading courses...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow
                  key={course.id}
                  className="border-b border-[#2f2f2f]"
                >
                  <TableCell className="text-center px-4">{course.s_no}.</TableCell>

                  {/* Course Name */}
                  <TableCell className="font-medium leading-snug text-left px-4 truncate">
                    {course.course_name}
                  </TableCell>

                  {/* Mode */}
                  <TableCell className="hidden md:table-cell text-center px-4">
                    {course.delivery_mode}
                  </TableCell>

                  {/* Progress */}
                  <TableCell className="px-4">
                    <div className="max-w-[140px] mx-auto">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-codeblue">
                          {course.completion_percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-codeblue rounded-full"
                          style={{ width: `${course.completion_percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Assigned Date */}
                  <TableCell className="hidden lg:table-cell whitespace-nowrap text-gray-400 text-center px-4">
                    {dayjs(course.assigned_date).format('MMM DD, YYYY · hh:mm A')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}


export default CoursesEnrolled
