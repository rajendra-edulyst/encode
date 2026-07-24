import { Search, Eye, Users, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/ShadcnInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumb from '@/components/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import { useBatches, useMyAssignedPrograms } from '@/hooks/data/faculty/useProgram';
import LoadingSection from '@/components/LoadingSection';
import { toast } from 'sonner';

const Sessions: React.FC = () => {
  const [filters, setFilters] = useState({
    batch: '',
    subject: '',
    status: '',
    search: '',
  });

  const params = new URLSearchParams();
  if (filters.batch && filters.batch !== 'all') params.append('batch_id', filters.batch);
  if (filters.subject && filters.subject !== 'all') params.append('subject', filters.subject);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const { data: assignedPrograms = [], isError, isLoading, error, refetch } = useMyAssignedPrograms(params);
  const { data: batches = [] } = useBatches();

  const breadcrumbItems = [
    { label: 'Course/Subject' },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">My Course/Subject</h1>
          <p className="text-sm text-gray-500 dark:text-white">Manage your courses/subjects</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button asChild variant="default" className="text-white" size="sm">
            <Link to="/programs/create" className="flex gap-2 items-center">Create Subject</Link>
          </Button> */}
          <Button variant="outline" size="sm" disabled={isLoading} onClick={() => { toast.success("Refetched successfully"); refetch(); }} >
            {<RefreshCcw className={`${isLoading ? 'animate-spin' : ''} text-primary`} size={16} />}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className='relative'>
          <Input type="text" placeholder="Search ..." className='pl-8 focus-visible:ring-0' value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
        <div className="flex items-center gap-3">
          <Select disabled={!batches} onValueChange={(value) => setFilters({ ...filters, batch: value })}>
            <SelectTrigger className="w-[150px] focus:ring-0">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {batches?.map((batch) => (
                <SelectItem key={batch.id} value={`${batch.id}`}>{batch.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3 bg-white dark:bg-card rounded-md shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Program Name</TableHead>
              <TableHead>Semester Name</TableHead>
              <TableHead>Batch Name</TableHead>
              <TableHead className='text-center'>Learners</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedPrograms?.map((program, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-primary">
                  <div className='flex items-center gap-2'>
                    <img src={program?.image} alt={program?.name} className="w-12 mr-2 rounded-sm" />
                    <Link to={`/courses/${program.id}`} className='text-nowrap'>{program?.name}</Link>
                  </div>
                </TableCell>
                <TableCell><div className="flex items-center gap-2">{program?.semester_name ?? 'N/A'}</div></TableCell>
                <TableCell><div className="flex items-center gap-2">{program?.course_name ?? 'N/A'}</div></TableCell>
                <TableCell><div className="flex items-center gap-2">{program?.batch_names ?? 'N/A'}</div></TableCell>
                <TableCell className='text-center'><div className="flex items-center gap-2 justify-center">{program?.tot_learners ?? 'N/A'} <Users className="w-4 h-4" /> </div></TableCell>
                <TableCell className="text-right"><Button asChild variant="outline" className="text-primary" size="sm"><Link to={`/courses/${program.id}`} className="flex gap-2 items-center"><Eye /></Link></Button></TableCell>
              </TableRow>
            ))}
            {
              assignedPrograms?.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No subjects found.
                  </TableCell>
                </TableRow>
              )
            }
            {
              isLoading && <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <LoadingSection isLoading={isLoading} title="subjects..." />
                </TableCell>
              </TableRow>
            }
            {
              isError && <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-red-500">
                  {error instanceof Error ? error.message : 'Something went wrong, Please try again later.'}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <div className='mt-3'>
        <p className="text-sm text-gray-500">Showing {assignedPrograms?.length} of {assignedPrograms?.length} sessions</p>
      </div>
    </div>
  )
}

export default Sessions