import React, { useEffect } from 'react'
import {
    fetchEventById,
    fetchInternshipApply,
} from '@/services/collaborate/EventService'
import { useEventDetailsStore } from '@/store/public/EventStore'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, BookmarkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/ShadcnButton'
import { formatDate } from '@/utils/commonDateFormat'

interface Task {
    id: string | number
    title: string
    description: string
    start_date: string
    expected_duration?: number
    content_type_label?: string
}

function Details() {
    const { id } = useParams()

    const { setEventDetails: setPublicEventDetail, eventdetails, setError, setLoading } = useEventDetailsStore()

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
            {/* Main Internship Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        {/* Left Section: Logo, Title, and Info */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                {/* Company Logo */}
                                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <img
                                        src={eventdetails?.competitions_details?.program?.image || ''}
                                        alt="company logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Title and Company Info */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary">
                                        {
                                            eventdetails?.competitions_details?.program?.name
                                        }
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-2">
                                        {
                                            eventdetails?.competitions_details?.program?.organization_name
                                        }
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="truncate">Location</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <mask id="mask0_3251_962" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#7A7A7A" />
                                        </mask>
                                        <g mask="url(#mask0_3251_962)">
                                            <path d="M4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H8V4C8 3.45 8.19583 2.97917 8.5875 2.5875C8.97917 2.19583 9.45 2 10 2H14C14.55 2 15.0208 2.19583 15.4125 2.5875C15.8042 2.97917 16 3.45 16 4V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4ZM10 6H14V4H10V6Z" fill="#7A7A7A" />
                                        </g>
                                    </svg>
                                    <span>Experience Required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <mask id="mask0_3251_961" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_3251_961)">
                                            <path d="M7.425 9.47499L11.15 3.39999C11.25 3.23332 11.375 3.11249 11.525 3.03749C11.675 2.96249 11.8333 2.92499 12 2.92499C12.1667 2.92499 12.325 2.96249 12.475 3.03749C12.625 3.11249 12.75 3.23332 12.85 3.39999L16.575 9.47499C16.675 9.64165 16.725 9.81665 16.725 9.99999C16.725 10.1833 16.6833 10.35 16.6 10.5C16.5167 10.65 16.4 10.7708 16.25 10.8625C16.1 10.9542 15.925 11 15.725 11H8.275C8.075 11 7.9 10.9542 7.75 10.8625C7.6 10.7708 7.48333 10.65 7.4 10.5C7.31667 10.35 7.275 10.1833 7.275 9.99999C7.275 9.81665 7.325 9.64165 7.425 9.47499ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 20.5V14.5C3 14.2167 3.09583 13.9792 3.2875 13.7875C3.47917 13.5958 3.71667 13.5 4 13.5H10C10.2833 13.5 10.5208 13.5958 10.7125 13.7875C10.9042 13.9792 11 14.2167 11 14.5V20.5C11 20.7833 10.9042 21.0208 10.7125 21.2125C10.5208 21.4042 10.2833 21.5 10 21.5H4C3.71667 21.5 3.47917 21.4042 3.2875 21.2125C3.09583 21.0208 3 20.7833 3 20.5Z" fill="#7A7A7A" />
                                        </g>
                                    </svg>
                                    <span>Full-time</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <mask id="mask0_3254_964" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_3254_964)">
                                            <path d="M13.425 20.7L7.275 14.3C7.19167 14.2167 7.125 14.1125 7.075 13.9875C7.025 13.8625 7 13.7333 7 13.6V13C7 12.7167 7.09583 12.4792 7.2875 12.2875C7.47917 12.0958 7.71667 12 8 12H10.5C11.3833 12 12.1458 11.7125 12.7875 11.1375C13.4292 10.5625 13.8167 9.85 13.95 9H7C6.71667 9 6.47917 8.90417 6.2875 8.7125C6.09583 8.52083 6 8.28333 6 8C6 7.71667 6.09583 7.47917 6.2875 7.2875C6.47917 7.09583 6.71667 7 7 7H13.65C13.3667 6.41667 12.9458 5.9375 12.3875 5.5625C11.8292 5.1875 11.2 5 10.5 5H7C6.71667 5 6.47917 4.90417 6.2875 4.7125C6.09583 4.52083 6 4.28333 6 4C6 3.71667 6.09583 3.47917 6.2875 3.2875C6.47917 3.09583 6.71667 3 7 3H17C17.2833 3 17.5208 3.09583 17.7125 3.2875C17.9042 3.47917 18 3.71667 18 4C18 4.28333 17.9042 4.52083 17.7125 4.7125C17.5208 4.90417 17.2833 5 17 5H14.75C14.9833 5.28333 15.1917 5.59167 15.375 5.925C15.5583 6.25833 15.7 6.61667 15.8 7H17C17.2833 7 17.5208 7.09583 17.7125 7.2875C17.9042 7.47917 18 7.71667 18 8C18 8.28333 17.9042 8.52083 17.7125 8.7125C17.5208 8.90417 17.2833 9 17 9H15.975C15.8417 10.4167 15.2583 11.6042 14.225 12.5625C13.1917 13.5208 11.95 14 10.5 14H9.775L14.875 19.3C15.175 19.6167 15.2375 19.9792 15.0625 20.3875C14.8875 20.7958 14.5833 21 14.15 21C14.0167 21 13.8875 20.975 13.7625 20.925C13.6375 20.875 13.525 20.8 13.425 20.7Z" fill="#7A7A7A" />
                                        </g>
                                    </svg>
                                    <span>Stipend/Salary Details</span>
                                </div>
                            </div>
                            {/* Posted Date */}
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                Posted On: {' '}{formatDate(eventdetails?.competitions_details?.program?.start_date, 'DD MMM, YYYY')}
                            </p>
                        </div>

                        {/* Right Section: Bookmark and Apply Button */}
                        <div className="flex flex-col items-end gap-4 justify-between">
                            <Button variant={'outline'} size={'icon'} className='bg-gray-600 mb-10'>
                                <BookmarkIcon className="w-5 h-5 text-primary" />
                            </Button>
                            <button
                                className={`w-[125px] h-[118px] py-3 rounded-xl text-white font-semibold text-sm md:text-base transition-all duration-200 whitespace-nowrap ${isButtonDisabled
                                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
                                    }`}
                                disabled={isButtonDisabled}
                                onClick={handleApply}
                            >
                                {!isButtonDisabled && <ArrowRight className="w-6 h-6 mb-2 mx-auto" />}
                                {isButtonDisabled && <span>Already <br /> Applied</span>}
                                {!isButtonDisabled && <span>Apply Now</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Description Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Job Description
                </h2>
                <div
                    className="text-gray-600 dark:text-gray-400 leading-relaxed prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: eventdetails?.competitions_details
                            ?.program?.description || '<p>No description available.</p>',
                    }}
                ></div>
            </div>

            {/* Skills Required Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Skills Required
                </h2>
                <div className="flex flex-wrap gap-3">
                    {eventdetails?.competitions_details?.program?.com_status?.program_status && (
                        <div className="px-5 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg text-sm md:text-base font-medium">
                            {eventdetails.competitions_details.program.com_status.program_status}
                        </div>
                    )}
                    <div className="px-5 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg text-sm md:text-base font-medium">
                        Programming
                    </div>
                    <div className="px-5 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg text-sm md:text-base font-medium">
                        Communication
                    </div>
                    <div className="px-5 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg text-sm md:text-base font-medium">
                        Team Work
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
                            {
                                eventdetails?.competitions_details?.program?.contents.map((task: Task) => (
                                    <li
                                        key={task.id}
                                        className="group border flex border-gray-200 h-full dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
                                    >
                                        <div>
                                            <Link
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
