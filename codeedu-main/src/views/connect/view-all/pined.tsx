import { Alert } from '@/components/ui'
import { Link } from 'react-router-dom'
import { BsCalendarDate } from 'react-icons/bs'
import { usePosts } from '@/hooks/data/connect/usePosts'
import LoadingSection from '@/components/LoadingSection'
import { stripHtmlTags } from '@/utils/stripHtmlTags'
import { formatApiDate } from '@/utils/dateFormat'
import Heading from '@/components/heading'
import { Card, CardContent } from '@/components/ui/card'
import React, { useMemo, useEffect, useRef } from 'react'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

function PinedViewAll() {
    const { data: pinPosts = [], isLoading, isError, error } = usePosts()

    const posts = useMemo(() => {
        const seen = new Set<number>();
        return pinPosts.filter(post => {
            const isBlog = Number(post.content_type) === 21 || Number(post.content_type) === 1;
            if (!isBlog) return false;
            const idNum = Number(post.id);
            if (seen.has(idNum)) return false;
            seen.add(idNum);
            return true;
        });
    }, [pinPosts])

    const trackedPageView = useRef(false);
    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track('Connect Blog Buzz View All Page Viewed');
            trackedPageView.current = true;
        }
    }, []);

    if (isError) {
        return (
            <Alert
                title={error?.message || "Failed to load Blog Buzz posts"}
                type="danger"
            />
        )
    }

    return (
        <div className="p-4">
            <Heading title="Blog Buzz" description="Stay updated with the latest blog buzz" className='mb-3' />
            {/* Posts List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map(post => {
                    const slug = post?.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post';
                    const postUrl = (Number(post.content_type) === 21 || Number(post.content_type) === 1)
                        ? `/connect/blogs/${slug}/pid?pid=${post?.id}`
                        : `/connect/post/${post?.id}`;
                    const imageUrl = post?.thumbnail_url || post?.multi_file_uploads?.[0] || '';
                    const cleanTitle = post?.title?.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '').replace(/\s+/g, ' ').trim() || 'Unknown Title';
                    
                    return (
                        <Link
                            key={post?.id}
                            to={postUrl}
                            className="group"
                            onClick={() => mixpanelService.track(`Connect :- ${cleanTitle} => blog buzz clicked`, { 
                                blog_id: post?.id, 
                                blog_title: cleanTitle,
                                author: (post as any)?.user_name || 'Anonymous'
                            })}
                        >
                            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md pt-0">
                                <CardContent className="p-0">
                                    {/* Image Section */}
                                    {imageUrl ? (
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                                            <img
                                                src={imageUrl}
                                                alt={post?.title}
                                                className="w-full h-full object-fit transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                    ) : (
                                        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                                            <div className="text-6xl opacity-20">🎨</div>
                                        </div>
                                    )}

                                    {/* Content Section */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {post?.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                            {stripHtmlTags(post?.description || '')}
                                        </p>

                                        {/* Date Footer */}
                                        <div className="flex items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                            {post?.created_at ? (
                                                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                                    <BsCalendarDate className="w-4 h-4 mr-2" />
                                                    <span className="text-xs font-medium">
                                                        {formatApiDate(post.created_at)}
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
                    )
                })}
            </div>

            {/* Empty State */}
            {!isLoading && posts.length === 0 && (
                <div className="flex items-center justify-center h-24">
                    <p className="text-gray-500 text-sm italic">
                        📝 No Blog Buzz posts found
                    </p>
                </div>
            )}

            {/* Loader */}
            {isLoading && (
                <LoadingSection
                    isLoading={isLoading}
                    title="Blog Buzz"
                    description="Loading Blog Buzz posts..."
                />
            )}
        </div>
    )
}

export default PinedViewAll
