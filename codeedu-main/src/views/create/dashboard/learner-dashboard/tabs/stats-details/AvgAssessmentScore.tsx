import React, { useState } from 'react'
import Breadcrumb from '@/components/breadcrumb'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/ShadcnInput'
import { Search, Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useUserAssessmentList } from '@/hooks/data/create/useCourses'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const breadcrumbItems = [
  { label: 'Overview', path: '/dashboard/learner' },
  { label: 'Assessment Details' },
]

const AvgAssessmentScore = () => {
  const [searchParams] = useSearchParams()
  const timeFilter = searchParams.get('timeFilter') || 'yearly'
  const { data: assessments, isLoading } = useUserAssessmentList(timeFilter)
  const [searchQuery, setSearchQuery] = useState('')

  // Mapping the data to match the expected structure if necessary
  // Given fetchUserAssessmentList returns EnrolledCourse[] according to its type,
  // but a list of assessments for this table, we use any for flexibility if types mismatch.
  const filteredAssessments = (assessments as any[] || []).filter((item) =>
    item?.program_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.module_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb items={breadcrumbItems} />

        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Assessment"
            className="pl-9 bg-[#1f1f1f] border-[#2a2a2a] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-[#1c1c1c] border-[#2a2a2a] rounded-xl overflow-hidden">
        <Table>
          {/* Header */}
          <TableHeader className="bg-[#2a2a2a]">
            <TableRow>
              <TableHead className="w-[60px]">S.no</TableHead>

              <TableHead className="min-w-[220px]">
                Program Name
              </TableHead>

              <TableHead className="min-w-[220px] hidden md:table-cell">
                Module Name
              </TableHead>

              <TableHead className="min-w-[180px] hidden md:table-cell">
                Skill Name
              </TableHead>

              <TableHead className="min-w-[200px] hidden lg:table-cell">
                Assessment
              </TableHead>

              <TableHead className="w-[120px] hidden lg:table-cell text-center">
                Max Marks
              </TableHead>

              <TableHead className="w-[120px] hidden lg:table-cell text-center">
                Passing Marks
              </TableHead>

              <TableHead className="w-[80px] text-center">
                Score
              </TableHead>

              <TableHead className="w-[120px] hidden md:table-cell text-center">
                Attempts
              </TableHead>

              <TableHead className="w-[140px] whitespace-nowrap">
                Attempted On
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-codeblue" />
                    <span className="ml-2 text-gray-400">Loading assessments...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAssessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-gray-400">
                  No assessments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssessments.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-[#2f2f2f]"
                >
                  {/* S.no */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Program */}
                  <TableCell className="leading-snug">
                    {item.program_name || item.course_name}
                  </TableCell>

                  {/* Module */}
                  <TableCell className="hidden md:table-cell leading-snug">
                    {item.module_name || '-'}
                  </TableCell>

                  {/* Skill */}
                  <TableCell className="hidden md:table-cell">
                    {item.skill_name || 'Assessment'}
                  </TableCell>

                  {/* Assessment */}
                  <TableCell className="hidden lg:table-cell">
                    {item.title || item.assessment_name || '-'}
                  </TableCell>

                  {/* Max */}
                  <TableCell className="hidden lg:table-cell text-center">
                    {item.maximum_marks ?? item.max_marks ?? '-'}
                  </TableCell>

                  {/* Pass */}
                  <TableCell className="hidden lg:table-cell text-center">
                    {item.passing_marks ?? item.pass_marks ?? '-'}
                  </TableCell>

                  {/* Score */}
                  <TableCell className="font-medium text-center">
                    {item.score ?? '-'}
                  </TableCell>

                  {/* Attempts */}
                  <TableCell className="hidden md:table-cell text-center">
                    {item.attempt_count ?? item.attempts ?? 0}
                  </TableCell>

                  {/* Attempted On */}
                  <TableCell className="text-gray-400 whitespace-nowrap">
                    {item.submitted_on_date || item.attempted_on
                      ? dayjs(item.submitted_on_date || item.attempted_on).format('MMM DD, YYYY')
                      : 'Not Attempted'}
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

export default AvgAssessmentScore

