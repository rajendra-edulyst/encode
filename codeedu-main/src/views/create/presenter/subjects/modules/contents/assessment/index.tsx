import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/ShadcnInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Breadcrumb from '@/components/breadcrumb'
import { Calendar, Clock, RefreshCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAssessments, useBatches, useMyAssignedPrograms } from '@/hooks/data/faculty/useProgram'
import LoadingSection from '@/components/LoadingSection'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/shadcnTooltip'

const Assessments = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    batch: '',
    program_id: '',
    course_status: 'all',
    mode_of_delivery: '',
  });

  const params = new URLSearchParams();
  if (filters.batch && filters.batch !== 'all') params.append('batch_id', filters.batch);
  if (filters.program_id && filters.program_id !== 'all') params.append('program_id', filters.program_id);
  if (filters.course_status) params.append('course_status', filters.course_status);
  if (filters.mode_of_delivery && filters.mode_of_delivery !== 'all') params.append('mode_of_delivery', filters.mode_of_delivery);

  const { data: assessments = [], isLoading, isError, error, refetch } = useAssessments(params);
  const { data: subjects = [], isLoading: isLoadingSubjects, isError: isErrorSubjects } = useMyAssignedPrograms();
  const { data: batches = [], isLoading: isLoadingBatches, isError: isErrorBatches } = useBatches();

  // Local search filtering
  const filteredAssessments = useMemo(() => {
    if (!searchTerm.trim()) return assessments;

    const searchLower = searchTerm.toLowerCase();
    return assessments.filter(assessment =>
      assessment.title?.toLowerCase().includes(searchLower) ||
      assessment.program_name?.toLowerCase().includes(searchLower)
    );
  }, [assessments, searchTerm]);

  const breadcrumbItems = [
    { label: 'Assessments' },
  ]

  const modeOfDelivery: Record<string, string> = {
    "self_peased": "Self Paced",
    "online_interactive": "Live Online",
    "hybrid": "In-class"
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Assessments</h1>
          <p className="text-sm text-gray-500 dark:text-white">Manage Your Assessments</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button asChild className='text-white' size="sm">
            <Link to="/assessments/add">Create Content</Link>
          </Button> */}
          <Button variant="outline" size="sm" disabled={isLoading} onClick={() => { toast.success("Refetched successfully"); refetch(); }} >
            {<RefreshCcw className={`${isLoading ? 'animate-spin' : ''} text-primary`} size={16} />}
          </Button>
        </div>
      </div>
      <div className="md:flex items-center justify-between mt-3 space-y-2 md:space-y-0">
        <div className='relative'>
          <Input
            type="text"
            placeholder="Search title..."
            value={searchTerm}
            className='pl-8 focus-visible:ring-0'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
        <div className="md:flex items-center gap-3 space-y-2 md:space-y-0">
          {/* Batch */}
          <Select disabled={isLoadingBatches || isErrorBatches || batches.length === 0} onValueChange={(value) => setFilters({ ...filters, batch: value })}>
            <SelectTrigger className="md:w-[150px] focus:ring-0">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {batches?.map((batch, index) => (
                <SelectItem key={index + 1} value={`${batch.id}`}>{batch.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Subject */}
          <Select
            disabled={isLoadingSubjects || isErrorSubjects || subjects.length === 0} onValueChange={(value) => setFilters({ ...filters, program_id: value })}>
            <SelectTrigger className="md:w-[150px] focus:ring-0">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {subjects?.map((subject, index) => (
                <SelectItem key={index + 1} value={subject.id.toString()}>{subject.name}</SelectItem>
              ))
              }
            </SelectContent>
          </Select>
          {/* Status */}
          <Select onValueChange={(value) => setFilters({ ...filters, course_status: value })}>
            <SelectTrigger className="md:w-[150px] focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
          {/* mode of delivery */}
          <Select onValueChange={(value) => setFilters({ ...filters, mode_of_delivery: value })}>
            <SelectTrigger className="md:w-[150px] focus:ring-0">
              <SelectValue placeholder="Mode of Delivery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="self_peased">Self Paced</SelectItem>
              <SelectItem value="online_interactive">Live Online</SelectItem>
              <SelectItem value="hybrid">In-class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3 bg-white dark:bg-card rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Mode of Delivery</TableHead>
              <TableHead className='text-center'>Participants</TableHead>
              <TableHead className='text-center'>Submissions</TableHead>
              <TableHead className='text-center'>Start Date</TableHead>
              <TableHead className='text-center'>End Date</TableHead>
              <TableHead className='text-center'>Durations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssessments?.map((assessment, index) => (
              <TableRow key={assessment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">{assessment?.title}</TableCell>
                <TableCell>{assessment?.program_name}</TableCell>
                <TableCell>{modeOfDelivery[`${assessment?.mode_of_delivery}`]}</TableCell>
                <TableCell className='text-center'>{assessment?.total_learner ?? 'N/A'}</TableCell>
                <TableCell className='text-center'>{assessment?.total_submissions ?? 'N/A'}</TableCell>
                <TableCell className='text-center'>
                  <div className="flex items-center justify-center gap-2 text-nowrap">
                    <Calendar className="text-gray-500" size={16} />
                    {new Date(assessment?.start_date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <div className="flex items-center justify-center gap-2 text-nowrap">
                    <Clock className="text-gray-500" size={16} />
                    {new Date(assessment?.end_date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  {assessment?.expected_duration} min
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button asChild variant="outline" className="text-primary hover:bg-primary hover:text-white" size="sm">
                        {
                          assessment?.quiz_type === 'industry' ? <Link to={`/courses/${assessment?.program_id}/modules/${assessment?.module_id}?content_id=${assessment?.id}`}>View</Link> : <Link to={`/assessments/${assessment.id}`}>View</Link>
                        }

                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View assessment details and submissions
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {
              filteredAssessments?.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No assessments found.
                  </TableCell>
                </TableRow>
              )
            }
            {
              isLoading && <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  <LoadingSection isLoading={isLoading} title="Assessments" />
                </TableCell>
              </TableRow>
            }
            {
              isError && <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-red-500">
                  {error instanceof Error ? error.message : 'Something went wrong, Please try again later.'}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Assessments