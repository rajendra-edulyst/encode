import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar, Clock, Eye, Loader, RefreshCcw, Search, Users } from 'lucide-react';
import Breadcrumb from '@/components/breadcrumb';
import { Input } from '@/components/ui/ShadcnInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/ShadcnButton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/shadcnTooltip';

import { useMySessions } from '@/hooks/data/faculty/useProgram';
import LoadingSection from '@/components/LoadingSection';
import { fetchLcLoad } from '@/services/learner/MyClassService';

interface FilterOption {
    id: string;
    name: string;
}

const Sessions: React.FC = () => {
    const navigate = useNavigate();

    const { data: sessions = [], isLoading, refetch } = useMySessions();
    const [meetingJoinSessionLoaderId, setMeetingJoinSessionLoaderId] = useState<number | null>(null);

    const [courses, setCourses] = useState<FilterOption[]>([]);
    const [semesters, setSemesters] = useState<FilterOption[]>([]);
    const [programs, setPrograms] = useState<FilterOption[]>([]);
    const [batches, setBatches] = useState<FilterOption[]>([]);
    const [classStatuses, setClassStatuses] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [filters, setFilters] = useState({
        course: '',
        semester: '',
        batch: '',
        program: '',
        class_status: '',
        search: '',
    });

    useEffect(() => {
        if (sessions.length > 0) {
            setCourses([...new Set(sessions.map(s => s.course_name).filter(Boolean))].map(name => ({ id: name, name })));
            setSemesters([...new Set(sessions.map(s => s.semester_name).filter(Boolean))].map(name => ({ id: name, name })));
            setPrograms([...new Set(sessions.map(s => s.program_name).filter(Boolean))].map(name => ({ id: name, name })));
            setBatches([...new Set(sessions.map(s => s.batch_name).filter(Boolean))].map(name => ({ id: name, name })));
            setClassStatuses([...new Set(sessions.map(s => s.class_status).filter(Boolean))]);
            console.log(classStatuses);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessions]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const matchesFilter = (sessionVal: string, filterVal: string) =>
        filterVal === '' || sessionVal === filterVal;

    const filteredSessions = sessions.filter(session =>
        matchesFilter(session.course_name, filters.course) &&
        matchesFilter(session.semester_name, filters.semester) &&
        matchesFilter(session.batch_name, filters.batch) &&
        matchesFilter(session.program_name, filters.program) &&
        matchesFilter(session.class_status, filters.class_status) &&
        (filters.search === '' || session.title.toLowerCase().includes(filters.search.toLowerCase()))
    );

    const joinMeetingNow = async (sessionId: number) => {
        setMeetingJoinSessionLoaderId(sessionId);
        try {
            try {
                // Call LC Load API
                await fetchLcLoad(sessionId.toString());
            } catch (error) {
                console.error("Error calling lc load:", error);
            }
            navigate(`/zoom/meeting/${sessionId}`);
        } catch (error) {
            console.error("Error opening Zoom meeting:", error);
        } finally {
            setMeetingJoinSessionLoaderId(null);
        }
    };

    const totalPages = Math.ceil(filteredSessions.length / pageSize);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const breadcrumbItems = [{ label: 'Sessions' }];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Sessions</h1>
                    <p className="text-sm text-gray-500 dark:text-white">Manage your sessions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild size="sm" className='text-black'>
                        <Link to={`/sessions/create`} className="flex gap-2 items-center">Create Session</Link>
                    </Button>
                    <Button variant="outline" size="sm" disabled={isLoading} onClick={() => { toast.success("Refetched successfully"); refetch(); }} >
                        {<RefreshCcw className={`${isLoading ? 'animate-spin' : ''} text-primary`} size={16} />}
                    </Button>
                </div>
            </div>

            <div className="md:flex items-center justify-between mt-3 space-y-2 md:space-y-0">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search ..."
                        className="pl-8 focus-visible:ring-0"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>

                <div className="md:flex items-center gap-3 space-y-2 md:space-y-0">
                    <Select onValueChange={(value) => setFilters({ ...filters, course: value })}>
                        <SelectTrigger className="md:w-[150px] focus:ring-0">
                            <SelectValue placeholder="Programs" />
                        </SelectTrigger>
                        <SelectContent>

                            {courses.map(course => (
                                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setFilters({ ...filters, semester: value })}>
                        <SelectTrigger className="md:w-[150px] focus:ring-0">
                            <SelectValue placeholder="Semesters" />
                        </SelectTrigger>
                        <SelectContent>

                            {semesters.map(sem => (
                                <SelectItem key={sem.id} value={sem.id}>{sem.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setFilters({ ...filters, batch: value })}>
                        <SelectTrigger className="md:w-[150px] focus:ring-0">
                            <SelectValue placeholder="Batchs" />
                        </SelectTrigger>
                        <SelectContent>

                            {batches.map(batch => (
                                <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setFilters({ ...filters, program: value })}>
                        <SelectTrigger className="md:w-[150px] focus:ring-0">
                            <SelectValue placeholder="Subjects" />
                        </SelectTrigger>
                        <SelectContent>

                            {programs.map(program => (
                                <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setFilters({ ...filters, class_status: value })}>
                        <SelectTrigger className="md:w-[150px] focus:ring-0">
                            <SelectValue placeholder="Session Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Live">Live</SelectItem>
                            <SelectItem value="Concluded">Concluded</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Darft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-3 bg-white dark:bg-card rounded-lg shadow-md p-4 overflow-auto max-screen">
                <LoadingSection isLoading={isLoading} title="Loading Sessions..." description='Please wait while we load your sessions.' />
                {paginatedSessions && paginatedSessions.length > 0 &&
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-white'>#</TableHead>
                                <TableHead className='text-white'>Name</TableHead>
                                <TableHead className='text-white'>Subject</TableHead>
                                <TableHead className='text-white'>Module</TableHead>
                                <TableHead className='text-white'>Date</TableHead>
                                <TableHead className='text-white'>Time</TableHead>
                                <TableHead className='text-white'>Participants</TableHead>
                                <TableHead className='text-white'>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedSessions.length > 0 && paginatedSessions.map((session, index) => (
                                <TableRow key={session.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className="max-w-80 truncate text-left">
                                                    <Link to={`/sessions/${session.id}`} className="text-primary capitalize">{session.title}</Link>
                                                    <p className="text-sm text-gray-500">{session.course_name} {session.batch_name && `(${session.batch_name})`}</p>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm text-gray-700 capitalize">{session.title}</p>
                                                <p className="text-xs text-gray-500">{session.course_name} {session.batch_name && `(${session.batch_name})`}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{session.program_name}</TableCell>
                                    <TableCell>{session.module_name || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-nowrap">
                                            <Calendar size={16} className="text-gray-500" />
                                            {new Date(session.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-nowrap">
                                            <Clock size={16} className="text-gray-500" />
                                            {new Date(session.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-gray-500" />
                                            <span>{session.attended_count}/{session.total_users}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {session.class_status === 'Live' && (
                                            <Badge
                                                variant="outline"
                                                className="border-red-700 bg-red-300 text-red-800 shadow-none"
                                            >
                                                Live
                                            </Badge>
                                        )}
                                        {session.class_status === 'Concluded' && (
                                            <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/20">Concluded</Badge>
                                        )}
                                        {session.class_status === 'Scheduled' && (
                                            <Badge variant="outline" className="text-yellow-500 bg-yellow-500/10 border-yellow-500/20">Scheduled</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {session.class_status === 'Scheduled' && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button asChild variant="outline" size="sm" className='hover:text-white hover:bg-primary '>
                                                            <Link to="#" className="flex items-center gap-2">Edit</Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Edit Session</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            {session.class_status === 'Live' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => joinMeetingNow(session.id)}
                                                >
                                                    {meetingJoinSessionLoaderId === session.id ? (
                                                        <Loader className="animate-spin text-primary" size={16} />
                                                    ) : 'Join'}
                                                </Button>
                                            )}
                                            {session.class_status === 'Concluded' && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/sessions/${session.id}?tab=learners`} className="flex gap-2 items-center">
                                                        <Users className="text-primary" size={16} />
                                                    </Link>
                                                </Button>
                                            )}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link to={`/sessions/${session.id}`} className="flex gap-2 items-center hover:text-white hover:bg-primary ">
                                                            <Eye size={16} />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Session</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }

                {paginatedSessions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center">
                            No sessions found.
                        </TableCell>
                    </TableRow>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredSessions.length)} of {filteredSessions.length}
                        </p>
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Prev
                            </Button>
                            <span className="text-sm font-medium px-2">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default Sessions;
