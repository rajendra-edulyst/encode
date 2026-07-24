import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { CiViewTable } from 'react-icons/ci'
import { IoGridOutline, IoVideocam } from 'react-icons/io5'
import { PiCalendar, PiClock } from 'react-icons/pi'
import { LiveClass } from '@/@types/learner/MyClasses'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/commonDateFormat'
import Breadcrumb from '@/components/breadcrumb'
import Heading from '@/components/heading'
import { useLiveClasses } from '@/hooks/data/create/useSessions'
import { Input } from '@/components/ui/ShadcnInput'
import { getLiveSessionDisplayStatus } from '@/utils/liveSessionStatus'

const getExternalJoinUrl = (session: LiveClass) => {
    let url = session?.open_url || session?.zoom_url || session?.url;
    if (!url) return '';
    const passkey = session?.zoom_passkey || session?.passkey;
    if (passkey && !url.includes('pwd=')) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}pwd=${passkey}`;
    }
    return url;
};

const getStatusPriority = (status?: string) => {
    if (status === "Live" || status === "Started") return 1;
    if (status === "Upcoming") return 2;
    return 3;
};

const getStatusStyles = (status?: string) => {
    switch (status) {
        case "Started":
        case "Live":
            return "bg-red-500 text-white";
        case "Upcoming":
            return "bg-primary text-white";
        case "Completed":
            return "bg-green-500 text-white";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const Sessions: React.FC = () => {
    const navigate = useNavigate();

    const { data: liveClasses = [], isLoading: loading, error } = useLiveClasses()
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30_000)
        return () => clearInterval(id)
    }, [])

    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [viewMode, setViewMode] = useState<string>('grid')

    const filteredSessions = liveClasses?.filter((session: LiveClass) => {
        const displayStatus = getLiveSessionDisplayStatus(session, now)
        let matchesFilter = false;
        if (activeFilter === 'all') {
            matchesFilter = true;
        } else if (activeFilter === 'Recorded') {
            matchesFilter = displayStatus === 'Completed' && !!session.record_url;
        } else {
            matchesFilter = displayStatus === activeFilter;
        }
        const matchesSearch = session.name?.toLowerCase().includes(searchQuery.toLowerCase()) || (session.trainer_name && session.trainer_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesFilter && matchesSearch
    });

    const getActionButton = (session: LiveClass) => {
        const displayStatus = getLiveSessionDisplayStatus(session, now)
        if (displayStatus === 'Completed' && !session?.record_url) {
            return '-'
        }

        switch (displayStatus) {
            case 'Started':
            case 'Live':
                return (
                    <button
                        className="bg-green-500 text-black px-4 py-2 rounded whitespace-nowrap hover:bg-green-600 transition-colors"
                        onClick={() => navigate(`/zoom/meeting/${session.id}`)}
                    >
                        Join Now
                    </button>
                )
            case 'Upcoming':
                return (
                    <span className="text-sm text-black bg-blue-50 p-1 px-2 rounded-full">
                        {session?.call_to_action?.action_title}
                    </span>
                )
            case 'Completed':
                return (
                    <>
                        {session?.record_url && (
                            <>
                                <a
                                    href={`${session?.record_url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-gray-500 text-black px-4 py-2 rounded whitespace-nowrap hover:bg-gray-600 transition-colors"
                                    onClick={() =>
                                        console.log(
                                            'Viewing recording:',
                                            session.id,
                                        )
                                    }
                                >
                                    <IoVideocam />
                                </a>
                            </>
                        )}
                    </>
                )
            default:
                return null
        }
    }

    const renderGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredSessions?.length > 0 ? (
                [...filteredSessions]
                    .sort((a, b) => {
                        const statusA = getLiveSessionDisplayStatus(a, now)
                        const statusB = getLiveSessionDisplayStatus(b, now)
                        const priorityA = getStatusPriority(statusA);
                        const priorityB = getStatusPriority(statusB);

                        if (priorityA !== priorityB) {
                            return priorityA - priorityB;
                        }

                        const timeA = a.starttime_ts || a.from_date || 0;
                        const timeB = b.starttime_ts || b.from_date || 0;

                        if (priorityA === 3) { // Completed or other
                            return timeB - timeA;
                        }

                        return timeA - timeB;
                    })
                    .map((session: LiveClass) => (
                        <div
                            key={session.id}
                            className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
                        >
                            {getLiveSessionDisplayStatus(session, now) && (
                                <div className="absolute top-0 right-0 z-10">
                                    <div className={`text-[9px] leading-none m-0 font-medium px-2 py-1 rounded-bl-lg uppercase tracking-wider ${getStatusStyles(getLiveSessionDisplayStatus(session, now))}`}>
                                        {getLiveSessionDisplayStatus(session, now)}
                                    </div>
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-2/3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {session.name}
                                        </h3>
                                        {session?.program_name && (
                                            <p className="text-base font-bold text-gray-700 dark:text-white truncate">
                                                {session.program_name}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-white line-clamp-2">
                                            {session?.batch}
                                        </p>
                                        {session?.module_name && (
                                            <p className="text-xs font-medium text-primary dark:text-primary-foreground italic truncate">
                                                Module: {session.module_name}
                                            </p>
                                        )}
                                    </div>
                                    {session.trainer_name && (
                                        <>
                                            <Link to={`/portfolio/codeedu-dae124fa/${session?.trainer_id}`} className="text-center mb-3 flex flex-col justify-center items-center">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${session.trainer_name}&background=E60086&color=fff`}
                                                    alt={session?.trainer_name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-white mt-2">
                                                    {session.trainer_name}
                                                </span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mb-3 mt-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-white">
                                            <PiCalendar className="text-lg" />
                                            <span>
                                                {
                                                    formatDate(session.from_date, "ddd, DD/MM/YY HH:mm A")
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-white">
                                            <PiClock className="text-lg" />
                                            <span>
                                                {session.start_time} -{' '}
                                                {session.end_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-16">
                                    <p className="text-sm text-gray-500 dark:text-white line-clamp-3">
                                        {session?.description}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-between items-center text-white">
                                    {getActionButton(session)}
                                    <div className="flex items-center gap-2">
                                        {(getLiveSessionDisplayStatus(session, now) === 'Started' || getLiveSessionDisplayStatus(session, now) === 'Live') && getExternalJoinUrl(session) && (
                                            <a
                                                href={getExternalJoinUrl(session)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 hover:text-white text-sm underline whitespace-nowrap"
                                            >
                                                Join external
                                            </a>
                                        )}
                                        {getLiveSessionDisplayStatus(session, now) !== 'Upcoming' && session?.attendance_status && (
                                            <Badge className={`px-4 py-1.5 rounded-full text-sm font-semibold border-none ${session?.attendance_status?.toLowerCase() === 'attended'
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : session?.attendance_status?.toLowerCase() === 'invited'
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                                } `}>
                                                {session?.attendance_status?.toLowerCase() === 'attended'
                                                    ? 'Present'
                                                    : session?.attendance_status?.toLowerCase() === 'invited'
                                                        ? 'Invited'
                                                        : 'Absent'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
            ) : (
                <div className="col-span-3 text-center py-12">
                    <BsSearch className="text-4xl text-gray-400 m-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white dark:text-white mb-2">
                        No Live Session Scheduled
                    </h3>
                </div>
            )}
        </div>
    )
    function getTimeInMinutes(time: string): number {
        if (!time) return 0;
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    const renderTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Sr.no</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Program/Module</th>
                        <th className="py-2 px-4 border-b">Faculty</th>
                        <th className="py-2 px-4 border-b">Start Time</th>
                        <th className="py-2 px-4 border-b">End Time</th>
                        <th className="py-2 px-4 border-b">Duration</th>
                        <th className="py-2 px-4 border-b text-center">Status</th>
                        <th className="py-2 px-4 border-b text-center">Attendance</th>
                        <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSessions.length > 0 ? (
                        [...filteredSessions]
                            .sort((a, b) => {
                                const statusA = getLiveSessionDisplayStatus(a, now)
                                const statusB = getLiveSessionDisplayStatus(b, now)
                                const priorityA = getStatusPriority(statusA);
                                const priorityB = getStatusPriority(statusB);

                                if (priorityA !== priorityB) {
                                    return priorityA - priorityB;
                                }

                                const timeA = a.starttime_ts || a.from_date || 0;
                                const timeB = b.starttime_ts || b.from_date || 0;

                                if (priorityA === 3) { // Completed or other
                                    return timeB - timeA;
                                }

                                return timeA - timeB;
                            })

                            .map((session, index) => (
                                <tr key={'table-session-' + session.id}>
                                    <td className="py-2 px-4 border-b">
                                        {index + 1}
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap">
                                        {session?.name}
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-xs">{session?.program_name}</span>
                                            <span className="text-[10px] text-gray-500 italic">{session?.module_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <Link to={`/portfolio/codeedu-dae124fa/${session?.trainer_id}`} className="flex items-center gap-2 text-nowrap">
                                            <span>{session?.trainer_name}</span>
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap">
                                        {
                                            formatDate(session.from_date, "ddd, DD/MM/YY HH:mm A")
                                        }
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap">
                                        {
                                            formatDate(session.end_date, "ddd, DD/MM/YY HH:mm A")
                                        }
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {session?.duration} Min
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <Badge className={`text-white ${getStatusStyles(getLiveSessionDisplayStatus(session, now))}`}>{getLiveSessionDisplayStatus(session, now)}</Badge>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {getLiveSessionDisplayStatus(session, now) !== 'Upcoming' && session?.attendance_status ? (
                                            <Badge className={`px-3 py-1 rounded-full text-xs font-semibold border-none text-white ${session?.attendance_status?.toLowerCase() === 'attended'
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : session?.attendance_status?.toLowerCase() === 'invited'
                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                }`}>
                                                {session?.attendance_status?.toLowerCase() === 'attended'
                                                    ? 'Present'
                                                    : session?.attendance_status?.toLowerCase() === 'invited'
                                                        ? 'Invited'
                                                        : 'Absent'}
                                            </Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className="flex items-center justify-center">
                                            {getActionButton(session)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="py-4 text-center">
                                No Live Session Scheduled
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={'Something went wrong, please try again later.'} type="danger" />

    const breadcrumbItems = [
        // { label: 'My Space', path: '/my-space' },
        { label: 'My Classes & Sessions' }
    ];

    return (
        <section>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-2 flex flex-col gap-2">
                <Heading title="My Classes & Sessions" description="Join your live classes and access recorded sessions" className='mb-3' />
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search sessions..."
                            className="w-full pl-10 pr-4 py-2 rounded text-sm dark:bg-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <BsSearch className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Live'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Live')}
                        >
                            Live
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Recorded'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Recorded')}
                        >
                            Recorded
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Completed'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Upcoming'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`px-2 rounded whitespace-nowrap ${viewMode === 'grid'
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black dark:text-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() =>
                                setViewMode(
                                    viewMode === 'grid' ? 'table' : 'grid',
                                )
                            }
                        >
                            {viewMode === 'grid' ? (
                                <CiViewTable size={30} />
                            ) : (
                                <IoGridOutline size={30} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {viewMode === 'grid' ? renderGrid() : renderTable()}
        </section>
    )
}

export default Sessions