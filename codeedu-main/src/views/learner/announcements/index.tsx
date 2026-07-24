import { Alert } from '@/components/ui'
import { Link } from 'react-router-dom'
import { BsCalendarDate } from 'react-icons/bs'
import { useAnnouncements } from '@/hooks/data/create/useAnnouncement'
import LoadingSection from '@/components/LoadingSection'
import { stripHtmlTags } from '@/utils/stripHtmlTags'
import { formatDate } from '@/utils/commonDateFormat'
import Heading from '@/components/heading'
import { Card, CardContent } from '@/components/ui/card'

function Announcements() {
    const { data: announcements = [], isLoading, isError, error } = useAnnouncements()

    if (isError) {
        return (
            <Alert
                title={error?.message || "Failed to load announcements"}
                type="danger"
            />
        )
    }

    return (
        <div>
            <Heading title="Announcements" description="Stay updated with the latest news" className='mb-3' />
            {/* Announcements List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {announcements.map(content => (
                    <Link
                        key={content?.id}
                        to={`/connect/post/${content?.id}`}
                        className="group"
                    >
                        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md pt-0">
                            <CardContent className="p-0">
                                {/* Image Section */}
                                {content?.resource_path ? (
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                                        <img
                                            src={content.resource_path}
                                            alt={content?.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="relative h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                                        <div className="text-6xl opacity-20">📢</div>
                                    </div>
                                )}

                                {/* Content Section */}
                                <div className="p-5 space-y-3">
                                    <h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {content?.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                        {stripHtmlTags(content?.description)}
                                    </p>

                                    {/* Date Footer */}
                                    <div className="flex items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                        {content?.start_date && content?.start_date > 0 ? (
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                                <BsCalendarDate className="w-4 h-4 mr-2" />
                                                <span className="text-xs font-medium">
                                                    {formatDate(content.start_date, 'DD/MM/YYYY')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 dark:text-gray-600 italic">
                                                No date specified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {!isLoading && announcements.length === 0 && (
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