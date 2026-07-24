import React from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Event, InvitedUsers } from '../@types/calendar'
import { fetchInvitedUsers } from '../services/CalendarService'
import { Link } from 'react-router-dom';


interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    onDelete?: () => void
    event: Event | null
}

const ShowModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    event,
    onDelete,
}) => {
    if (!isOpen || !event) return null

    const [ivitedUsers, setInvitedUsers] = React.useState<InvitedUsers[]>([])

    const fetchInvitedUsersCall = async (eventId: number) => {
        try {
            const res = await fetchInvitedUsers(eventId)
            setInvitedUsers(res.data.invited_user || [])
        } catch (err) {
            console.error("Failed to fetch invited users", err)
        }
    }

    React.useEffect(() => {
        fetchInvitedUsersCall(Number(event.id))
    }, [event.id])

    function formatIndianDateTime(datetime: string | Date | null | undefined) {
        if (!datetime) return 'Invalid date';

        let dateObj: Date;

        if (typeof datetime === 'string') {
            // Replace only if it's a string in "YYYY-MM-DD HH:mm:ss" format
            dateObj = new Date(datetime.replace(' ', 'T'));
        } else if (datetime instanceof Date) {
            dateObj = datetime;
        } else {
            return 'Invalid date';
        }

        return dateObj.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        });
    }

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <RxCross1 size={18} />
                </button>
                <div className="space-y-5">
                    <h3 className="text-2xl font-bold text-primary capitalize dark:text-blue-300 flex items-center gap-2">
                        {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Start Date & Time:</span>
                        <span className="px-2 py-1 rounded">{formatIndianDateTime(event.start)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">End Date & Time:</span>
                        <span className="px-2 py-1 rounded">{formatIndianDateTime(event.end)}</span>
                    </div>
                    {event.purpose && (
                        <div className="text-gray-700 dark:text-gray-200">
                            <span className="font-semibold">Purpose:</span>
                            <span className="ml-2">{event.purpose}</span>
                        </div>
                    )}

                    {event.invited_by_name && (
                        <div className="text-gray-700 dark:text-gray-200">
                            <span className="font-semibold">Invited by:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-400">{event.invited_by_name}</span>
                        </div>
                    )}
                    {event.link && (
                        <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Link:</span>
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-500 dark:text-blue-300 underline hover:text-blue-700 transition-colors"
                            >
                                {event.link}
                            </a>
                        </div>
                    )}
                    {ivitedUsers && ivitedUsers.length > 0 && (
                        <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Invited Users:</span>
                            <ul className="mt-3 space-y-1">
                                {ivitedUsers.slice(0, 2).map((user) => (
                                    <li
                                        key={user.id}
                                        className={`flex items-center gap-2 px-2 py-1 rounded ${user.approval_status === 1
                                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                            }`}
                                    >
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">({user.email})</span>
                                        <span className="ml-auto text-xs font-semibold">
                                            {user.approval_status === 1
                                                ? 'Accepted'
                                                : user.approval_status === 0
                                                    ? 'Pending'
                                                    : 'Rejected'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className='mt-4 items-center flex justify-end'>
                    {/* <Link to={`/event-activity/${event.id}`} className="text-primary hover:underline">
                        View Details
                    </Link> */}

                    {!event?.invited_by_name && (
                        <div className="flex justify-end space-x-3">
                            {/* <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition"
                    onClick={onEdit}
                >
                    Edit
                </button> */}

                            <button
                                className="px-5 py-2 justify-end bg-red-500 hover:bg-red-700 text-white rounded-md shadow hover:from-red-600 hover:to-pink-600 transition"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                </div>


            </div>
        </div>
    )
}

export default ShowModal