import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/ShadcnInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Breadcrumb from '@/components/breadcrumb'
import { Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { debounce } from 'lodash'
import { useAssignments, useBatches, useMyAssignedPrograms } from '@/hooks/data/faculty/useProgram'
import LoadingSection from '@/components/LoadingSection'
import Heading from '@/components/heading'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/shadcnTooltip'
import { formatDate } from '@/utils/commonDateFormat'

const Assignments = () => {
    const [inputValue, setInputValue] = useState("");

    const [filters, setFilters] = useState({
        batch: '',
        program_id: '',
        status: '',
        search: '',
    });


    const debouncedSearch = useMemo(() => debounce((value: string) => {
        setFilters(prev => ({ ...prev, search: value }));
    }, 1000), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debouncedSearch(e.target.value);
    };


    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        }
    }, [debouncedSearch]);


    const params = useMemo(() => {
        const p: Record<string, string> = {};
        if (filters.batch && filters.batch !== "all") p.batch_id = filters.batch;
        if (filters.program_id && filters.program_id !== "all") p.program_id = filters.program_id;
        if (filters.status && filters.status !== "all") p.status = filters.status;
        if (filters.search) p.query = filters.search;
        return new URLSearchParams(p);
    }, [filters]);

    const { data: assignments = [], isLoading, isError } = useAssignments(params);
    const { data: subjects = [], isLoading: isLoadingSubjects, isError: isErrorSubjects } = useMyAssignedPrograms();
    const { data: batches = [], isLoading: isLoadingBatches, isError: isErrorBatches } = useBatches();

    const breadcrumbItems = [
        { label: 'Assignments' },
    ]

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between mb-3">
                <Heading title="Assignments" description="Manage Your Assignments" className='mb-3' />
                <Button asChild className='text-white'>
                    <Link to="/create/subjects/assignments/add">Create Assignment</Link>
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <div className='relative'>
                    <Input
                        type="text"
                        placeholder="Search title..."
                        value={inputValue}
                        className='pl-8 focus-visible:ring-0'
                        onChange={handleInputChange}
                    />
                    <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
                <div className="flex items-center gap-3">
                    {/* Batch */}
                    <Select disabled={isLoadingBatches || isErrorBatches || batches.length === 0} onValueChange={(value) => setFilters({ ...filters, batch: value })}>
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
                    {/* Subject */}
                    <Select disabled={isLoadingSubjects || isErrorSubjects || subjects.length === 0} onValueChange={(value) => setFilters({ ...filters, program_id: value })}>
                        <SelectTrigger className="w-[150px] focus:ring-0">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {subjects?.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>{subject.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Status */}
                    <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                        <SelectTrigger className="w-[150px] focus:ring-0">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="mt-3 bg-white dark:bg-card rounded-md shadow-sm border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead className='text-center'>Participants</TableHead>
                            <TableHead className='text-center'>Submissions</TableHead>
                            <TableHead className='text-center'>Created Date</TableHead>
                            <TableHead className='text-center'>Start Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments?.map((assignment, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="capitalize">{assignment?.title}</TableCell>
                                <TableCell>{assignment?.program_name}</TableCell>
                                <TableCell className='text-center'>{assignment?.total_learner ?? 'N/A'}</TableCell>
                                <TableCell className='text-center'>{assignment?.total_submissions ?? 'N/A'}</TableCell>
                                <TableCell className='text-center'>  <div className="flex items-center gap-2 justify-center">
                                        <Calendar className="text-gray-500" size={16} />
                                        {
                                            formatDate(assignment?.assignment_created_date, 'ddd, MMM DD YYYY, h:mm A')
                                        }
                                    </div></TableCell>
                                <TableCell className='text-center'>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Calendar className="text-gray-500" size={16} />
                                        {
                                            formatDate(assignment?.start_date, 'ddd, MMM DD YYYY, h:mm A')
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button asChild variant="outline" className="text-primary hover:bg-primary hover:text-white" size="sm">
                                                <Link to={`/assignments/${assignment.id}`}>View</Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            View assignment details and submissions
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            assignments?.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        No assignments found.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            isLoading && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        <LoadingSection isLoading={isLoading} title='Assignmemts' />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            isError && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-red-500">
                                        Something went wrong, Please try again later.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Assignments