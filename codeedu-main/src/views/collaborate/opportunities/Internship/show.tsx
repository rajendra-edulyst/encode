import React, { useEffect } from 'react'
import {
    fetchEventById,
    fetchInternshipApply,
} from '@/services/collaborate/EventService'
import { useEventDetailsStore } from '@/store/public/EventStore'
import { useParams, Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { toast } from 'sonner'

type InternshipTask = {
    id: string | number
    title: string
    description: string
    start_date: string
    expected_duration?: string | number
    content_type_label?: string
}

function Details() {
    const { id } = useParams()

    const {
        setEventDetails: setPublicEventDetail,
        eventdetails,
        setError,
        setLoading,
    } = useEventDetailsStore()

    const loadEventDetails = React.useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            if (!id) {
                throw new Error('Event ID is undefined');
            }
            const response = await fetchEventById(id);
            setPublicEventDetail(response)
        } catch (err) {
            setError('Failed to load event details. Please try again.')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [id, setError, setLoading, setPublicEventDetail])

    useEffect(() => {
        loadEventDetails()
    }, [loadEventDetails])

    const handleApply = async () => {
        if (!id) return
        try {
            await fetchInternshipApply(id)
            toast.success('Applied for the internship successfully')
            setPublicEventDetail({
                ...eventdetails,
                is_assigned: 1,
            })
        } catch (err) {
            console.log(err)
            toast.error('Failed to apply for the internship. Please try again.')
        }
    }

    const isButtonDisabled = eventdetails?.is_assigned === 1

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 mt-4 rounded-lg shadow-md overflow-hidden mb-10">
                <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3">
                        <img
                            src={
                                eventdetails?.competitions_details?.program
                                    ?.image || ''
                            }
                            alt="event"
                            className="h-48 md:h-full w-full object-fill"
                        />
                    </div>
                    <div className="flex-1 p-4 space-y-4 border-l border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90">
                        <div className="flex justify-between items-start">
                            <h6 className="font-bold text-gray-800 dark:text-white">
                                {
                                    eventdetails?.competitions_details?.program
                                        ?.name
                                }
                            </h6>
                        </div>
                        <div
                            className="text-sm text-gray-600 dark:text-gray-400"
                            dangerouslySetInnerHTML={{
                                __html: eventdetails?.competitions_details
                                    ?.program?.description,
                            }}
                        ></div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
                                {
                                    eventdetails?.competitions_details?.program
                                        ?.com_status?.program_status
                                }
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                                <Calendar size={16} />{' '}
                                {
                                    eventdetails?.competitions_details?.program
                                        ?.start_date
                                }
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                                <Calendar size={16} />{' '}
                                {
                                    eventdetails?.competitions_details?.program
                                        ?.end_date
                                }
                            </span>
                        </div>

                        <button
                            className={`px-4 py-2 rounded-lg text-white font-medium ${
                                isButtonDisabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary'
                            }`}
                            disabled={isButtonDisabled}
                            onClick={handleApply}
                        >
                            {isButtonDisabled ? 'Already Applied' : 'Apply Now'}
                        </button>
                    </div>
                </div>
            </div>

            {isButtonDisabled &&
                eventdetails?.competitions_details?.program?.contents?.length >
                    0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mt-8 space-y-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-xl font-bold mb-0 text-gray-800 dark:text-white tracking-tight">
                            Tasks
                        </h4>
                        <ul className="space-y-4 !mt-3">
                            {eventdetails?.competitions_details?.program?.contents
                                .sort(
                                    (
                                        a: InternshipTask,
                                        b: InternshipTask,
                                    ) =>
                                        new Date(a.start_date).getTime() -
                                        new Date(b.start_date).getTime(),
                                )
                                .map((task: InternshipTask) => (
                                    <li
                                        key={task.id}
                                        className="group border flex border-gray-200 h-full dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
                                    >
                                        <div>
                                            <Link
                                            // to={`/courses/${id}/modules/${task.id}`}
                                                to={`/event-activity/${id}/content/${task.id}`}
                                                className="text-blue-600 dark:text-blue-400 text-lg font-semibold group-hover:underline"
                                            >
                                                {task.title}
                                            </Link>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                {task.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                                                <span>
                                                    <span className="mr-1 text-gray-600 font-semibold">
                                                        Start Date
                                                    </span>
                                                    :{' '}
                                                    {new Date(
                                                        task.start_date,
                                                    ).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </span>
                                                {task.expected_duration && (
                                                    <span>
                                                        {' '}
                                                        <span className="mr-1 text-gray-600 font-semibold">
                                                            Duration
                                                        </span>
                                                        :{' '}
                                                        {task.expected_duration}{' '}
                                                        mins
                                                    </span>
                                                )}
                                                {task.content_type_label && (
                                                    <span>
                                                        {' '}
                                                        <span className="mr-1 text-gray-600 font-semibold">
                                                            Type
                                                        </span>
                                                        :{' '}
                                                        {
                                                            task.content_type_label
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
        </div>
    )
}

export default Details
