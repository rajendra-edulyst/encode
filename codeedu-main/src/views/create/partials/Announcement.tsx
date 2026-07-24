import { Alert } from '@/components/ui'
import { Link } from 'react-router-dom'
import { BsCalendarDate } from 'react-icons/bs'
import { useAnnouncements } from '@/hooks/data/create/useAnnouncement'
import LoadingSection from '@/components/LoadingSection'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

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
        <Card className='gap-0 py-4'>
            <CardHeader>
                <CardTitle className='text-xl text-primary'>Announcements</CardTitle>
                <CardAction>
                    <Link
                        to="/announcements"
                        className="text-primary text-sm"
                        onClick={() => mixpanelService.track("Announcements View All Clicked")}
                    >
                        View All
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                {announcements.slice(0, 3).map((content, index) => (
                    <div key={content?.id} className="cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105 mb-3">
                        <Link
                            to={`/connect/post/${content?.id}`}
                            className="flex"
                            onClick={() =>
                                mixpanelService.track("Announcement Viewed", {
                                    announcement_id: content.id,
                                    announcement_title: content.title,
                                })
                            }
                        >
                            <div className="flex bg-white dark:bg-transparent w-full overflow-hidden hover:shadow-lg transition-shadow">
                                {content?.resource_path && (
                                    <div className="w-20 aspect-square flex-none rounded-lg overflow-hidden">
                                        <img
                                            src={content?.resource_path}
                                            alt={content?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-3 flex-1 flex flex-col">
                                    <h6 className="font-bold mb-2 text-xs line-clamp-3 dark:text-white">
                                        {content?.title}
                                    </h6>
                                    {content?.start_date && content?.start_date > 0 ? (
                                        <div className="flex items-center text-gray-600 text-sm dark:text-white">
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
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                        {index < Math.min(announcements.length, 3) - 1 && (
                            <div className="h-px w-full bg-border dark:bg-neutral-800" />
                        )}
                    </div>
                ))}

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
            </CardContent>
        </Card>
    )
}

export default Announcements