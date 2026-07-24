import React from 'react'
import Breadcrumb from '@/components/breadcrumb'
import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/ShadcnInput'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLearningHours } from '@/hooks/data/create/useCourses'
import LoadingSection from '@/components/LoadingSection'
import { CourseLearningHours } from '@/@types/create/courses'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const breadcrumbItems = [
  { label: 'Overview', path: '/dashboard/learner' },
  { label: 'Learning Hours' },
]

const ITEMS_PER_PAGE = 10

const LearningHours = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const { data: learningHoursData = [], isLoading } = useLearningHours()

  const filteredData = learningHoursData.filter((item: CourseLearningHours) =>
    item.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.module.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={breadcrumbItems} />
        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Course"
            className="pl-9 bg-[#1f1f1f] border-[#2a2a2a] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Card className="bg-[#1c1c1c] border-[#2a2a2a] rounded-xl overflow-hidden">
        <LoadingSection
          isLoading={isLoading}
          title="Learning Hours"
          description="Fetching your learning activity history..."
        />
        {!isLoading && (
          <>
            <Table>
              <TableHeader className="bg-[#2a2a2a]">
                <TableRow>
                  <TableHead className="w-[60px]">S.no</TableHead>
                  <TableHead className="min-w-[260px]">Course Name</TableHead>
                  <TableHead className="min-w-[280px] hidden md:table-cell">Module</TableHead>
                  <TableHead className="w-[120px] hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-[120px] hidden md:table-cell">Content Type</TableHead>
                  <TableHead className="w-[120px] hidden lg:table-cell">Start Time</TableHead>
                  <TableHead className="w-[120px] hidden lg:table-cell">End Time</TableHead>
                  <TableHead className="w-[140px]">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row: CourseLearningHours, index: number) => (
                    <TableRow key={index} className="border-b border-[#2f2f2f]">
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell className="font-medium leading-snug">{row.course_name}</TableCell>
                      <TableCell className="hidden md:table-cell leading-snug">{row.module}</TableCell>
                      <TableCell className="hidden lg:table-cell whitespace-nowrap">{row.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.content_type}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.start_time}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.end_time}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.duration}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No data available for Learning Hours.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="p-4 flex justify-end border-t border-[#2a2a2a]">
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(i + 1)
                          }}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default LearningHours
