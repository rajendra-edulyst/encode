import React, { useMemo } from 'react'
import { Alert } from '@/components/ui'
import { Link } from 'react-router-dom'
import { BsCalendarDate } from 'react-icons/bs'
import { useAnnouncements } from '@/hooks/data/create/useAnnouncement'
import LoadingSection from '@/components/LoadingSection'

function Announcements() {
    const { data: announcements = [], isLoading, isError, error } = useAnnouncements()

    // Filter and sort using useMemo to avoid recomputing
    const sortedAnnouncements = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return announcements
            .filter(a => a.start_date && new Date(a.start_date * 1000) >= today)
            .sort((a, b) => (a.start_date ?? 0) - (b.start_date ?? 0))
    }, [announcements])

    if (isError) {
        return (
            <Alert
                title={error?.message || "Failed to load announcements"}
                type="danger"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 mt-4 bg-white dark:bg-card p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Announcements</h3>
                <Link to="/" className="text-primary text-sm">
                    View All
                </Link>
            </div>

            {/* Announcements List */}
            {sortedAnnouncements.slice(0, 3).map(content => (
                <div
                    key={content?.id}
                    className="bg-white dark:bg-black rounded-xl cursor-pointer shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 mb-3"
                >
                    <Link to={`/connect/post/${content?.id}`} className="flex">
                        <div className="flex bg-white dark:bg-black w-full rounded-lg border shadow overflow-hidden hover:shadow-lg transition-shadow">
                            {content?.resource_path && (
                                <div
                                    className="w-20 aspect-square flex-none bg-cover bg-center rounded-lg overflow-hidden"
                                    style={{ backgroundImage: `url(${content.resource_path})` }}
                                />
                            )}
                            <div className="p-3 flex-1 flex flex-col">
                                <h6 className="font-bold mb-2 text-xs line-clamp-3 text-white">
                                    {content?.title}
                                </h6>
                                {content?.start_date && content?.start_date > 0 ? (
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <BsCalendarDate className="w-5" />
                                        <span className="ml-2 text-xs">
                                            {new Date(content.start_date * 1000).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="ml-2 text-xs text-gray-500">—</span>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {/* Empty State */}
            {!isLoading && sortedAnnouncements.length === 0 && (
                <div className="flex items-center justify-center h-24">
                    <p className="text-gray-500 text-sm italic">
                        📢 No upcoming announcements found
                    </p>
                </div>
            )}

            {/* Loader */}
            {isLoading && (
                <LoadingSection
                    isLoading={isLoading}
                    title="Announcements"
                    description="Loading announcements..."
                />
            )}
        </div>
    )
}

export default Announcements
