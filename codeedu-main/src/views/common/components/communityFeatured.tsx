import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosts } from '@/hooks/data/connect/usePosts';
import { timeAgo } from '@/utils/hooks/timeAgo';
import { motion, AnimatePresence } from 'framer-motion';

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
};

const CommunityFeatured = () => {
    const parms = new URLSearchParams();
    const { data: pinPosts = [], isLoading: loading, isError: error } = usePosts(parms);
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredPosts = pinPosts?.filter((post: any) => {
        const isPinned = post.is_pin === 1 || post.is_pin === '1';
        const isPinnedByAdminRole = post.pin_by_role?.toLowerCase() === 'admin';
        return isPinned && isPinnedByAdminRole;
    }) || [];

    useEffect(() => {
        if (!filteredPosts.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredPosts.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [filteredPosts.length]);

    if (loading && !pinPosts?.length) {
        return (
            <Card className="py-4 gap-0 bg-card border-none shadow-none">
                <CardHeader className="px-4 pt-0 pb-3">
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="px-4">
                    <div className="w-full bg-card dark:bg-[#323232] bg-[#323232] rounded-xl border border-border overflow-hidden shadow-sm flex flex-col h-[320px]">
                        <Skeleton className="h-[160px] w-full rounded-none" />
                        <div className="p-4 flex flex-col flex-grow">
                            <Skeleton className="h-4 w-3/4 mb-3" />
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-3 w-5/6 mb-4" />

                            <div className="flex items-center mt-auto">
                                <Skeleton className="w-8 h-8 rounded-full mr-2.5" />
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-2 w-12" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !pinPosts?.length) {
        return <div className="text-center text-red-500 p-4">Error: {error}</div>;
    }

    if (filteredPosts.length === 0) {
        return (
            <>
            </>
        );
    }

    // <Card className="py-4 gap-0 bg-card border-none shadow-none">
    //             <CardHeader className="px-4 pt-0 pb-3">
    //                 <CardTitle className="text-xl text-cblack dark:text-white">
    //                     <span className="text-primary">Featured </span> Blogs
    //                 </CardTitle>
    //             </CardHeader>
    //             <CardContent className="px-4">
    //                 <div className="flex items-center justify-center h-[120px] rounded-xl border border-dashed border-border bg-gray-50/50 dark:bg-[#1A1A1A]/50">
    //                     <p className="text-gray-500 text-sm italic">
    //                         No featured blogs available.
    //                     </p>
    //                 </div>
    //             </CardContent>
    //         </Card>
    return (
        <Card className="py-4 gap-0 bg-card border-none shadow-none">
            <CardHeader className="px-4 pt-0 pb-3">
                <CardTitle className="text-xl text-cblack dark:text-white">
                    <span className="text-primary">Community</span> Featured
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <EventCard post={filteredPosts[currentIndex]} />
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

interface EventCardProps {
    post: any;
}

const EventCard: React.FC<EventCardProps> = ({ post }) => {
    const icon = post.thumbnail_url || post.resource_path || `https://ui-avatars.com/api/?name=${post.title || 'Unknown'}&background=random`;
    const title = post.title;
    const organization = post.category_name;
    const authorAvatar = post.created_by_profile_image || `https://ui-avatars.com/api/?name=${post.name || 'Unknown'}`;
    const authorName = post.name || post.created_by_name || 'Unknown';

    const dateObj = new Date(post.created_at * 1000);
    const timeText = timeAgo(dateObj);
    const excerpt = stripHtml(post.description);

    return (
        <div className="w-full bg-card dark:bg-[#1A1A1A] rounded-xl border border-border overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow h-auto">
            <Link to={`/connect/post/${post.id}`} className="flex flex-col h-full">
                <div className="h-[160px] w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={icon} alt={title} className="w-full h-full object-cover" />
                    {organization && (
                        <span className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold px-2 py-1">
                            {organization}
                        </span>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-[15px] text-cblack dark:text-white leading-snug mb-2 line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {excerpt}
                    </p>

                    <div className="flex items-center mt-auto">
                        <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full mr-2.5 object-cover bg-gray-100" />
                        <div className="flex flex-col justify-center">
                            <span className="text-xs font-semibold text-cblack dark:text-white leading-tight">{authorName}</span>
                            <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">{timeText}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default memo(CommunityFeatured);