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
import { fetchLcLoad } from '@/services/learner/MyClassService'
import { getLiveSessionDisplayStatus } from '@/utils/liveSessionStatus'
import { toast } from 'sonner'

const Sessions: React.FC = () => {
    const navigate = useNavigate();

    const { data: liveClasses = [], isLoading: loading, error } = useLiveClasses();
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30_000)
        return () => clearInterval(id)
    }, [])

    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [viewMode, setViewMode] = useState<string>('grid')

    const getStatusPriority = (status?: string) => {
        if (status === 'Live' || status === 'Started') return 1
        if (status === 'Upcoming') return 2
        return 3
    }

    const filteredSessions = liveClasses?.filter((session: LiveClass) => {
        const displayStatus = getLiveSessionDisplayStatus(session, now)
        const matchesFilter = activeFilter === 'all' || displayStatus === activeFilter
        const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase()) || session.trainer_name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <a
                        className="bg-green-500 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-green-600 transition-colors"
                        href={session?.zoom_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                await fetchLcLoad(String(session.id));
                            } catch (error) {
                                console.error('Error calling lc load:', error);
                            }
                            navigate(`/zoom/meeting/${session.id}`);
                            console.log('Joining session:', session.id);
                        }}
                    >
                        Join Now
                    </a>
                )
            case 'Upcoming':
                return (
                    <span className="text-sm text-gray-500 bg-blue-50 p-1 px-2 rounded-full">
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
                                    className="bg-gray-500 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-gray-600 transition-colors"
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
                        const priorityA = getStatusPriority(statusA)
                        const priorityB = getStatusPriority(statusB)
                        if (priorityA !== priorityB) return priorityA - priorityB

                        const timeA = a.starttime_ts || a.from_date || 0
                        const timeB = b.starttime_ts || b.from_date || 0
                        if (priorityA === 3) return timeB - timeA
                        return timeA - timeB
                    })
                    .map((session: LiveClass) => (
                        <div
                            key={session.id}
                            className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-2/3">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {session.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {session?.batch}
                                        </p>
                                    </div>
                                    {session.trainer_name !== null && (
                                        <>
                                            <Link to={`/portfolio/codeedu-dae124fa/${session?.trainer_id}`} className="text-center mb-3 flex flex-col justify-center items-center">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${session.trainer_name}&background=E60086&color=fff`}
                                                    alt={session?.trainer_name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="text-sm text-gray-600 mt-2">
                                                    {session.trainer_name}
                                                </span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mb-3 mt-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <PiCalendar className="text-lg" />
                                            <span>
                                                {formatDate(session.from_date, "ddd, DD MMM YYYY")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <PiClock className="text-lg" />
                                            <span>
                                                {session.start_time} -{' '}
                                                {session.end_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-16">
                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {session?.description}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-between text-white">
                                    {getActionButton(session)}
                                    {getLiveSessionDisplayStatus(session, now) !== 'Upcoming' && session?.attendance_status?.toLowerCase() !== 'invited' && (
                                        <Badge className={`mt-2 ${session?.attendance_status?.toLowerCase() === 'attended' ? 'bg-green-500' : 'bg-red-500'} `}>
                                            {session?.attendance_status?.toLowerCase() === 'attended' ? 'Present' : 'Absent'}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
            ) : (
                <div className="col-span-3 text-center py-12">
                    <BsSearch className="text-4xl text-gray-400 m-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                        <th className="py-2 px-4 border-b">Faculty</th>
                        <th className="py-2 px-4 border-b">Start Time</th>
                        <th className="py-2 px-4 border-b">End Time</th>
                        <th className="py-2 px-4 border-b">Duration</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSessions.length > 0 ? (
                        [...filteredSessions]
                            .sort((a, b) => {
                                const statusA = getLiveSessionDisplayStatus(a, now)
                                const statusB = getLiveSessionDisplayStatus(b, now)
                                const priorityA = getStatusPriority(statusA)
                                const priorityB = getStatusPriority(statusB)
                                if (priorityA !== priorityB) return priorityA - priorityB

                                const timeA = a.starttime_ts || a.from_date || 0
                                const timeB = b.starttime_ts || b.from_date || 0
                                if (priorityA === 3) return timeB - timeA
                                return timeA - timeB
                            })

                            .map((session, index) => (
                                <tr key={'table-session-' + session.id}>
                                    <td className="py-2 px-4 border-b">
                                        {index + 1}
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap">
                                        {session?.name}
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
                                    <td className="py-2 px-4 border-b">
                                        <Badge className='text-white'>{getLiveSessionDisplayStatus(session, now)}</Badge>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center justify-end">
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
        { label: 'My Space', path: '/my-space' },
        { label: 'My Classes & Sessions' }
    ];

    return (
        <section>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-2 flex flex-col gap-2">
                <Heading title="My Classes & Sessions" description="Join your live classes and access recorded sessions" className='mb-3' />
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <BsSearch className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'all'
                                ? 'text-black'
                                : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Live'
                                ? 'text-black'
                                : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Live')}
                        >
                            Live
                        </button>
                        <button
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeFilter === 'Completed'
                                ? 'text-black'
                                : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                            onClick={() => setActiveFilter('Completed')}
                        >
                            Recorded
                        </button>
                        <button
                            className={`px-2 rounded whitespace-nowrap ${viewMode === 'grid'
                                ? 'text-black'
                                : 'bg-white text-gray-700 border border-gray-300'
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